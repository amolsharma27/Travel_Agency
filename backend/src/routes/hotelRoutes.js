import express from 'express';
import {
  getHotels, getHotelByIdOrSlug, getSimilarHotels, createHotel, updateHotel,
  deleteHotel, getMyHotels, moderateHotel, getPendingHotels,
} from '../controllers/hotelController.js';
import {
  createRoom, getHotelRooms, updateRoom, deleteRoom, checkRoomAvailability,
} from '../controllers/roomController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public search/list
router.get('/', getHotels);

// Owner management
router.get('/owner/mine', protect, requireApprovedAgency, getMyHotels);
router.post('/', protect, requireApprovedAgency, upload.array('images', 10), createHotel);

// Admin moderation
router.get('/admin/pending', protect, authorize('admin'), getPendingHotels);
router.put('/:id/moderate', protect, authorize('admin'), moderateHotel);

router.put('/:id', protect, requireApprovedAgency, upload.array('images', 10), updateHotel);
router.delete('/:id', protect, requireApprovedAgency, deleteHotel);
router.get('/:id/similar', getSimilarHotels);

// Rooms (nested under a hotel)
router.get('/:hotelId/rooms', getHotelRooms);
router.post('/:hotelId/rooms', protect, requireApprovedAgency, upload.array('images', 6), createRoom);
router.put('/:hotelId/rooms/:roomId', protect, requireApprovedAgency, upload.array('images', 6), updateRoom);
router.delete('/:hotelId/rooms/:roomId', protect, requireApprovedAgency, deleteRoom);
router.get('/:hotelId/rooms/:roomId/availability', checkRoomAvailability);

// Public single-hotel view (kept last so it doesn't shadow routes above)
router.get('/:idOrSlug', getHotelByIdOrSlug);

export default router;
