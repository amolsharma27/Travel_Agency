// Comprehensive data store for Travel & Stay with budget affordable options & rich trip memories

export const mockUsers = {
  customer: {
    _id: 'cust_001',
    name: 'Priya Sharma',
    email: 'customer@travelstay.com',
    role: 'customer',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    city: 'Ludhiana, Punjab',
    joinedDate: 'March 2023',
    tripsCompleted: 4,
    spotsVisited: 18,
    reviewsGiven: 7,
  },
  agency: {
    _id: 'agency_001',
    name: 'Wanderlust Holidays',
    email: 'agency@travelstay.com',
    role: 'agency',
    agencyName: 'Wanderlust Holidays',
    agencyDescription: 'Premium & budget-friendly tours, honeymoon escapes, and luxury hotel packages across India since 2012.',
    agencyStatus: 'approved',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  admin: {
    _id: 'admin_001',
    name: 'TravelStay Admin',
    email: 'admin@travelstay.com',
    role: 'admin',
    phone: '+91 98000 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  }
};

export const mockPackages = [
  {
    _id: 'pkg_001',
    title: 'Budget Manali & Solang Valley Adventure',
    destination: 'Manali, Himachal Pradesh',
    description: 'A pocket-friendly 5-day escape through snow-capped Himalayan peaks, riverside campsites, cafe culture in Old Manali, and adventure activities at Solang Valley.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80'
    ],
    price: 6999,
    discountPrice: 4999,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 25,
    availableSeats: 18,
    startDates: [new Date(Date.now() + 5 * 86400000).toISOString(), new Date(Date.now() + 18 * 86400000).toISOString()],
    meetingPoint: 'Majnu Ka Tila, Delhi',
    travelMode: 'Semi-Sleeper AC Bus',
    itinerary: [
      { day: 1, title: 'Delhi to Manali Overnight Journey', description: 'Board the AC Semi-Sleeper Volvo bus from Delhi in the evening. Overnight scenic drive through Punjab & Himachal foothills.' },
      { day: 2, title: 'Manali Arrival & Cafe Hopping in Old Manali', description: 'Check-in to our mountain view stay. Visit Hadimba Devi Temple, Tibetan Monastery, and spend the evening enjoying live acoustic music at Old Manali cafes.' },
      { day: 3, title: 'Solang Valley Snow & Adventure Excursion', description: 'Head to Solang Valley. Enjoy snow activities, paragliding, zorbing, and capture stunning panoramic photos of the snow-clad Pir Panjal range.' },
      { day: 4, title: 'Jogini Waterfall Trek & Vashisht Hot Springs', description: 'Picturesque pine forest trek to the breathtaking Jogini Waterfall. Afternoon dip in the natural therapeutic hot sulphur springs of Vashisht village.' },
      { day: 5, title: 'Local Shopping & Return Journey', description: 'Explore Mall Road for handcrafted woolen shawls and apple cider. Board the return Volvo to Delhi with unforgettable memories.' }
    ],
    inclusions: ['Semi-Sleeper AC Volvo Transfers (Delhi-Manali-Delhi)', '3 Nights accommodation in 3-Star Hill View Stay', 'Daily Breakfast & Dinner', 'Local sightseeing cab as per itinerary', 'First-aid & Tour Coordinator assistance'],
    exclusions: ['Adventure activities tickets (paragliding/skiing)', 'Lunch and personal snacks', 'Monuments entry fees'],
    facilities: ['AC Volvo Bus', 'Mountain View Rooms', 'Daily Bonfire with Music', '24/7 Coordinator'],
    category: 'Adventure',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 32.2432, lng: 77.1892, address: 'Old Manali, HP' },
    rating: 4.85,
    reviewsCount: 142,
    bookingsCount: 380,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_002',
    title: 'Rishikesh River Rafting, Camping & Ganga Aarti',
    destination: 'Rishikesh, Uttarakhand',
    description: 'The ultimate weekend recharge. Camp under the stars by the river, conquer 16km rapids on the holy Ganges, cliff jump, and witness the divine Ganga Aarti.',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    price: 4499,
    discountPrice: 2999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 35,
    availableSeats: 24,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString(), new Date(Date.now() + 12 * 86400000).toISOString()],
    meetingPoint: 'Haridwar Railway Station / Rishikesh ISBT',
    travelMode: 'Cab / Shared Traveller',
    itinerary: [
      { day: 1, title: 'Arrival, Camp Check-in & Triveni Ghat Aarti', description: 'Arrive at the Shivpuri riverside campsite. Settle in with welcome drinks. Evening visit to Triveni Ghat for the soulful sunset Maha Ganga Aarti.' },
      { day: 2, title: '16KM White Water Rafting & Cliff Jumping', description: 'Gear up with life jackets and helmets for an exhilarating 16KM rafting expedition down rapids like Roller Coaster and Golf Course. Cliff jump from 25ft rock. Evening camp bonfire and barbecue.' },
      { day: 3, title: 'Neer Garh Waterfall Hike & Departure', description: 'Morning guided yoga and meditation by the river. Short hike to Neer Garh Waterfall. Check-out with refreshed spirits.' }
    ],
    inclusions: ['2 Nights Luxury Alpine Tents / AC Cottages', 'All 6 Meals (Buffet Breakfast, Lunch & Dinner)', '16 KM Grade III+ Rafting with certified instructors', 'Cliff jumping and body surfing gear', 'Evening Bonfire & Snacks'],
    exclusions: ['Bungee jumping / Giant Swing (optional add-on)', 'Personal travel expenses to Haridwar/Rishikesh'],
    facilities: ['Riverside Camping', 'Swimming Pool on Camp', 'Bonfire & DJ Music', 'Expert River Guides'],
    category: 'Adventure',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 30.1352, lng: 78.3842, address: 'Shivpuri, Rishikesh' },
    rating: 4.9,
    reviewsCount: 218,
    bookingsCount: 620,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_003',
    title: 'Goa Sun, Sand & Beachside Backpacking',
    destination: 'North & South Goa',
    description: 'Experience the magic of Goa on a smart budget. Beach hop across Calangute, Anjuna, and Vagator, cruise the Mandovi river, and explore Latin quarters of Fontainhas.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
    ],
    price: 8999,
    discountPrice: 5999,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 30,
    availableSeats: 15,
    startDates: [new Date(Date.now() + 7 * 86400000).toISOString(), new Date(Date.now() + 21 * 86400000).toISOString()],
    meetingPoint: 'Thivim Station / Mopa Airport Goa',
    travelMode: 'AC Coach / Scooty available',
    itinerary: [
      { day: 1, title: 'Arrival & Calangute Sunset Beach Party', description: 'Arrive and check in to the vibrant beach resort. Relax by the pool and head to Calangute Beach for a lively sunset.' },
      { day: 2, title: 'North Goa Forts & Water Sports', description: 'Visit historic Chapora Fort (Dil Chahta Hai point), Aguada Fort, and take part in beach water sports at Baga.' },
      { day: 3, title: 'South Goa Heritage, Fontainhas & Sunset Cruise', description: 'Discover Portuguese architecture in Fontainhas (Old Goa), visit Basilica of Bom Jesus, and enjoy a Mandovi River sunset cruise.' },
      { day: 4, title: 'Anjuna Flea Market & Departure', description: 'Browse boho jewelry and spices at Anjuna beach market, then head to the airport/station.' }
    ],
    inclusions: ['3 Nights stay in Beach Resort with Pool', 'Daily Breakfast Buffet', 'Airport/Railway Station Transfers', 'Mandovi River Sunset Cruise Pass', 'South Goa Sightseeing Tour'],
    exclusions: ['Scooty fuel or personal rides', 'Lunch and Dinners', 'Watersports charges'],
    facilities: ['Swimming Pool', 'Close to Beach', 'Free WiFi', 'Tour Escort'],
    category: 'Beach',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 15.5527, lng: 73.7517, address: 'Candolim, Goa' },
    rating: 4.75,
    reviewsCount: 165,
    bookingsCount: 450,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_004',
    title: 'Jaipur & Pushkar Royal Heritage Weekend',
    destination: 'Jaipur & Pushkar, Rajasthan',
    description: 'Explore forts, palaces, colorful bazaars, and the holy Pushkar lake on a budget-friendly royal expedition through Rajasthan.',
    images: [
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562135014-47a44f52119e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603258844022-ad18ee1d68fa?auto=format&fit=crop&w=800&q=80'
    ],
    price: 5999,
    discountPrice: 3999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 30,
    availableSeats: 22,
    startDates: [new Date(Date.now() + 6 * 86400000).toISOString(), new Date(Date.now() + 19 * 86400000).toISOString()],
    meetingPoint: 'Jaipur Junction Railway Station',
    travelMode: 'AC Sedan / Tempo',
    itinerary: [
      { day: 1, title: 'Pink City Welcome & Hawa Mahal', description: 'Check-in to heritage haveli. Visit Hawa Mahal, City Palace, and Jantar Mantar. Evening shopping in Johari Bazaar.' },
      { day: 2, title: 'Amber Fort & Nahargarh Sunset View', description: 'Explore majestic Amber Fort and take photos at Jal Mahal. Head to Nahargarh Fort for a breathtaking sunset over Jaipur city.' },
      { day: 3, title: 'Holy Pushkar Brahma Temple & Desert Dunes', description: 'Drive to holy Pushkar. Visit the rare Lord Brahma Temple, Pushkar Lake Ghats, and enjoy a desert camel ride before departure.' }
    ],
    inclusions: ['2 Nights in Heritage Haveli Hotel', 'Daily Rajasthani Breakfast', 'Private AC Cab for all Sightseeing', 'Pushkar Excursion included', 'All toll, parking, driver allowances'],
    exclusions: ['Monument entry tickets', 'Lunch & Dinner'],
    facilities: ['Heritage Haveli Stay', 'AC Transport', 'Local Guided Insights'],
    category: 'Cultural',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
    rating: 4.8,
    reviewsCount: 110,
    bookingsCount: 310,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_005',
    title: 'Kerala Backwaters & Munnar Hills Experience',
    destination: 'Munnar & Alleppey, Kerala',
    description: 'Immerse in God’s Own Country: rolling green tea plantations in Munnar, spice gardens, and traditional houseboat cruises in the backwaters of Alleppey.',
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545638191-1dfb006517a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
    ],
    price: 15999,
    discountPrice: 10999,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 20,
    availableSeats: 12,
    startDates: [new Date(Date.now() + 10 * 86400000).toISOString(), new Date(Date.now() + 25 * 86400000).toISOString()],
    meetingPoint: 'Cochin International Airport (COK) / Ernakulam Jn',
    travelMode: 'Private AC Cab',
    itinerary: [
      { day: 1, title: 'Cochin to Munnar Scenic Drive', description: 'Drive past Cheeyappara and Valara waterfalls to reach misty Munnar. Check-in and relax.' },
      { day: 2, title: 'Munnar Tea Estates & Eravikulam National Park', description: 'Spot the endangered Nilgiri Tahr at Eravikulam, visit Mattupetty Dam, Echo Point, and Tea Museum.' },
      { day: 3, title: 'Munnar to Alleppey Backwaters Houseboat', description: 'Board your traditional thatched houseboat in Alleppey. Cruise along tranquil canals with onboard chef.' },
      { day: 4, title: 'Fort Kochi Heritage & Chinese Fishing Nets', description: 'Explore colonial Fort Kochi, St. Francis Church, and vibrant cafes.' },
      { day: 5, title: 'Departure from Kochi', description: 'Drop off at Kochi Airport or Railway Station.' }
    ],
    inclusions: ['1 Night Deluxe Houseboat (All 3 Meals Included)', '3 Nights in 3-Star Munnar & Kochi Resorts', 'Daily Breakfast', 'Private AC Sedan for entire trip', 'Spice plantation entry pass'],
    exclusions: ['Flight/train tickets to Kochi', 'Personal shopping and optional boat rides'],
    facilities: ['Houseboat Stay', 'Private Cab', 'Ayurvedic Massage assistance'],
    category: 'Honeymoon',
    budgetCategory: 'Moderate',
    gpsLocation: { lat: 10.0125, lng: 76.3262, address: 'Munnar & Alleppey' },
    rating: 4.92,
    reviewsCount: 195,
    bookingsCount: 520,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_006',
    title: 'Srinagar, Gulmarg & Pahalgam Kashmir Paradise',
    destination: 'Srinagar, Jammu & Kashmir',
    description: 'Breathtaking paradise on earth. Stay in carved wooden houseboats on Dal Lake, ride Shikaras, take the Gulmarg Gondola, and visit Betaab Valley.',
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589136777351-fdc9c9400c7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80'
    ],
    price: 18999,
    discountPrice: 14499,
    durationDays: 6,
    durationNights: 5,
    totalSeats: 18,
    availableSeats: 8,
    startDates: [new Date(Date.now() + 14 * 86400000).toISOString()],
    meetingPoint: 'Srinagar International Airport (SXR)',
    travelMode: 'Private AC Innova / Sedan',
    itinerary: [
      { day: 1, title: 'Dal Lake Houseboat Check-in & Shikara Ride', description: 'Arrive at Srinagar, check-in to handcrafted wooden houseboat, and take a 1-hour sunset Shikara ride across Dal Lake.' },
      { day: 2, title: 'Mughal Gardens of Srinagar', description: 'Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi.' },
      { day: 3, title: 'Gulmarg Gondola Ride & Snow Meadows', description: 'Day trip to Gulmarg with Gondola cable car ride into high snow peaks.' },
      { day: 4, title: 'Pahalgam Valley of Shepherds', description: 'Drive along saffron fields to Pahalgam. Relax by the Lidder River.' },
      { day: 5, title: 'Betaab Valley & Aru Valley Tour', description: 'Discover the scenic Betaab Valley and Aru Valley.' },
      { day: 6, title: 'Srinagar Departure', description: 'Transfer to Srinagar Airport.' }
    ],
    inclusions: ['1 Night Luxury Houseboat on Dal Lake', '4 Nights in 3/4-Star Valley Hotels', 'Daily Breakfast & Dinner', '1-Hour Dal Lake Shikara Ride', 'Private AC Cab for all days'],
    exclusions: ['Gondola tickets & pony rides', 'Lunch and personal expenses'],
    facilities: ['Houseboat Stay', 'Private Cab', 'Heated Rooms', 'Airport Pick & Drop'],
    category: 'Honeymoon',
    budgetCategory: 'Moderate',
    gpsLocation: { lat: 34.0837, lng: 74.7973, address: 'Dal Lake, Srinagar' },
    rating: 4.95,
    reviewsCount: 230,
    bookingsCount: 490,
    status: 'approved',
    isAffordableDeal: false,
  },
  {
    _id: 'pkg_007',
    title: 'Varanasi Spiritual Ghats & Kashi Vishwanath Walk',
    destination: 'Varanasi, Uttar Pradesh',
    description: 'An affordable spiritual awakening. Sunrise boat ride on holy River Ganga, ancient alley food trail, Manikarnika Ghat, and Kashi Vishwanath Temple corridor.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547983699-a25b21fd16d7?auto=format&fit=crop&w=800&q=80'
    ],
    price: 3999,
    discountPrice: 2499,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 30,
    availableSeats: 25,
    startDates: [new Date(Date.now() + 3 * 86400000).toISOString(), new Date(Date.now() + 15 * 86400000).toISOString()],
    meetingPoint: 'Varanasi Cantt Station / Babatpur Airport',
    travelMode: 'E-Rickshaw & Walking Tour',
    itinerary: [
      { day: 1, title: 'Arrival & Grand Dashashwamedh Ghat Aarti', description: 'Check-in to riverside inn. Evening boat seat for the world-famous Ganga Aarti.' },
      { day: 2, title: 'Sunrise Rowing Boat & Kashi Corridor Darshan', description: 'Early morning boat ride from Assi to Manikarnika Ghat. VIP entry assistance to Kashi Vishwanath and Sarnath Buddhist Stupa tour.' },
      { day: 3, title: 'Banarasi Street Food Trail & Departure', description: 'Taste famous Kachori Sabzi, Malaiyo, and Banarasi Paan before heading to the station.' }
    ],
    inclusions: ['2 Nights in Heritage Riverside Hotel', 'Daily Breakfast & 1 Banarasi Street Food Pass', 'Private Sunrise Boat Ride on Ganga', 'Guided Ghats & Temple Heritage Walk'],
    exclusions: ['Special puja donations', 'Train/Flight fare'],
    facilities: ['Riverside Hotel', 'Boat Ride included', 'Knowledgeable Local Guide'],
    category: 'Pilgrimage',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 25.3176, lng: 82.9739, address: 'Dashashwamedh Ghat, Varanasi' },
    rating: 4.88,
    reviewsCount: 160,
    bookingsCount: 390,
    status: 'approved',
    isAffordableDeal: true,
  },
  {
    _id: 'pkg_008',
    title: 'Hampi Ancient Ruins & Bouldering Expedition',
    destination: 'Hampi, Karnataka',
    description: 'Walk through the UNESCO world heritage Vijayanagara empire ruins, watch sunsets from Matanga Hill, cycle through boulder-strewn landscapes and Hippie Island.',
    images: [
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
    ],
    price: 5499,
    discountPrice: 3499,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 25,
    availableSeats: 19,
    startDates: [new Date(Date.now() + 8 * 86400000).toISOString()],
    meetingPoint: 'Hospet Railway Station',
    travelMode: 'Bicycle & Auto Tour',
    itinerary: [
      { day: 1, title: 'Virupaksha Temple & Hemakuta Sunset', description: 'Arrive at Hampi. Visit the 7th-century Virupaksha Temple, Hemakuta hill with giant monolith statues.' },
      { day: 2, title: 'Stone Chariot, Vittala Temple & Coracle Ride', description: 'Marvel at the musical pillars and Stone Chariot at Vittala Temple. Take a traditional circular coracle boat ride across Tungabhadra River.' },
      { day: 3, title: 'Matanga Hill Sunrise & Hippie Island Cafe Trail', description: 'Catch a glorious sunrise over the stone boulders from Matanga hill. Relax at Sanapur lake before departure.' }
    ],
    inclusions: ['2 Nights in Bohemian Homestay / Cottage', 'Daily Breakfast', 'Coracle Boat Ride Pass', 'Bicycle rental for 2 days', 'Guided ruins tour'],
    exclusions: ['Monument entry tickets', 'Lunch & dinner'],
    facilities: ['Homestay Stay', 'Bicycle Rental Included', 'Coracle Boat Ride'],
    category: 'Historical',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 15.3350, lng: 76.4600, address: 'Hampi, Karnataka' },
    rating: 4.82,
    reviewsCount: 94,
    bookingsCount: 260,
    status: 'approved',
    isAffordableDeal: true,
  }
];

export const mockHotels = [
  {
    _id: 'hotel_001',
    name: 'Zostel & Mountain Stay Manali',
    description: 'Affordable backpacker & traveler haven in Old Manali. Panoramic snow-peak views, apple orchards, cozy cafe, high-speed WiFi, and vibrant common rooms.',
    propertyType: 'Hostel & Boutique Stay',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Old Manali Club House Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Old Manali Bridge',
    location: { lat: 32.2432, lng: 77.1892 },
    amenities: ['Free WiFi', 'Mountain View Cafe', 'Bonfire & Music', 'Parking', 'Workspace', 'Hot Water 24/7'],
    nearbyAttractions: [{ name: 'Hadimba Temple', distanceKm: 0.8 }, { name: 'Mall Road', distanceKm: 1.5 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 24 hours before check-in',
      cancellationWindowHours: 24,
      breakfastIncluded: true,
      houseRules: ['Check-in: 12:00 PM', 'Check-out: 10:00 AM', 'Quiet hours after 11 PM in dorms'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 799,
    originalPrice: 1299,
    rating: 4.85,
    reviewsCount: 310,
    rooms: [
      {
        _id: 'room_001_a',
        name: 'Deluxe Mountain View Private Room',
        type: 'Deluxe Private',
        price: 1499,
        discountPrice: 1199,
        capacity: 2,
        bedType: 'King Bed',
        amenities: ['Attached Balcony', 'Private Bathroom', 'High-Speed WiFi', 'Electric Kettle', 'Mountain View'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'],
        available: 6
      },
      {
        _id: 'room_001_b',
        name: 'Standard Valley Double Room',
        type: 'Standard Private',
        price: 1099,
        discountPrice: 899,
        capacity: 2,
        bedType: 'Queen Bed',
        amenities: ['Private Bathroom', 'High-Speed WiFi', 'Hot Water 24/7'],
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'],
        available: 8
      },
      {
        _id: 'room_001_c',
        name: '4-Bed Mixed Dormitory Bed',
        type: 'Dormitory',
        price: 899,
        discountPrice: 699,
        capacity: 1,
        bedType: 'Bunk Bed with Locker',
        amenities: ['Individual Reading Light', 'USB Charging Port', 'Personal Locker', 'Shared Bathroom'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'],
        available: 12
      }
    ]
  },
  {
    _id: 'hotel_002',
    name: 'Candolim Beachside Palms Resort & Cottages',
    description: 'Affordable beach holiday just 200m from Candolim Beach. Lush gardens, swimming pool, sun loungers, poolside cafe, and easy access to North Goa nightlife.',
    propertyType: 'Beach Resort',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Candolim Beach Road, North Goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    landmark: 'Near Candolim Football Ground',
    location: { lat: 15.5188, lng: 73.7629 },
    amenities: ['Swimming Pool', 'Free WiFi', 'Restaurant', 'Free Parking', 'Room Service', 'Bar'],
    nearbyAttractions: [{ name: 'Candolim Beach', distanceKm: 0.2 }, { name: 'Aguada Fort', distanceKm: 3.5 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 48 hours before check-in',
      cancellationWindowHours: 48,
      breakfastIncluded: true,
      houseRules: ['Check-in: 1:00 PM', 'Check-out: 11:00 AM', 'Pool timings: 8 AM - 8 PM'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1299,
    originalPrice: 2200,
    rating: 4.7,
    reviewsCount: 245,
    rooms: [
      {
        _id: 'room_002_a',
        name: 'Poolside Deluxe Room with Balcony',
        type: 'Deluxe Room',
        price: 2199,
        discountPrice: 1699,
        capacity: 2,
        bedType: 'King Bed',
        amenities: ['Pool View', 'Private Balcony', 'Air Conditioning', 'Free WiFi', 'Tea/Coffee Maker'],
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'],
        available: 5
      },
      {
        _id: 'room_002_b',
        name: 'Garden Cottage Room',
        type: 'Standard Room',
        price: 1599,
        discountPrice: 1299,
        capacity: 2,
        bedType: 'Queen Bed',
        amenities: ['Garden View', 'Air Conditioning', 'Flat-screen TV', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'],
        available: 8
      }
    ]
  },
  {
    _id: 'hotel_003',
    name: 'Pink City Heritage Haveli Stay',
    description: 'Experience royalty on a budget. A beautifully restored 18th-century Rajasthani Haveli with traditional jharokhas, courtyards, rooftop fort views, and puppet shows.',
    propertyType: 'Heritage Haveli',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Near Old City Gate, Bani Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    landmark: 'Bani Park Main Circle',
    location: { lat: 26.9248, lng: 75.7928 },
    amenities: ['Rooftop Restaurant', 'Free WiFi', 'Rajasthani Cultural Shows', 'Free Parking', 'Travel Desk', 'Room Service'],
    nearbyAttractions: [{ name: 'Hawa Mahal', distanceKm: 2.8 }, { name: 'City Palace', distanceKm: 2.6 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 24 hours before check-in',
      cancellationWindowHours: 24,
      breakfastIncluded: true,
      houseRules: ['Check-in: 12:00 PM', 'Check-out: 11:00 AM'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1199,
    originalPrice: 1999,
    rating: 4.82,
    reviewsCount: 188,
    rooms: [
      {
        _id: 'room_003_a',
        name: 'Royal Heritage Suite with Jharokha',
        type: 'Suite',
        price: 2499,
        discountPrice: 1799,
        capacity: 3,
        bedType: 'Royal King Bed',
        amenities: ['Traditional Jharokha Seating', 'AC', 'Bathtub', 'Free WiFi', 'Heritage Decor'],
        images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'],
        available: 4
      },
      {
        _id: 'room_003_b',
        name: 'Deluxe Haveli Room',
        type: 'Deluxe Room',
        price: 1599,
        discountPrice: 1199,
        capacity: 2,
        bedType: 'Double Bed',
        amenities: ['Air Conditioning', 'Private Bathroom', 'Free WiFi', 'Tea Maker'],
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'],
        available: 7
      }
    ]
  },
  {
    _id: 'hotel_004',
    name: 'Ganga Riverside Nature Camp & Cottages',
    description: 'Wake up to the sound of flowing Ganges. Luxury Swiss tents & wooden cottages in Shivpuri with sandy beach access, volleyball, and bonfire nights.',
    propertyType: 'Riverside Camp',
    starRating: 3,
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Badrinath Road, Shivpuri',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    landmark: 'Shivpuri River Bridge',
    location: { lat: 30.1352, lng: 78.3842 },
    amenities: ['River Access', 'All Meals Included', 'Bonfire with Music', 'Volleyball Court', 'Free Parking', 'Rafting Desk'],
    nearbyAttractions: [{ name: 'Laxman Jhula', distanceKm: 12.0 }, { name: 'Neer Garh Waterfall', distanceKm: 8.0 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 24 hours before check-in',
      cancellationWindowHours: 24,
      breakfastIncluded: true,
      houseRules: ['Check-in: 12:00 PM', 'Check-out: 10:00 AM'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 899,
    originalPrice: 1500,
    rating: 4.78,
    reviewsCount: 198,
    rooms: [
      {
        _id: 'room_004_a',
        name: 'Luxury Swiss Camp Tent (Attached Bath)',
        type: 'Camp Tent',
        price: 1399,
        discountPrice: 999,
        capacity: 3,
        bedType: 'Twin / King Bed',
        amenities: ['Attached Washroom', 'Air Cooler', 'River Facing Porch', 'Charging Points'],
        images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80'],
        available: 10
      },
      {
        _id: 'room_004_b',
        name: 'Riverside Wooden AC Cottage',
        type: 'Cottage',
        price: 1899,
        discountPrice: 1499,
        capacity: 2,
        bedType: 'King Bed',
        amenities: ['Air Conditioning', 'Glass Window River View', 'Attached Washroom', 'Tea Maker'],
        images: ['https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=600&q=80'],
        available: 6
      }
    ]
  },
  {
    _id: 'hotel_005',
    name: 'Lakeview Palace & Boutique Resort',
    description: 'Overlooking the shimmering waters of Lake Pichola. Regal architecture, rooftop pool, sunset dining with live sitar music, and heritage hospitality.',
    propertyType: 'Boutique Resort',
    starRating: 5,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Chandpole, Lake Pichola West Bank',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    landmark: 'Near Hanuman Ghat',
    location: { lat: 24.5755, lng: 73.6798 },
    amenities: ['Rooftop Swimming Pool', 'Lakefront Dining', 'Free High-Speed WiFi', 'Spa Therapies', 'Butler Service', 'Room Service'],
    nearbyAttractions: [{ name: 'City Palace', distanceKm: 0.6 }, { name: 'Bagore Ki Haveli', distanceKm: 0.4 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 48 hours before check-in',
      cancellationWindowHours: 48,
      breakfastIncluded: true,
      houseRules: ['Check-in: 2:00 PM', 'Check-out: 11:00 AM'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: false,
    startingPrice: 3499,
    originalPrice: 5500,
    rating: 4.93,
    reviewsCount: 165,
    rooms: [
      {
        _id: 'room_005_a',
        name: 'Lake View Royal Heritage Room',
        type: 'Lakeview Deluxe',
        price: 4999,
        discountPrice: 3899,
        capacity: 2,
        bedType: 'Four-Poster King Bed',
        amenities: ['Direct Lake Pichola View', 'Marble Bathroom', 'AC', 'Minibar', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'],
        available: 4
      },
      {
        _id: 'room_005_b',
        name: 'Courtyard Superior Room',
        type: 'Superior Room',
        price: 4199,
        discountPrice: 3499,
        capacity: 2,
        bedType: 'King Bed',
        amenities: ['Courtyard View', 'AC', 'Private Bath', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'],
        available: 6
      }
    ]
  },
  {
    _id: 'hotel_006',
    name: 'Alleppey Backwater Palms Homestay & Resort',
    description: 'Live amidst serene coconut palms on the bank of the Vembanad backwaters. Traditional Kerala cuisine, ayurvedic massages, and sunset canoe boat rides.',
    propertyType: 'Resort & Homestay',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545638191-1dfb006517a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Punnamada Road, Backwaters Shore',
    city: 'Alleppey',
    state: 'Kerala',
    country: 'India',
    landmark: 'Punnamada Finishing Point',
    location: { lat: 9.4981, lng: 76.3388 },
    amenities: ['Backwater View', 'Free WiFi', 'Ayurvedic Massage', 'Complimentary Canoe Ride', 'Kerala Dining', 'Free Parking'],
    nearbyAttractions: [{ name: 'Vembanad Lake', distanceKm: 1.0 }, { name: 'Alappuzha Beach', distanceKm: 4.5 }],
    policies: {
      cancellationPolicy: 'Free Cancellation up to 24 hours before check-in',
      cancellationWindowHours: 24,
      breakfastIncluded: true,
      houseRules: ['Check-in: 1:00 PM', 'Check-out: 11:00 AM'],
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1499,
    originalPrice: 2400,
    rating: 4.89,
    reviewsCount: 142,
    rooms: [
      {
        _id: 'room_006_a',
        name: 'Canal View Heritage Kerala Room',
        type: 'Heritage Room',
        price: 2199,
        discountPrice: 1699,
        capacity: 2,
        bedType: 'King Bed',
        amenities: ['Balcony Canal View', 'AC', 'Private Bath', 'Free WiFi', 'Traditional Woodwork'],
        images: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'],
        available: 6
      },
      {
        _id: 'room_006_b',
        name: 'Eco Garden Cottage',
        type: 'Standard Cottage',
        price: 1799,
        discountPrice: 1499,
        capacity: 2,
        bedType: 'Double Bed',
        amenities: ['Garden View', 'AC', 'Attached Bath', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80'],
        available: 8
      }
    ]
  }
];

// Previous Trip Spot Highlights & Gallery (for About page & Community)
export const mockPreviousTripGallery = [
  {
    id: 'spot_01',
    title: 'Snow Sunrise at Solang Valley',
    spot: 'Solang Valley, Manali',
    category: 'Himalayas',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    traveler: 'Rahul & Friends Group (Batch of Nov 2024)',
    quote: 'We booked the budget Manali package for ₹4,999. The paragliding over fresh snow and evening cafe jams in Old Manali were unforgettable!',
    rating: 5.0,
    likes: 342,
    date: 'November 2024',
    budgetTip: 'Save 40% by taking early morning semi-sleeper buses and booking group packages.',
  },
  {
    id: 'spot_02',
    title: 'Sunset at Vagator Cliff',
    spot: 'Vagator Beach & Chapora Fort, Goa',
    category: 'Coastal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    traveler: 'Ananya & College Gang',
    quote: 'Rented scooties, stayed at Candolim Beach Palms for ₹1,299/night, and caught the most stunning orange sunset from the cliffs.',
    rating: 4.9,
    likes: 418,
    date: 'December 2024',
    budgetTip: 'Visit south Goan beaches on weekdays for cheap shack seafood and quiet shores.',
  },
  {
    id: 'spot_03',
    title: 'Morning Shikara Ride on Dal Lake',
    spot: 'Dal Lake & Floating Market, Srinagar',
    category: 'Lakes & Valleys',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    traveler: 'Vikram & Pooja (Honeymooners)',
    quote: 'Drinking hot Kahwa tea in the morning mist on a wooden houseboat was like a fairy tale. TravelStay gave us the best price without hidden fees.',
    rating: 5.0,
    likes: 529,
    date: 'January 2025',
    budgetTip: 'Pre-book houseboat combo deals to get complimentary sunset shikara rides included.',
  },
  {
    id: 'spot_04',
    title: 'Grade IV Rapids & Cliff Jump in Ganges',
    spot: 'Shivpuri Rapids, Rishikesh',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
    traveler: 'Sameer & Corporate Squad (Delhi)',
    quote: 'Rafted 16km, jumped off a 25ft cliff, and celebrated around a beach bonfire for under ₹3,000 all-inclusive!',
    rating: 4.95,
    likes: 389,
    date: 'October 2024',
    budgetTip: 'Camp in Shivpuri rather than downtown Rishikesh for crystal-clear river views and cheaper tariffs.',
  },
  {
    id: 'spot_05',
    title: 'Golden Sunset over Nahargarh Fort',
    spot: 'Nahargarh Fort, Jaipur',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80',
    traveler: 'Karan Mehra & Family',
    quote: 'Looking down at the illuminated Pink City from Nahargarh ramparts at dusk was pure magic.',
    rating: 4.85,
    likes: 275,
    date: 'February 2025',
    budgetTip: 'Composite tickets in Jaipur cover Amber, Nahargarh, Hawa Mahal and save over ₹500.',
  },
  {
    id: 'spot_06',
    title: 'Houseboat Cruising Through Palm Canals',
    spot: 'Alleppey Backwaters, Kerala',
    category: 'Lakes & Valleys',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    traveler: 'Divya & Sarthak',
    quote: 'Fresh Karimeen fry cooked live on our houseboat as we glided past sleepy villages and kingfishers. 10/10 experience!',
    rating: 4.9,
    likes: 461,
    date: 'December 2024',
    budgetTip: 'Book sharing houseboats or government DTPC canoe tours for authentic backwater vibes on a budget.',
  },
  {
    id: 'spot_07',
    title: 'Ganga Aarti Lights & Diya Offerings',
    spot: 'Dashashwamedh Ghat, Varanasi',
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    traveler: 'Aarav Gupta & Parents',
    quote: 'The resonance of conch shells and giant brass lamps during the evening Ganga Aarti gave us goosebumps.',
    rating: 5.0,
    likes: 512,
    date: 'November 2024',
    budgetTip: 'Rent a traditional wooden rowing boat rather than motor boats for an intimate, peaceful view.',
  },
  {
    id: 'spot_08',
    title: 'Bouldering & Stone Chariot at Sunset',
    spot: 'Vittala Temple & Matanga Hill, Hampi',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b74a?auto=format&fit=crop&w=800&q=80',
    traveler: 'Neha Sharma (Solo Backpacker)',
    quote: 'Rented a bicycle for ₹150/day and explored ancient stone ruins that look straight out of an Indiana Jones movie.',
    rating: 4.9,
    likes: 310,
    date: 'January 2025',
    budgetTip: 'Stay on the Sanapur / Anegundi side in riverside shacks for chilled vibes and budget rooms.',
  }
];

// Customer's Past Trips & Visited Spots (for Dashboard -> Memories)
export const mockCustomerPastTrips = [
  {
    id: 'trip_001',
    packageTitle: 'Budget Manali & Solang Valley Adventure',
    destination: 'Manali, Himachal Pradesh',
    travelDates: '12 Nov 2024 - 16 Nov 2024',
    days: 5,
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    costPaid: '₹4,999',
    ratingGiven: 5,
    spotsVisited: [
      { name: 'Solang Valley Snow Point', type: 'Adventure', rating: 5, notes: 'Paragliding with snow peak background was the best part!' },
      { name: 'Old Manali Cafe Street', type: 'Food & Vibes', rating: 5, notes: 'Drank ginger lemon honey tea at Cafe 1947.' },
      { name: 'Jogini Waterfalls', type: 'Trek', rating: 4.5, notes: 'Gentle 45-min hike through pine forests.' },
      { name: 'Hadimba Devi Temple', type: 'Heritage', rating: 4.8, notes: 'Ancient cedar wood architectural marvel.' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=600&q=80'
    ],
    reviewNote: 'Amazing budget trip! Hotel was warm and clean, Volvo was right on time, and coordinator helped us get discount paragliding tickets.'
  },
  {
    id: 'trip_002',
    packageTitle: 'Rishikesh Camping, Rafting & Ganga Aarti',
    destination: 'Rishikesh, Uttarakhand',
    travelDates: '04 Oct 2024 - 06 Oct 2024',
    days: 3,
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
    costPaid: '₹2,999',
    ratingGiven: 5,
    spotsVisited: [
      { name: 'Shivpuri Rafting Rapid Point', type: 'Adventure', rating: 5, notes: 'Body surfing in the holy Ganges was super peaceful.' },
      { name: 'Triveni Ghat Evening Aarti', type: 'Spiritual', rating: 5, notes: 'Mesmerizing chantings and floating diyas.' },
      { name: 'Neer Garh Waterfall', type: 'Nature', rating: 4.5, notes: 'Natural swimming pool under cool mountain stream.' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=600&q=80'
    ],
    reviewNote: 'Unbeatable value for ₹2,999. Camping food was hot and delicious, and the rafting captain was super professional!'
  }
];

// Initial Customer Bookings
export const mockCustomerBookings = [
  {
    _id: 'bk_101',
    bookingType: 'package',
    package: mockPackages[0],
    itemTitle: 'Budget Manali & Solang Valley Adventure',
    destination: 'Manali, Himachal Pradesh',
    image: mockPackages[0].images[0],
    bookingDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    guestsCount: 2,
    totalAmount: 9998,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_demo_7823491',
    primaryGuest: { name: 'Priya Sharma', email: 'customer@travelstay.com', phone: '+91 98765 43210' }
  },
  {
    _id: 'bk_102',
    bookingType: 'hotel',
    hotel: mockHotels[1],
    itemTitle: 'Candolim Beachside Palms Resort & Cottages',
    roomName: 'Garden Cottage Room',
    destination: 'Goa',
    image: mockHotels[1].images[0],
    bookingDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    checkInDate: new Date(Date.now() + 25 * 86400000).toISOString(),
    checkOutDate: new Date(Date.now() + 28 * 86400000).toISOString(),
    guestsCount: 2,
    totalAmount: 3897,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_demo_8923145',
    primaryGuest: { name: 'Priya Sharma', email: 'customer@travelstay.com', phone: '+91 98765 43210' }
  }
];

// LocalStorage helpers to ensure state persists across user actions
export const getStoredPackages = () => {
  const stored = localStorage.getItem('travelstay_packages_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  localStorage.setItem('travelstay_packages_v2', JSON.stringify(mockPackages));
  return mockPackages;
};

export const getStoredHotels = () => {
  const stored = localStorage.getItem('travelstay_hotels_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  localStorage.setItem('travelstay_hotels_v2', JSON.stringify(mockHotels));
  return mockHotels;
};

export const getStoredBookings = () => {
  const stored = localStorage.getItem('travelstay_bookings');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  localStorage.setItem('travelstay_bookings', JSON.stringify(mockCustomerBookings));
  return mockCustomerBookings;
};

export const saveBooking = (newBooking) => {
  const bookings = getStoredBookings();
  const updated = [newBooking, ...bookings];
  localStorage.setItem('travelstay_bookings', JSON.stringify(updated));
  return updated;
};

export const getStoredMemories = () => {
  const stored = localStorage.getItem('travelstay_memories');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  localStorage.setItem('travelstay_memories', JSON.stringify(mockCustomerPastTrips));
  return mockCustomerPastTrips;
};

export const saveMemory = (newMemory) => {
  const memories = getStoredMemories();
  const updated = [newMemory, ...memories];
  localStorage.setItem('travelstay_memories', JSON.stringify(updated));
  return updated;
};

export const getStoredWishlist = () => {
  const stored = localStorage.getItem('travelstay_wishlist');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  const initial = [mockPackages[0], mockHotels[0]];
  localStorage.setItem('travelstay_wishlist', JSON.stringify(initial));
  return initial;
};

export const toggleWishlistItem = (item) => {
  const list = getStoredWishlist();
  const exists = list.some(x => x._id === item._id);
  const updated = exists ? list.filter(x => x._id !== item._id) : [...list, item];
  localStorage.setItem('travelstay_wishlist', JSON.stringify(updated));
  return updated;
};
