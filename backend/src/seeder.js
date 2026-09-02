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
import Review from './models/Review.js';

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
    Review.deleteMany({}),
  ]);

  console.log('Creating users...');
  // 1. Admins
  const admin1 = await User.create({
    name: 'PCTE Admin',
    email: 'admin@pctetravels.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 98765 43211',
    status: 'active',
  });

  const admin2 = await User.create({
    name: 'Super Admin',
    email: 'admin@travelstay.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 98765 10001',
    status: 'active',
  });

  // 2. Agencies
  const agency1 = await User.create({
    name: 'PCTE Travel Agency',
    email: 'agency@pctetravels.com',
    password: 'Agency@123',
    role: 'agency',
    agencyName: 'PCTE Travel Agency — Freedom To Evolve',
    agencyDescription: 'Premier Punjab & North India Tour Operator specializing in group departures, customized private holidays, adventure sports, transport logistics, and passport assistance.',
    agencyStatus: 'approved',
    phone: '+91 98765 43210',
    city: 'Ludhiana, Punjab',
    licenseNo: 'PB-TO-2024-0089',
    commissionRate: 8.5,
    status: 'active',
    bankAccountName: 'PCTE Travel Expeditions Pvt Ltd',
    bankAccountNumber: '50200088192019',
    bankIfsc: 'HDFC0000128',
    bankName: 'HDFC Bank, Mall Road Ludhiana',
    website: 'https://pctetravels.com',
  });

  const agencyAlt = await User.create({
    name: 'PCTE Travel Agency (TravelStay)',
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

  // 3. Customers
  const customer1 = await User.create({
    name: 'Amol Sharma',
    email: 'amolsharma2705@gmail.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 99881 10021',
    city: 'Ludhiana',
    state: 'Punjab',
    address: 'PCTE Campus / Ludhiana, Punjab',
    passportNumber: 'Z8923412',
    passportExpiry: '2032-11-15',
    aadhaarLast4: '8821',
    status: 'active',
  });

  const customer2 = await User.create({
    name: 'Priya Verma',
    email: 'customer@travelstay.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 98765 11998',
    city: 'Chandigarh',
    state: 'Punjab',
    address: 'Sector 34A, Chandigarh',
    passportNumber: 'P7821902',
    passportExpiry: '2030-08-20',
    aadhaarLast4: '4192',
    status: 'active',
  });

  const customer3 = await User.create({
    name: 'Karanvir Singh',
    email: 'karanvir.s@example.com',
    password: 'Customer@123',
    role: 'customer',
    phone: '+91 94683 99221',
    city: 'Amritsar',
    state: 'Punjab',
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
    {
      code: 'HIMALAYA15',
      discountType: 'percent',
      discountValue: 15,
      minOrderAmount: 5000,
      maxDiscount: 2500,
      validFrom: new Date(Date.now() - 86400000 * 10),
      validUntil: new Date(Date.now() + 86400000 * 90),
      applicableTo: 'both',
      isActive: true,
    }
  ]);

  console.log('Creating tour packages...');
  const pkg1 = await Package.create({
    agency: agency1._id,
    title: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    destination: 'Jibhi & Tirthan Valley, Himachal Pradesh',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Mountains & Valleys',
    description: 'Depart together with fellow travelers on a scenic Himalayan mountain exploration. Experience lush pine forests of Tirthan Valley, traditional wooden cottages, the majestic Jalori Pass at 10,800 ft, and a gentle snow-pine hike to Serolsar Lake.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 8500,
    discountPrice: 5999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 24,
    availableSeats: 9,
    startDates: [new Date(Date.now() + 4 * 86400000), new Date(Date.now() + 11 * 86400000)],
    meetingPoint: 'Majnu Ka Tila (Delhi) / Tribune Chowk (Chandigarh)',
    travelMode: 'AC Deluxe Coach / Pushback Traveller',
    itinerary: [
      { day: 1, title: 'Overnight Departure from Delhi / Chandigarh', description: 'Meet the tour lead and board AC Pushback Coach. Scenic highway drive via Bilaspur, Mandi, and the Aut Tunnel.' },
      { day: 2, title: 'Arrival in Tirthan, Jibhi Waterfall & Bonfire', description: 'Check in to riverside wooden cottage rooms. Fresh breakfast followed by hike to Jibhi Waterfall and an evening bonfire with light acoustic music.' },
      { day: 3, title: 'Jalori Pass & Serolsar Lake Forest Hike', description: 'Drive up to Jalori Pass (10,800 ft) for 360-degree Himalayan views. Guided 5 km trail to Serolsar Lake. Board return coach in the evening.' }
    ],
    inclusions: [
      'AC Coach transfers from Delhi / Chandigarh & back',
      '2 Nights stay in Riverside Wooden Cottages',
      'Breakfast and Dinner as per itinerary',
      'Guided Serolsar Lake nature hike',
      'Evening Bonfire with group music',
      'Trip coordinator and first-aid support'
    ],
    exclusions: ['Lunch and personal cafe spending', 'Entry tickets if applicable'],
    facilities: ['Group Tour Lead', 'AC Coach Transfers', 'Riverside Stay', 'Meals Included'],
    category: 'Group Tours',
    gpsLocation: { lat: 31.6373, lng: 77.4721, address: 'Jibhi, Himachal Pradesh' },
    rating: 4.9,
    reviewsCount: 310,
    bookingsCount: 840,
    status: 'approved',
    isActive: true,
  });

  const pkg2 = await Package.create({
    agency: agency1._id,
    title: 'Kashmir Paradise Group Tour: Srinagar, Gulmarg & Pahalgam',
    destination: 'Srinagar, Gulmarg & Pahalgam, Kashmir',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Lakes & Meadows',
    description: 'Experience heaven on earth. Enjoy sunset Shikara rides on Dal Lake, stay in heritage cedar-paneled houseboats, ride the world famous Gulmarg Gondola over snow ridges, and explore the pine meadows of Pahalgam.',
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 18500,
    discountPrice: 14999,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 20,
    availableSeats: 6,
    startDates: [new Date(Date.now() + 6 * 86400000), new Date(Date.now() + 13 * 86400000)],
    meetingPoint: 'Srinagar International Airport (SXR)',
    travelMode: 'Private AC Tempo / Innova Cabs',
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar & Dal Lake Shikara Ride', description: 'Airport pickup, check in to Luxury Dal Lake Houseboat, and sunset shikara ride across floating lotus gardens.' },
      { day: 2, title: 'Gulmarg Day Excursion & Cable Car Gondola', description: 'Scenic drive to Gulmarg. Ascend to Kongdoori and Apharwat peak on the Gondola with snow vistas.' },
      { day: 3, title: 'Pahalgam Valley of Shepherds & Betaab Valley', description: 'Drive via saffron fields of Pampore to Pahalgam. Stroll along the rushing Lidder River.' },
      { day: 4, title: 'Srinagar Mughal Gardens & Shankaracharya', description: 'Visit Nishat Bagh, Shalimar Bagh, and Shankaracharya hilltop temple for panoramic city views.' },
      { day: 5, title: 'Airport Departure', description: 'Morning souvenir shopping for dry fruits & Pashmina stoles, airport drop.' }
    ],
    inclusions: [
      '1 Night in Luxury Dal Lake Houseboat + 3 Nights in 4-Star Srinagar Resort',
      'Breakfast and authentic Kashmiri dinners',
      'Dedicated AC Tempo Traveller / Cab for all 5 days',
      '1-Hour complimentary Shikara Ride on Dal Lake',
      'Toll taxes, parking, and driver allowances'
    ],
    exclusions: ['Airfare / Train tickets to Srinagar', 'Gulmarg Gondola tickets (booked directly)'],
    facilities: ['4-Star Hotels & Houseboat', 'Private Cab Logistics', 'Kashmiri Cuisine', 'Tour Coordinator'],
    gpsLocation: { lat: 34.0837, lng: 74.7973, address: 'Dal Lake, Srinagar, Kashmir' },
    rating: 4.95,
    reviewsCount: 428,
    bookingsCount: 1120,
    status: 'approved',
    isActive: true,
  });

  const pkg3 = await Package.create({
    agency: agency2._id,
    title: 'Spiti Valley 4x4 Snow Leopard & High Passes Expedition',
    destination: 'Kaza, Tabo & Chandratal, Spiti Valley (HP)',
    tourType: 'Adventure Tour',
    category: 'Adventure Tours',
    theme: 'High Altitude Expedition',
    description: 'The ultimate Himalayan cross-country circuit in dedicated 4x4 vehicles. Drive past Kunzum Pass at 15,000 ft, stay in traditional homestays, visit ancient 1000-year-old Key Monastery, mail postcards from the highest post office Hikkim, and stargaze at Chandratal Lake.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 19500,
    discountPrice: 16500,
    durationDays: 6,
    durationNights: 5,
    totalSeats: 12,
    availableSeats: 4,
    startDates: [new Date(Date.now() + 10 * 86400000)],
    meetingPoint: 'Shimla Old Bus Stand / Chandigarh ISBT',
    travelMode: '4x4 Expedition Scorpio / Bolero Camper',
    itinerary: [
      { day: 1, title: 'Shimla to Kalpa via Kinnaur Valley', description: 'Drive along the Hindustan-Tibet Highway with views of the Kinner Kailash peak.' },
      { day: 2, title: 'Kalpa to Kaza via Nako Lake & Gue Mummy', description: 'Cross high desert terrains and visit the 500-year-old preserved monk mummy in Gue.' },
      { day: 3, title: 'Key Monastery, Kibber & Chicham Bridge (Highest Suspension Bridge)', description: 'Explore ancient cliffside monasteries and cross Asia’s highest bridge in Spiti.' },
      { day: 4, title: 'Hikkim, Komic (Highest Village) & Langza Fossil Village', description: 'Send letters from highest post office and view giant Buddha statue overlooking snow mountains.' },
      { day: 5, title: 'Kaza to Chandratal Moon Lake Stargazing Camp', description: 'Cross Kunzum Pass (14,931 ft) and camp near the turquoise crescent Chandratal Lake.' },
      { day: 6, title: 'Chandratal to Manali via Atal Tunnel & Return', description: 'Cross Rohtang Pass region and exit via Atal Tunnel to Manali.' }
    ],
    inclusions: [
      'Dedicated 4x4 Mountain Vehicle with expert hill captain',
      '5 Nights accommodation in cozy Spitian homestays & lake camps',
      'All daily Breakfasts and warm mountain Dinners',
      'Oxygen cylinder and high-altitude emergency medical kit',
      'Inner-line permits and environmental green fees'
    ],
    exclusions: ['Personal riding gear', 'Lunch cafe meals'],
    facilities: ['4x4 Vehicle', 'Oxygen Support', 'Homestay Experience', 'Certified Road Captain'],
    gpsLocation: { lat: 32.2276, lng: 78.071, address: 'Kaza, Spiti Valley, Himachal Pradesh' },
    rating: 4.88,
    reviewsCount: 192,
    bookingsCount: 460,
    status: 'approved',
    isActive: true,
  });

  const pkg4 = await Package.create({
    agency: agency1._id,
    title: 'Rajasthan Royal Heritage Group Tour: Jaipur, Jodhpur & Jaisalmer',
    destination: 'Jaipur, Jodhpur & Jaisalmer, Rajasthan',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Desert & Forts',
    description: 'Thar desert camel safaris, Sam sand dunes luxury Swiss tent camping, Amer fort elephant pathway, and Mehrangarh palace heritage tour.',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 12500,
    discountPrice: 9800,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 18,
    availableSeats: 6,
    startDates: [new Date(Date.now() + 8 * 86400000)],
    meetingPoint: 'Jaipur Junction Railway Station / Airport',
    travelMode: 'AC Deluxe Coach',
    itinerary: [
      { day: 1, title: 'Jaipur Pink City & Amer Fort', description: 'Hawa Mahal photo stop, Jal Mahal, and Amer Fort guided walk.' },
      { day: 2, title: 'Jaipur to Jodhpur Blue City', description: 'Mehrangarh Fort, Jaswant Thada, and local spice markets.' },
      { day: 3, title: 'Jodhpur to Jaisalmer Sam Sand Dunes', description: 'Camel safari at sunset and Rajasthani cultural folk dance bonfire night.' },
      { day: 4, title: 'Jaisalmer Golden Fort & Departure', description: 'Living fort tour and drop at Jaisalmer / Jodhpur.' }
    ],
    inclusions: ['AC Coach Transfers', 'Heritage Stays & Desert Swiss Tents', 'Breakfast & Dinners', 'Camel Safari'],
    exclusions: ['Monument entry tickets'],
    facilities: ['AC Coach', 'Swiss Tents', 'Folk Dance', 'Tour Guide'],
    rating: 4.85,
    reviewsCount: 165,
    bookingsCount: 390,
    status: 'approved',
    isActive: true,
  });

  console.log('Creating hotels & rooms...');
  const hotel1 = await Hotel.create({
    owner: agency1._id,
    name: 'Snow Valley Himalayan Cedar Resort & Spa',
    description: 'Surrounded by deodar cedar forests, offering stunning pine valley views, central heating, luxury suites, and a world-class wellness spa in Old Manali.',
    propertyType: 'Resort',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    address: 'Log Huts Area, Old Manali Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Near Hadimba Temple',
    location: { lat: 32.2533, lng: 77.1812 },
    amenities: ['Free WiFi', 'In-house Restaurant', 'Central Heating', 'Balcony View', 'Bonfire Garden', 'Spa'],
    startingPrice: 2899,
    rating: 4.85,
    reviewsCount: 124,
    status: 'approved',
    isFeatured: true,
  });

  const room1 = await Room.create({
    hotel: hotel1._id,
    name: 'Deluxe Pine-View Balcony Room',
    description: 'Spacious cedar-paneled suite overlooking the Solang valley peaks.',
    maxAdults: 2,
    maxChildren: 1,
    bedType: 'King',
    sizeSqft: 360,
    basePrice: 2899,
    totalRooms: 12,
    amenities: ['AC', 'TV', 'Heater', 'Balcony', 'WiFi'],
    breakfastIncluded: true,
  });

  const room1_2 = await Room.create({
    hotel: hotel1._id,
    name: 'Executive Himalayan Suite',
    description: 'Top floor luxury suite with private panoramic glass balcony and jacuzzi tub.',
    maxAdults: 3,
    maxChildren: 2,
    bedType: 'King',
    sizeSqft: 520,
    basePrice: 4499,
    totalRooms: 6,
    amenities: ['AC', 'TV', 'Central Heating', 'Jacuzzi', 'Balcony', 'WiFi'],
    breakfastIncluded: true,
  });

  const hotel2 = await Hotel.create({
    owner: agency2._id,
    name: 'The Khyber Himalayan Resort & Spa',
    description: 'Premier 5-star luxury mountain resort in Gulmarg with heated indoor pool, ski concierge, and Pine forest terrace overlooking snow peaks.',
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
    landmark: 'Gulmarg Gondola Base Station',
    location: { lat: 34.0487, lng: 74.3812 },
    amenities: ['Free WiFi', 'Heated Indoor Pool', 'Skiing Concierge', 'Luxury Spa', 'Mountain View Restaurant'],
    startingPrice: 14500,
    rating: 4.96,
    reviewsCount: 210,
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

  const hotel3 = await Hotel.create({
    owner: agency1._id,
    name: 'Tirthan Valley Riverside Wooden Chalet',
    description: 'Charming authentic alpine wooden cottages situated directly on the bank of the rushing Tirthan river with private bonfire deck.',
    propertyType: 'Cottage',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Near Jibhi Waterfall, Banjar Valley',
    city: 'Jibhi',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Tirthan River Bridge',
    location: { lat: 31.6373, lng: 77.4721 },
    amenities: ['Free WiFi', 'Riverside Cafe', 'Bonfire Deck', 'Trout Fishing', 'Mountain View'],
    startingPrice: 2400,
    rating: 4.88,
    reviewsCount: 88,
    status: 'approved',
    isFeatured: true,
  });

  const room3 = await Room.create({
    hotel: hotel3._id,
    name: 'Riverside Alpine Wooden Cottage',
    description: 'Pure cedar wood construction with soothing river sounds and balcony.',
    maxAdults: 2,
    maxChildren: 1,
    bedType: 'Queen',
    sizeSqft: 320,
    basePrice: 2400,
    totalRooms: 10,
    amenities: ['Heater', 'Balcony', 'WiFi', 'River View'],
    breakfastIncluded: true,
  });

  console.log('Creating realistic bookings...');
  // 1. Package Booking 1 (Rohit Sharma - Confirmed)
  const pb1 = await PackageBooking.create({
    customer: customer1._id,
    package: pkg1._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() + 5 * 86400000),
    seatsBooked: 2,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 11998,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8821',
  });

  // 2. Package Booking 2 (Priya Verma - Confirmed)
  const pb2 = await PackageBooking.create({
    customer: customer2._id,
    package: pkg2._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() + 8 * 86400000),
    seatsBooked: 2,
    contactPhone: customer2.phone,
    contactEmail: customer2.email,
    totalAmount: 29998,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8829',
  });

  // 3. Hotel Booking 1 (Karanvir Singh - Confirmed)
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
    pricePerNight: 2899,
    subtotal: 5798,
    totalAmount: 5798,
    status: 'confirmed',
    bookingReference: 'PCTE-AG-8910',
  });

  // 4. Ticket Booking 1 (Rohit Sharma - Volvo Bus)
  const tb1 = await TicketBooking.create({
    customer: customer1._id,
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
    contactName: customer1.name,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 2398,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingReference: 'TKT-BUS-8801',
    pickupLocation: 'Majnu Ka Tila (Delhi) 08:30 PM',
  });

  // 5. Ticket Booking 2 (Priya Verma - Flight Ticket)
  const tb2 = await TicketBooking.create({
    customer: customer2._id,
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
    contactName: customer2.name,
    contactPhone: customer2.phone,
    contactEmail: customer2.email,
    totalAmount: 9700,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingReference: 'TKT-FLT-9921',
  });

  // 6. Passport Request (Rohit Sharma)
  const tbPassport = await TicketBooking.create({
    customer: customer1._id,
    agency: agency1._id,
    bookingType: 'passport',
    itemTitle: 'Fresh Adult 36-Page Passport Assistance',
    destination: 'PSK Ludhiana (Model Town)',
    travelDate: new Date(Date.now() + 7 * 86400000),
    travellersCount: 1,
    contactName: customer1.name,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 1999,
    status: 'under_review',
    paymentStatus: 'paid',
    bookingReference: 'MEA-LDH-2026-88192',
    specialNotes: 'DOB: 1998-05-27. Assigned Office: PSK Ludhiana (Model Town). Pre-screening complete.',
  });

  // 7. Activity Booking (Rohit Sharma - Bungee Jumping)
  const tbAct = await TicketBooking.create({
    customer: customer1._id,
    agency: agency1._id,
    bookingType: 'activity',
    itemTitle: '83-Meter Bungee Jumping Slot (Mohan Chatti)',
    destination: 'Rishikesh, Uttarakhand',
    travelDate: new Date(Date.now() + 15 * 86400000),
    travellersCount: 1,
    selectedOption: '11:00 AM Slot',
    contactName: customer1.name,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 3550,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingReference: 'ACT-BNG-9021',
  });

  // 8. Completed Past Tour Booking (Rohit Sharma)
  await PackageBooking.create({
    customer: customer1._id,
    package: pkg1._id,
    agency: agency1._id,
    travelDate: new Date(Date.now() - 86400000 * 20),
    seatsBooked: 2,
    contactPhone: customer1.phone,
    contactEmail: customer1.email,
    totalAmount: 11998,
    status: 'completed',
    bookingReference: 'PCTE-AG-8710',
    createdAt: new Date(Date.now() - 86400000 * 25),
  });

  console.log('Creating payments...');
  await Payment.create([
    {
      user: customer1._id,
      bookingType: 'package',
      packageBooking: pb1._id,
      amount: 11998,
      status: 'paid',
      razorpayOrderId: 'order_mock_8801',
      razorpayPaymentId: 'pay_mock_8801',
      method: 'UPI (PhonePe)',
    },
    {
      user: customer2._id,
      bookingType: 'package',
      packageBooking: pb2._id,
      amount: 29998,
      status: 'paid',
      razorpayOrderId: 'order_mock_8829',
      razorpayPaymentId: 'pay_mock_8829',
      method: 'Google Pay',
    },
    {
      user: customer3._id,
      bookingType: 'hotel',
      hotelBooking: hb1._id,
      amount: 5798,
      status: 'paid',
      razorpayOrderId: 'order_mock_8910',
      razorpayPaymentId: 'pay_mock_8910',
      method: 'HDFC NetBanking',
    }
  ]);

  console.log('Creating notifications & wishlist...');
  await Notification.create([
    {
      user: customer1._id,
      title: 'Tour Booking Confirmed!',
      message: 'Your trip to Himachal & Jibhi is confirmed. Boarding report time: 08:30 PM (Majnu Ka Tila / Tribune Chowk). Ref: PCTE-AG-8821.',
      type: 'booking',
      isRead: false,
    },
    {
      user: customer1._id,
      title: 'Payment Verified & Settled',
      message: '₹11,998 payment received successfully for Himachal Group Tour pass (Ref: PAY-TX-9901).',
      type: 'payment',
      isRead: false,
    },
    {
      user: customer1._id,
      title: 'Volvo E-Ticket Ready',
      message: 'Your Volvo bus seat boarding pass (TKT-BUS-8801) is ready for download.',
      type: 'booking',
      isRead: true,
    },
    {
      user: customer1._id,
      title: 'Passport Dossier Pre-Screened',
      message: 'MEA-LDH-2026-88192 verified by compliance desk. Appointment at PSK Ludhiana scheduled.',
      type: 'system',
      isRead: true,
    },
    {
      user: customer2._id,
      title: 'Kashmir Paradise Tour Confirmed',
      message: 'Your departure for Srinagar & Gulmarg is scheduled for next week.',
      type: 'booking',
      isRead: false,
    },
  ]);

  await Wishlist.create([
    { user: customer1._id, itemType: 'package', package: pkg2._id },
    { user: customer1._id, itemType: 'hotel', hotel: hotel2._id },
    { user: customer2._id, itemType: 'package', package: pkg1._id },
  ]);

  console.log('Creating contact and support messages...');
  await ContactMessage.create([
    {
      user: customer1._id,
      name: 'Amol Sharma',
      email: 'amolsharma2705@gmail.com',
      phone: '+91 99881 10021',
      subject: 'PSK Appointment Slot Rescheduling for Tatkaal Application',
      message: 'Need to shift PSK Ludhiana appointment slot from Friday 10 AM to next Monday due to a business meeting in Chandigarh.',
      status: 'in_progress',
      adminReply: 'We have initiated the slot reschedule with PSK Ludhiana. New confirmation receipt will be updated here shortly.',
    },
    {
      user: customer2._id,
      name: 'Priya Verma',
      email: 'customer@travelstay.com',
      phone: '+91 98765 11998',
      subject: 'Vegetarian Meal Inclusions for Jibhi Group Departure',
      message: 'We are a group of 2 booking the Friday Jibhi departure. Please confirm pure vegetarian bonfire dinners.',
      status: 'resolved',
      adminReply: 'Pure vegetarian dinner confirmed with the tour coordinator at the Tirthan riverside wooden cottage.',
    },
    {
      name: 'Rohan Joshi',
      email: 'rohan.j@example.com',
      phone: '+91 98765 22334',
      subject: 'Inquiry for 15-passenger corporate group to Spiti',
      message: 'We are planning a corporate retreat to Spiti Valley in October. Please share customized package quote.',
      status: 'open',
    }
  ]);

  console.log('Creating verified reviews...');
  await Review.create([
    {
      user: customer1._id,
      targetType: 'package',
      package: pkg1._id,
      rating: 5,
      title: 'Flawless arrangements in Jibhi!',
      comment: 'Exceptional trip! The riverside wooden cottages in Jibhi and the Serolsar lake hike were very well coordinated. Bus was comfortable with timely stops.',
      status: 'visible',
      ownerReply: { text: 'Thank you Rohit! Delighted to hear you had a great trip with us.', repliedAt: new Date() }
    },
    {
      user: customer2._id,
      targetType: 'package',
      package: pkg2._id,
      rating: 5,
      title: 'Kashmir truly is paradise!',
      comment: 'Dal Lake shikara ride at sunset was pure magic. Gulmarg gondola Phase 2 tickets were arranged beforehand so we had zero wait time.',
      status: 'visible',
      ownerReply: { text: 'Thank you Priya! Looking forward to welcoming you on another tour soon.', repliedAt: new Date() }
    },
    {
      user: customer3._id,
      targetType: 'hotel',
      hotel: hotel1._id,
      rating: 4.9,
      title: 'Stunning cedar valley view',
      comment: 'Pine forest view from the balcony room was breathtaking. Food in the restaurant was authentic and hygienic.',
      status: 'visible',
    }
  ]);

  console.log('===================================================================');
  console.log('✅ PCTE TRAVEL AGENCY DATABASE SEEDING COMPLETED SUCCESSFULLY');
  console.log('===================================================================');
  console.log('⚡ 1-Click Demo Login Credentials:');
  console.log('  Customer: amolsharma2705@gmail.com / Customer@123 (Amol Sharma)');
  console.log('  Agency:   agency@pctetravels.com   / Agency@123 (PCTE Travel Agency)');
  console.log('  Admin:    admin@pctetravels.com    / Admin@123');
  console.log('-------------------------------------------------------------------');
  console.log('  Customer (Alt): customer@travelstay.com / Customer@123 (Priya Verma)');
  console.log('  Agency (Alt):   agency@travelstay.com   / Agency@123');
  console.log('  Agency 2:       agency2@travelstay.com  / Agency@123 (Himalayan Wanderers)');
  console.log('  Admin (Alt):    admin@travelstay.com    / Admin@123');
  console.log('===================================================================');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
