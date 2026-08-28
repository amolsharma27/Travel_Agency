import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Package from './models/Package.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import PackageBooking from './models/PackageBooking.js';
import HotelBooking from './models/HotelBooking.js';
import TicketBooking from './models/TicketBooking.js';
import Payment from './models/Payment.js';
import Notification from './models/Notification.js';
import Wishlist from './models/Wishlist.js';
import ContactMessage from './models/ContactMessage.js';
import Coupon from './models/Coupon.js';

dotenv.config();
await connectDB();

const run = async () => {
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Package.deleteMany({}),
    Hotel.deleteMany({}),
    Room.deleteMany({}),
    PackageBooking.deleteMany({}),
    HotelBooking.deleteMany({}),
    TicketBooking.deleteMany({}),
    Payment.deleteMany({}),
    Notification.deleteMany({}),
    Wishlist.deleteMany({}),
    ContactMessage.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@travelstay.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 98765 10001',
    status: 'active',
  });

  const agency1 = await User.create({
    name: 'PCTE Travel Agency',
    email: 'agency@travelstay.com',
    password: 'Agency@123',
    role: 'agency',
    agencyName: 'PCTE Travel Agency',
    agencyDescription: 'Premium group tours, mountain expeditions, and verified hotel stays across Himachal, Kashmir, and Rajasthan.',
    agencyStatus: 'approved',
    phone: '+91 98765 43210',
    city: 'Ludhiana, Punjab',
    licenseNo: 'PB-TO-2024-0089',
    commissionRate: 8.5,
    status: 'active',
  });

  const agency2 = await User.create({
    name: 'Rajesh Negi',
    email: 'agency2@travelstay.com',
    password: 'Agency@123',
    role: 'agency',
    agencyName: 'Himalayan Wanderers Co.',
    agencyDescription: 'High altitude Spiti 4x4 safaris, trek guides, and luxury glamping across Western Himalayas.',
    agencyStatus: 'approved',
    phone: '+91 98765 44332',
    city: 'Manali, HP',
    licenseNo: 'HP-DOT-2025-4192',
    commissionRate: 9.0,
    status: 'active',
  });

  const customer1 = await User.create({
    name: 'Priya Sharma',
    email: 'customer@travelstay.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 98765 11998',
    city: 'Chandigarh',
    status: 'active',
  });

  const customer2 = await User.create({
    name: 'Rohit Sharma',
    email: 'customer@pctetravels.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 98765 43210',
    city: 'Ludhiana, Punjab',
    status: 'active',
  });

  const customer3 = await User.create({
    name: 'Karanvir Singh',
    email: 'karanvir.s@example.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 94683 99221',
    city: 'Amritsar, Punjab',
    status: 'active',
  });

  console.log('Creating coupons...');
  await Coupon.create([
    {
      code: 'WELCOME10',
      discountType: 'percent',
      discountValue: 10,
      minOrderAmount: 2000,
      maxDiscount: 1500,
      validFrom: new Date(Date.now() - 86400000 * 30),
      validUntil: new Date(Date.now() + 86400000 * 180),
      applicableTo: 'both',
      isActive: true,
    },
    {
      code: 'PCTE500',
      discountType: 'flat',
      discountValue: 500,
      minOrderAmount: 3000,
      validFrom: new Date(Date.now() - 86400000 * 30),
      validUntil: new Date(Date.now() + 86400000 * 180),
      applicableTo: 'both',
      isActive: true,
    },
  ]);

  console.log('Creating tour packages...');
  const pkg1 = await Package.create({
    agency: agency1._id,
    title: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    destination: 'Jibhi, Himachal Pradesh',
    description: 'A thrilling 4-day group departure from Punjab/Delhi exploring Jibhi waterfalls, Serolsar lake trek, and pine chalets.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80',
    ],
    price: 6999,
    discountPrice: 5999,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 24,
    availableSeats: 20,
    startDates: [new Date(Date.now() + 5 * 86400000), new Date(Date.now() + 12 * 86400000)],
    meetingPoint: 'Ludhiana / Chandigarh ISBT Phase 8',
    travelMode: 'Bus',
    itinerary: [
      { day: 1, title: 'Departure from Punjab/Delhi to Jibhi', description: 'Overnight Volvo journey through Aut tunnel.' },
      { day: 2, title: 'Jibhi Waterfall & Mini Thailand Walk', description: 'Check-in to wooden chalets and explore local river trails.' },
      { day: 3, title: 'Jalori Pass & Serolsar Lake Trek (3,120m)', description: 'Scenic high altitude trek through dense oak forest.' },
      { day: 4, title: 'Return Journey', description: 'Morning cafe crawl in Jibhi, evening departure back.' }
    ],
    inclusions: ['AC Volvo Bus transfers', '3 Nights Wooden Chalet Stay', 'Daily Breakfast & Dinner', 'Guided Jalori pass trek'],
    exclusions: ['Lunch meals', 'Personal shopping'],
    facilities: ['Volvo Coach', 'First Aid', 'Tour Leader'],
    category: 'Adventure',
    gpsLocation: { lat: 31.6382, lng: 77.3486, address: 'Jibhi, HP' },
    rating: 4.9,
    reviewsCount: 48,
    bookingsCount: 182,
    status: 'approved',
  });

  const pkg2 = await Package.create({
    agency: agency1._id,
    title: 'Kashmir Paradise Group Tour: Srinagar, Gulmarg & Pahalgam',
    destination: 'Srinagar, Jammu & Kashmir',
    description: 'Experience heaven on earth. Dal lake shikara rides, Gondola cable cars in Gulmarg, and Betaab valley pony rides in Pahalgam.',
    images: [
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    ],
    price: 17999,
    discountPrice: 14999,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 20,
    availableSeats: 16,
    startDates: [new Date(Date.now() + 8 * 86400000)],
    meetingPoint: 'Srinagar International Airport',
    travelMode: 'Flight',
    itinerary: [
      { day: 1, title: 'Arrival & Luxury Houseboat', description: 'Dal lake Shikara ride and traditional Kashmiri dinner.' },
      { day: 2, title: 'Gulmarg Meadow of Flowers & Gondola', description: 'High altitude cable car ride into the snow.' },
      { day: 3, title: 'Pahalgam Valley & Betaab Valley', description: 'Lidder river stroll and local pine sightseeing.' },
      { day: 4, title: 'Mughal Gardens Tour', description: 'Shalimar & Nishat Bagh excursion.' },
      { day: 5, title: 'Departure', description: 'Transfer to Srinagar Airport.' }
    ],
    inclusions: ['Houseboat & 4-Star Hotels', 'Daily Breakfast & Dinner', 'Private Cab', 'Shikara Ride'],
    exclusions: ['Airfare', 'Gondola Tickets'],
    facilities: ['Heated Rooms', 'Tour Guide'],
    category: 'Honeymoon',
    gpsLocation: { lat: 34.0837, lng: 74.7973, address: 'Dal Lake, Srinagar' },
    rating: 4.95,
    reviewsCount: 64,
    bookingsCount: 220,
    status: 'approved',
  });

  const pkg3 = await Package.create({
    agency: agency2._id,
    title: 'Spiti Valley 4x4 Snow Leopard Expedition',
    destination: 'Spiti Valley, Himachal Pradesh',
    description: 'Cross Kunzum Pass and stay in traditional Kaza homestays. Visit Key Monastery, Chandratal Lake, and highest post office Hikkim.',
    images: [
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=800&q=80',
    ],
    price: 18500,
    discountPrice: 16500,
    durationDays: 6,
    durationNights: 5,
    totalSeats: 12,
    availableSeats: 10,
    startDates: [new Date(Date.now() + 15 * 86400000)],
    meetingPoint: 'Shimla Old Bus Stand',
    travelMode: 'Cab',
    itinerary: [
      { day: 1, title: 'Shimla to Kalpa', description: 'Drive along the Hindustan-Tibet Highway.' },
      { day: 2, title: 'Kalpa to Kaza via Nako', description: 'Explore ancient Nako lake and Gue mummy.' },
      { day: 3, title: 'Kaza Monasteries & High Villages', description: 'Visit Key Monastery, Kibber, and Chicham bridge.' },
      { day: 4, title: 'Hikkim, Komic & Langza', description: 'Highest post office and Buddha statue on mountain.' },
      { day: 5, title: 'Kaza to Chandratal Lake Camping', description: 'Blue moon lake camp night under millions of stars.' },
      { day: 6, title: 'Chandratal to Manali / Return', description: 'Drive via Rohtang tunnel to Manali.' }
    ],
    inclusions: ['4x4 Expedition Vehicle', 'Homestays & Lake Camps', 'All meals', 'Oxygen Cylinders'],
    exclusions: ['Personal gear'],
    facilities: ['4x4 Drive', 'Oxygen', 'Road Captain'],
    category: 'Adventure',
    gpsLocation: { lat: 32.2276, lng: 78.071, address: 'Kaza, Spiti' },
    rating: 4.88,
    reviewsCount: 32,
    bookingsCount: 85,
    status: 'approved',
  });

  console.log('Creating hotels & rooms...');
  const hotel1 = await Hotel.create({
    owner: agency1._id,
    name: 'Snow Valley Himalayan Cedar Resort',
    description: 'Surrounded by deodar cedar forests, offering stunning pine valley views, central heating, and luxury suites.',
    propertyType: 'Resort',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    ],
    address: 'Log Huts Area, Old Manali Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Near Hadimba Temple',
    location: { lat: 32.2533, lng: 77.1812 },
    amenities: ['Free WiFi', 'In-house Restaurant', 'Central Heating', 'Balcony View', 'Bonfire Garden'],
    startingPrice: 3499,
    rating: 4.8,
    reviewsCount: 55,
    status: 'approved',
    isFeatured: true,
  });

  const room1 = await Room.create({
    hotel: hotel1._id,
    name: 'Deluxe Valley View Suite',
    description: 'Spacious cedar-paneled suite overlooking the Solang valley peaks.',
    maxAdults: 2,
    maxChildren: 1,
    bedType: 'King',
    sizeSqft: 360,
    basePrice: 3499,
    totalRooms: 12,
    amenities: ['AC', 'TV', 'Heater', 'Balcony', 'WiFi'],
    breakfastIncluded: true,
  });

  const hotel2 = await Hotel.create({
    owner: agency2._id,
    name: 'The Khyber Himalayan Resort',
    description: 'Premier 5-star luxury mountain resort in Gulmarg with heated indoor pool, ski concierge, and Pine forest terrace.',
    propertyType: 'Resort',
    starRating: 5,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    ],
    address: 'Gulmarg Gondola Way',
    city: 'Gulmarg',
    state: 'Jammu & Kashmir',
    country: 'India',
    landmark: 'Gulmarg Gondola Base',
    location: { lat: 34.0487, lng: 74.3812 },
    amenities: ['Free WiFi', 'Heated Indoor Pool', 'Skiing Concierge', 'Luxury Spa', 'Mountain View Restaurant'],
    startingPrice: 14500,
    rating: 4.96,
    reviewsCount: 78,
    status: 'approved',
    isFeatured: true,
  });

  const room2 = await Room.create({
    hotel: hotel2._id,
    name: 'Premier Forest View Room',
    description: 'Floor to ceiling windows showing Gulmarg pine forest and snow hills.',
    maxAdults: 2,
    maxChildren: 1,
    bedType: 'King',
    sizeSqft: 420,
    basePrice: 14500,
    totalRooms: 8,
    amenities: ['AC', 'TV', 'Central Heating', 'Bathtub', 'Balcony'],
    breakfastIncluded: true,
  });

  console.log('Creating initial realistic bookings...');
  // 1. Package Booking 1 (Rohit Sharma with Agency 1 - Confirmed)
  const pb1 = await PackageBooking.create({
    customer: customer2._id,
    package: pkg1._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() + 5 * 86400000),
    seatsBooked: 2,
    contactPhone: customer2.phone,
    contactEmail: customer2.email,
    totalAmount: 11998,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8821',
  });

  // 2. Package Booking 2 (Priya Sharma with Agency 1 - Confirmed)
  const pb2 = await PackageBooking.create({
    customer: customer1._id,
    package: pkg2._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() + 8 * 86400000),
    seatsBooked: 2,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 29998,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8829',
  });

  // 3. Hotel Booking 1 (Karanvir Singh with Agency 1 - Confirmed)
  const hb1 = await HotelBooking.create({
    customer: customer3._id,
    hotel: hotel1._id,
    room: room1._id,
    owner: agency1._id,
    checkIn: new Date(Date.now() + 10 * 86400000),
    checkOut: new Date(Date.now() + 12 * 86400000),
    nights: 2,
    roomsBooked: 1,
    adults: 2,
    contactName: customer3.name,
    contactPhone: customer3.phone,
    contactEmail: customer3.email,
    pricePerNight: 3499,
    subtotal: 6998,
    totalAmount: 6998,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8910',
  });

  // 4. Package Booking 3 (Karanvir with Agency 2 - Pending)
  const pb3 = await PackageBooking.create({
    customer: customer3._id,
    package: pkg3._id,
    agency: agency2._id,
    travelDate: new Date(Date.now() + 15 * 86400000),
    seatsBooked: 1,
    contactPhone: customer3.phone,
    contactEmail: customer3.email,
    totalAmount: 16500,
    status: 'pending_approval',
    bookingReference: 'PCTE-AG-8944',
  });

  // 5. Ticket Booking 1 (Rohit Sharma - Volvo Bus - Confirmed)
  const tb1 = await TicketBooking.create({
    customer: customer2._id,
    agency: agency1._id,
    bookingType: 'bus',
    transportType: 'buses',
    itemTitle: 'Delhi to Manali AC Volvo Sleeper (2 Seats)',
    fromCity: 'Delhi ISBT',
    toCity: 'Manali Mall Road',
    destination: 'Manali, HP',
    travelDate: new Date(Date.now() + 5 * 86400000),
    selectedOption: 'AC Multi-Axle Volvo',
    travellersCount: 2,
    contactName: customer2.name,
    contactPhone: customer2.phone,
    contactEmail: customer2.email,
    totalAmount: 2398,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingReference: 'TKT-BUS-8801',
    pickupLocation: 'Majnu Ka Tila (Delhi) 08:30 PM',
  });

  // 6. Ticket Booking 2 (Priya Sharma - Flight Ticket - Confirmed)
  const tb2 = await TicketBooking.create({
    customer: customer1._id,
    agency: agency1._id,
    bookingType: 'flight',
    transportType: 'flights',
    itemTitle: 'IndiGo Flight 6E-2194: Delhi (DEL) to Srinagar (SXR)',
    fromCity: 'Delhi (DEL)',
    toCity: 'Srinagar (SXR)',
    destination: 'Srinagar, Kashmir',
    travelDate: new Date(Date.now() + 8 * 86400000),
    selectedOption: 'Economy',
    travellersCount: 2,
    contactName: customer1.name,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 9700,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingReference: 'TKT-FLT-9921',
  });

  // 7. Completed Booking (Rohit Sharma - Past Tour)
  await PackageBooking.create({
    customer: customer2._id,
    package: pkg1._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() - 86400000 * 20),
    seatsBooked: 2,
    contactPhone: customer2.phone,
    contactEmail: customer2.email,
    totalAmount: 11998,
    status: 'completed',
    bookingReference: 'PCTE-AG-8710',
    createdAt: new Date(Date.now() - 86400000 * 25),
  });

  // 8. Cancelled Booking
  await PackageBooking.create({
    customer: customer1._id,
    package: pkg2._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() + 30 * 86400000),
    seatsBooked: 1,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 14999,
    status: 'cancelled',
    cancellationReason: 'Cancelled by customer due to personal reschedule.',
    bookingReference: 'PCTE-AG-8620',
  });

  console.log('Creating initial notifications & wishlist...');
  await Notification.create([
    {
      user: customer2._id,
      title: 'Booking Confirmed!',
      message: 'Your booking for Himachal Group Tour is confirmed. Boarding reference: PCTE-AG-8821.',
      type: 'booking',
    },
    {
      user: customer2._id,
      title: 'Volvo E-Ticket Ready',
      message: 'Your Volvo bus seat boarding pass (TKT-BUS-8801) is ready for download.',
      type: 'booking',
    },
    {
      user: customer1._id,
      title: 'Kashmir Tour Confirmed',
      message: 'Your departure for Srinagar & Gulmarg is scheduled for next week.',
      type: 'booking',
    },
  ]);

  await Wishlist.create([
    { user: customer2._id, itemType: 'package', package: pkg2._id },
    { user: customer2._id, itemType: 'hotel', hotel: hotel2._id },
    { user: customer1._id, itemType: 'package', package: pkg1._id },
  ]);

  console.log('Creating contact messages...');
  await ContactMessage.create([
    {
      name: 'Rohan Joshi',
      email: 'rohan.j@example.com',
      phone: '+91 98765 22334',
      subject: 'Inquiry for 15-passenger corporate group to Spiti',
      message: 'We are planning a corporate retreat to Spiti Valley in October. Please share customized package quote.',
      status: 'open',
    },
  ]);

  console.log('=======================================');
  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
  console.log('---------------------------------------');
  console.log('Admin login:     admin@travelstay.com / Admin@123');
  console.log('Agency 1 login:  agency@travelstay.com / Agency@123 (PCTE Travel Agency)');
  console.log('Agency 2 login:  agency2@travelstay.com / Agency@123 (Himalayan Wanderers)');
  console.log('Customer 1 login: customer@travelstay.com / Customer@123 (Priya Sharma)');
  console.log('Customer 2 login: customer@pctetravels.com / Customer@123 (Rohit Sharma)');
  console.log('=======================================');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
