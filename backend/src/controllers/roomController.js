import asyncHandler from 'express-async-handler';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import RoomAvailability from '../models/RoomAvailability.js';
import { recalculateStartingPrice } from './hotelController.js';

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const dateRange = (checkIn, checkOut) => {
  const dates = [];
  let cur = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  while (cur < end) {
    dates.push(new Date(cur));
    cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
  }
  return dates;
};

const assertHotelOwnership = async (hotelId, user) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error('Hotel not found');
    err.status = 404;
    throw err;
  }
  if (String(hotel.owner) !== String(user._id) && user.role !== 'admin') {
    const err = new Error('Not authorized for this hotel');
    err.status = 403;
    throw err;
  }
  return hotel;
};

// @desc  Add a room type to a hotel
// @route POST /api/hotels/:hotelId/rooms
// @access Private/Agency (hotel owner)
export const createRoom = asyncHandler(async (req, res) => {
  await assertHotelOwnership(req.params.hotelId, req.user);
  const room = await Room.create({ ...req.body, hotel: req.params.hotelId });
  await recalculateStartingPrice(req.params.hotelId);
  res.status(201).json({ success: true, data: room });
});

// @desc  List room types for a hotel (owner management view, includes inactive)
// @route GET /api/hotels/:hotelId/rooms
// @access Public (active only) / Private for owner (all)
export const getHotelRooms = asyncHandler(async (req, res) => {
  const isOwnerView = req.user && String(req.query.owner) === 'true';
  const filter = { hotel: req.params.hotelId };
  if (!isOwnerView) filter.isActive = true;
  const rooms = await Room.find(filter);
  res.json({ success: true, count: rooms.length, data: rooms });
});

// @desc  Update a room type
// @route PUT /api/hotels/:hotelId/rooms/:roomId
// @access Private/Agency (hotel owner)
export const updateRoom = asyncHandler(async (req, res) => {
  await assertHotelOwnership(req.params.hotelId, req.user);
  const room = await Room.findOneAndUpdate(
    { _id: req.params.roomId, hotel: req.params.hotelId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  await recalculateStartingPrice(req.params.hotelId);
  res.json({ success: true, data: room });
});

// @desc  Delete a room type
// @route DELETE /api/hotels/:hotelId/rooms/:roomId
// @access Private/Agency (hotel owner)
export const deleteRoom = asyncHandler(async (req, res) => {
  await assertHotelOwnership(req.params.hotelId, req.user);
  const room = await Room.findOneAndDelete({ _id: req.params.roomId, hotel: req.params.hotelId });
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  await RoomAvailability.deleteMany({ room: room._id });
  await recalculateStartingPrice(req.params.hotelId);
  res.json({ success: true, message: 'Room type deleted' });
});

// @desc  Check live availability + price for a room across a date range
// @route GET /api/hotels/:hotelId/rooms/:roomId/availability?checkIn=&checkOut=
// @access Public
export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error('checkIn and checkOut dates are required');
  }

  const room = await Room.findOne({ _id: req.params.roomId, hotel: req.params.hotelId });
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const dates = dateRange(checkIn, checkOut);
  if (!dates.length) {
    res.status(400);
    throw new Error('checkOut must be after checkIn');
  }

  const availabilityDocs = await RoomAvailability.find({
    room: room._id,
    date: { $in: dates },
  });
  const byDate = new Map(availabilityDocs.map((a) => [a.date.toISOString(), a]));

  let minAvailable = room.totalRooms;
  let totalPrice = 0;
  const nightly = dates.map((d) => {
    const doc = byDate.get(d.toISOString());
    const bookedAndBlocked = (doc?.bookedCount || 0) + (doc?.blockedCount || 0);
    const available = Math.max(room.totalRooms - bookedAndBlocked, 0);
    minAvailable = Math.min(minAvailable, available);
    const price = room.priceForDate(d);
    totalPrice += price;
    return { date: d, availableRooms: available, price };
  });

  res.json({
    success: true,
    data: {
      roomId: room._id,
      nights: dates.length,
      minAvailableAcrossStay: minAvailable,
      isAvailable: minAvailable > 0,
      totalPrice,
      averagePricePerNight: Math.round(totalPrice / dates.length),
      nightly,
    },
  });
});
