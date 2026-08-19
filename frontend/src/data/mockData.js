// Real-World Travel Agency Data Store — Professional Indian & Regional Tourism
// High quality destination photography, realistic pricing, itineraries, stays, activities, transportation, and passport assistance

export const mockUsers = {
  customer: {
    _id: 'cust_001',
    name: 'Amol Sharma',
    email: 'amolsharma2705@gmail.com',
    role: 'customer',
    phone: '+91 98145 19578',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'Ludhiana, Punjab',
    joinedDate: 'March 2023',
    tripsCompleted: 5,
    spotsVisited: 22,
    reviewsGiven: 9,
  },
  agency: {
    _id: 'agency_001',
    name: 'PCTE Travel Agency',
    email: 'amolsharma2705@gmail.com',
    role: 'agency',
    agencyName: 'PCTE Travel Agency — Freedom To Evolve',
    agencyDescription: 'Premier Punjab & North India Tour Operator specializing in group departures, customized private holidays, adventure sports, transport logistics, and passport assistance.',
    agencyStatus: 'approved',
    phone: '+91 98145 19578',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  admin: {
    _id: 'admin_001',
    name: 'Amol Sharma (Admin)',
    email: 'amolsharma2705@gmail.com',
    role: 'admin',
    phone: '+91 99881 10021',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  }
};


// -------------------------------------------------------------
// 1. TOURS & PACKAGES (Group, Private, Adventure, Weekend)
// -------------------------------------------------------------
export const mockPackages = [
  // 1. Group Tour - Himachal
  {
    _id: 'pkg_101',
    title: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    destination: 'Jibhi & Tirthan Valley, Himachal Pradesh',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Mountains & Valleys',
    description: 'Depart together with fellow travelers on a scenic Himalayan mountain exploration. Experience lush pine forests of Tirthan Valley, traditional wooden cottages, the majestic Jalori Pass at 10,800 ft, and a gentle snow-pine hike to Serolsar Lake.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', // Jibhi mountain stream
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // mountain range
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // lush valley
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1200&q=80'  // pine forest
    ],
    price: 8500,
    discountPrice: 5999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 24,
    availableSeats: 9,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString(), new Date(Date.now() + 11 * 86400000).toISOString()],
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
    exclusions: [
      'Lunch and personal cafe spending',
      'Entry tickets if applicable',
      'Anything not mentioned in inclusions'
    ],
    facilities: ['Group Tour Lead', 'AC Coach Transfers', 'Riverside Stay', 'Meals Included'],
    gpsLocation: { lat: 31.6373, lng: 77.4721, address: 'Jibhi, Himachal Pradesh' },
    rating: 4.9,
    reviewsCount: 310,
    bookingsCount: 840,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 2. Group Tour - Kashmir
  {
    _id: 'pkg_102',
    title: 'Kashmir Paradise Group Tour: Srinagar, Gulmarg & Pahalgam',
    destination: 'Srinagar, Gulmarg & Pahalgam, Kashmir',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Lakes & Snow Mountains',
    description: 'Experience heaven on earth. Enjoy a classic Shikara ride on Dal Lake, stay in heritage Kashmiri houseboats, ride the Gulmarg Gondola over snow ridges, and explore the breathtaking Betaab Valley in Pahalgam.',
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80', // Dal Lake Shikara
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // snow mountains
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80', // Kashmir valley
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 18500,
    discountPrice: 14999,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 20,
    availableSeats: 6,
    startDates: [new Date(Date.now() + 8 * 86400000).toISOString(), new Date(Date.now() + 18 * 86400000).toISOString()],
    meetingPoint: 'Sheikh Ul-Alam International Airport, Srinagar (SXR)',
    travelMode: 'Private AC Tempo Traveller & Shikara',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Heritage Houseboat Stay', description: 'Airport pickup, check-in to traditional Dal Lake houseboat, and sunset Shikara ride across floating gardens.' },
      { day: 2, title: 'Mughal Gardens & Old Srinagar Heritage Walk', description: 'Visit Nishat Bagh, Shalimar Bagh, Chashme Shahi, and shop authentic Kashmiri Pashmina and saffron.' },
      { day: 3, title: 'Gulmarg Meadow of Flowers & Gondola Ride', description: 'Excursion to Gulmarg. Ride the world-renowned Gondola to Phase 1 & 2 for snow sports and panoramic views.' },
      { day: 4, title: 'Pahalgam Valley of Shepherds & Betaab Valley', description: 'Drive along Lidder River to Pahalgam. Explore Betaab Valley and Aru Valley with horse riding.' },
      { day: 5, title: 'Departure from Srinagar', description: 'Breakfast with traditional Kashmiri Kahwa and airport transfer for return flight.' }
    ],
    inclusions: [
      '1 Night Premium Houseboat + 3 Nights Deluxe Hotel',
      'Daily Breakfast and Kashmiri Dinner',
      'All Transfers & Sightseeing in private Tempo Traveller',
      '1-Hour complimentary Shikara Ride on Dal Lake',
      'Toll taxes, parking, and driver allowances'
    ],
    exclusions: [
      'Gondola cable car tickets (Phase 1/2)',
      'Pony rides in Pahalgam/Gulmarg',
      'Airfare to/from Srinagar'
    ],
    facilities: ['Heritage Houseboat', 'Shikara Ride', 'All Breakfasts & Dinners', 'Airport Transfers'],
    gpsLocation: { lat: 34.0837, lng: 74.7973, address: 'Dal Lake, Srinagar, J&K' },
    rating: 4.95,
    reviewsCount: 185,
    bookingsCount: 460,
    status: 'approved',
    isAffordableDeal: false,
  },

  // 3. Group Tour - Rajasthan
  {
    _id: 'pkg_103',
    title: 'Rajasthan Royal Heritage Group Tour: Jaipur, Jodhpur & Jaisalmer',
    destination: 'Jaipur, Jodhpur & Jaisalmer, Rajasthan',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Forts, Palaces & Desert',
    description: 'Immerse in royal majesty. Tour Amber Fort palace, Mehrangarh Fort, Pink City bazaars, and spend a night in luxury Swiss tents under starry skies on the Thar Desert sand dunes with folk dance and camel safari.',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort Kila, Jodhpur
      'https://images.unsplash.com/photo-1603258844022-ad18ee1d68fa?auto=format&fit=crop&w=1200&q=80', // Amer Fort Kila Ramparts, Jaipur
      'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80', // Jaisalmer Sonar Qila Golden Fort
      'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1200&q=80', // Hawa Mahal, Jaipur
      'https://images.unsplash.com/photo-1562135014-47a44f52119e?auto=format&fit=crop&w=1200&q=80'  // Thar Desert Dunes
    ],

    price: 15999,
    discountPrice: 11999,
    durationDays: 6,
    durationNights: 5,
    totalSeats: 25,
    availableSeats: 11,
    startDates: [new Date(Date.now() + 6 * 86400000).toISOString()],
    meetingPoint: 'Jaipur Junction Railway Station / Airport',
    travelMode: 'AC Deluxe Coach',
    itinerary: [
      { day: 1, title: 'Pink City Arrival & Hawa Mahal', description: 'Check-in to heritage hotel. Visit Hawa Mahal, City Palace, and evening Johari Bazaar walk.' },
      { day: 2, title: 'Amber Fort & Nahargarh Sunset View', description: 'Tour grand Amber Fort and enjoy panoramic sunset over Jaipur from Nahargarh.' },
      { day: 3, title: 'Drive to Blue City Jodhpur & Mehrangarh Fort', description: 'Explore towering Mehrangarh Fort and Jaswant Thada marble cenotaph.' },
      { day: 4, title: 'Jaisalmer Golden Fort & Desert Camp Check-in', description: 'Drive to Sam Sand Dunes. Enjoy sunset camel safari, Kalbeliya folk dance show, and campfire dinner.' },
      { day: 5, title: 'Patwon Ki Haveli & Gadisar Lake', description: 'Explore ancient sandstone Havelis and serene Gadisar Lake.' },
      { day: 6, title: 'Departure from Jaisalmer / Jodhpur', description: 'Drop off at Railway Station / Airport for departure.' }
    ],
    inclusions: [
      '2 Nights Heritage Hotel Jaipur, 1 Night Jodhpur, 2 Nights Luxury Desert Camp',
      'All Breakfasts and 1 Royal Rajasthani Desert Dinner',
      'Camel Safari on Sam Sand Dunes with Folk Performance',
      'Dedicated AC vehicle throughout the tour'
    ],
    exclusions: ['Monument entrance fees', 'Personal expenses'],
    facilities: ['Heritage Stays', 'Desert Tents', 'Camel Safari', 'AC Transport'],
    gpsLocation: { lat: 26.9124, lng: 75.7873, address: 'Amber Fort, Jaipur, Rajasthan' },
    rating: 4.92,
    reviewsCount: 220,
    bookingsCount: 590,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 4. Group Tour - Goa
  {
    _id: 'pkg_104',
    title: 'Goa Coastal Getaway Group Tour: Beaches, Cruise & Latin Quarter',
    destination: 'North & South Goa Beaches',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Beaches & Coastal Culture',
    description: 'Relax on golden palm-lined shores, cruise the Mandovi river at sunset, explore the colorful Portuguese Latin quarter of Fontainhas, and unwind at top-rated beach resorts.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Goa beach
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Goa palms
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', // Resort pool
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 9999,
    discountPrice: 6999,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 30,
    availableSeats: 14,
    startDates: [new Date(Date.now() + 7 * 86400000).toISOString()],
    meetingPoint: 'Mopa Airport (GOX) / Thivim Railway Station',
    travelMode: 'AC Tourist Coach & Shared Sightseeing',
    itinerary: [
      { day: 1, title: 'Arrival & Candolim Beach Sunset Walk', description: 'Airport/Station pickup, check-in to beachside resort with pool, and evening leisure walk.' },
      { day: 2, title: 'North Goa Forts & Water Sports', description: 'Visit Fort Aguada, Chapora Fort, and enjoy water sports at Calangute/Baga.' },
      { day: 3, title: 'Old Goa Churches, Fontainhas & Mandovi Cruise', description: 'Visit Basilica of Bom Jesus, colorful Fontainhas heritage streets, and sunset river cruise.' },
      { day: 4, title: 'Anjuna Flea Market & Departure', description: 'Check out, souvenir shopping, and transfer to airport/station.' }
    ],
    inclusions: [
      '3 Nights accommodation in 3-star Beach Resort with Pool',
      'Daily Buffet Breakfast',
      'Airport/Station Pick and Drop',
      'Mandovi Sunset River Cruise pass',
      'All North & South Goa sightseeing transfers'
    ],
    exclusions: ['Watersports fees', 'Lunch & dinner drinks'],
    facilities: ['Resort with Swimming Pool', 'Beach Access', 'River Cruise Pass', 'Transfers Included'],
    gpsLocation: { lat: 15.5188, lng: 73.7629, address: 'Candolim, Goa' },
    rating: 4.88,
    reviewsCount: 260,
    bookingsCount: 710,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 5. Individual / Private Tour - Couples & Honeymoon
  {
    _id: 'pkg_201',
    title: 'Private Romantic Escape: Manali, Solang Valley & Rohtang Pass',
    destination: 'Manali, Himachal Pradesh',
    tourType: 'Private Tour',
    category: 'Private Tours',
    theme: 'Romantic / Couple Trips',
    description: 'A private mountain retreat exclusively for couples and families. Stay in luxury balcony suites with snow-peak views, private chauffeur sedan throughout, candle-lit dinner, and private day excursion to Solang Valley & Atal Tunnel.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Manali luxury room / view
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', // Mountain road snow
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', // Cozy resort room
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 24000,
    discountPrice: 18500,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 6,
    availableSeats: 4,
    startDates: [new Date(Date.now() + 3 * 86400000).toISOString()],
    meetingPoint: 'Chandigarh Airport (IXC) / Delhi Airport (DEL)',
    travelMode: 'Private AC Dzire / Etios Chauffeur Driven',
    itinerary: [
      { day: 1, title: 'Private Drive from Chandigarh/Delhi to Manali', description: 'Scenic drive through Kullu valley with stop at Pandoh Dam. Check in to mountain view suite.' },
      { day: 2, title: 'Solang Valley, Atal Tunnel & Sissu Waterfall', description: 'Private excursion across Atal Tunnel into Lahaul valley. Snow activities and photo stops in Sissu.' },
      { day: 3, title: 'Old Manali, Hadimba Temple & Candlelight Dinner', description: 'Explore ancient Hadimba temple, Van Vihar pine forest, and evening 4-course candlelight dinner.' },
      { day: 4, title: 'Kullu Shawl Factory & Return Drive', description: 'Drop off at Chandigarh / Delhi airport with personalized support.' }
    ],
    inclusions: [
      'Dedicated Private AC Sedan for 4 days (Door to Door)',
      '3 Nights stay in Mountain-View Suite',
      'Daily Breakfast and 1 Special Candlelight Dinner',
      'Flower bed decoration and honeymoon cake',
      'All toll taxes, parking, and driver night charges'
    ],
    exclusions: ['Activity charges at Solang Valley', 'Lunch'],
    facilities: ['Private Chauffeur', 'Candlelight Dinner', 'Balcony Suite', 'Customizable Dates'],
    gpsLocation: { lat: 32.2432, lng: 77.1892, address: 'Old Manali, HP' },
    rating: 4.96,
    reviewsCount: 140,
    bookingsCount: 380,
    status: 'approved',
    isAffordableDeal: false,
  },

  // 6. Individual / Private Tour - Family Holiday
  {
    _id: 'pkg_202',
    title: 'Customized Golden Triangle Family Tour: Delhi, Agra & Jaipur',
    destination: 'Delhi, Agra & Jaipur',
    tourType: 'Private Tour',
    category: 'Private Tours',
    theme: 'Family & Heritage',
    description: 'Customizable luxury family tour covering India’s most iconic monuments. Visit Taj Mahal at sunrise, Agra Fort, Qutub Minar, and Amber Palace with a dedicated family Innova Crysta and approved government guides.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Taj Mahal
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', // India Gate Delhi
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=1200&q=80', // Jaipur
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 22000,
    discountPrice: 17499,
    durationDays: 5,
    durationNights: 4,
    totalSeats: 8,
    availableSeats: 6,
    startDates: [new Date(Date.now() + 5 * 86400000).toISOString()],
    meetingPoint: 'Delhi Airport / Any Hotel in Delhi NCR',
    travelMode: 'Private AC Innova Crysta',
    itinerary: [
      { day: 1, title: 'Delhi Sightseeing & Drive to Agra', description: 'Visit India Gate, Rashtrapati Bhavan, Qutub Minar. Drive via Yamuna Expressway to Agra.' },
      { day: 2, title: 'Sunrise Taj Mahal & Agra Fort', description: 'Early morning visit to Taj Mahal. Visit grand Agra Fort and drive to Jaipur via Fatehpur Sikri.' },
      { day: 3, title: 'Jaipur Forts & City Palace', description: 'Tour Amber Fort, Jal Mahal, and City Palace with government-approved guide.' },
      { day: 4, title: 'Jantar Mantar & Chokhi Dhani Cultural Evening', description: 'UNESCO astronomical observatory tour and ethnic village dinner with puppetry and music.' },
      { day: 5, title: 'Jaipur to Delhi Return', description: 'Drop off at Delhi Airport / Railway station.' }
    ],
    inclusions: [
      'Dedicated AC Innova Crysta for 5 days',
      '4 Nights in 4-Star Family Hotels',
      'Daily Buffet Breakfast',
      'Government approved licensed monument guides',
      'Chokhi Dhani traditional cultural dinner'
    ],
    exclusions: ['Monument entry tickets', 'Lunch'],
    facilities: ['Private Innova Crysta', '4-Star Hotels', 'Licensed Guides', 'Customizable'],
    gpsLocation: { lat: 27.1751, lng: 78.0421, address: 'Taj Mahal, Agra' },
    rating: 4.93,
    reviewsCount: 160,
    bookingsCount: 420,
    status: 'approved',
    isAffordableDeal: false,
  },

  // 7. Adventure Tour - Spiti Valley Circuit
  {
    _id: 'pkg_301',
    title: 'Spiti Valley 4x4 High-Altitude Expedition (9 Days)',
    destination: 'Kaza, Chandratal & Spiti Valley, Himachal',
    tourType: 'Adventure Tour',
    category: 'Adventure Tours',
    theme: 'Trekking & High Altitude',
    description: 'The definitive Himalayan trans-Himalayan road expedition. Cross Kunzum Pass (15,000 ft), visit Key Monastery perched on cliffs, send postcards from world’s highest post office Hikkim (14,567 ft), cross Chicham Bridge, and camp near turquoise Chandratal Lake.',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', // Spiti valley mountain road
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // rugged snowy peaks
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80', // cold desert
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 26000,
    discountPrice: 19999,
    durationDays: 9,
    durationNights: 8,
    totalSeats: 16,
    availableSeats: 5,
    startDates: [new Date(Date.now() + 10 * 86400000).toISOString(), new Date(Date.now() + 24 * 86400000).toISOString()],
    meetingPoint: 'Chandigarh Railway Station / Airport',
    travelMode: '4x4 Modified Tempo Traveller / SUV',
    itinerary: [
      { day: 1, title: 'Chandigarh to Narkanda', description: 'Drive past apple orchards into the high hills of Narkanda.' },
      { day: 2, title: 'Narkanda to Chitkul (Last Indian Village)', description: 'Scenic drive along Sutlej river to picturesque Chitkul on Indo-Tibet border.' },
      { day: 3, title: 'Chitkul to Kalpa & Kinnaur Kailash View', description: 'View 6,000m sacred Kinnaur Kailash mountain and visit Roghi Suicide Point.' },
      { day: 4, title: 'Kalpa to Kaza via Tabo & Gue Mummy', description: 'Visit 1000-year-old Tabo Monastery and 550-year-old preserved monk mummy at Gue.' },
      { day: 5, title: 'Highest Villages: Hikkim, Komic & Langza', description: 'Post letters from Hikkim (14,567 ft) and visit ancient marine fossil center at Langza.' },
      { day: 6, title: 'Key Monastery & Chicham Suspension Bridge', description: 'Iconic 11th-century cliff monastery and Asia’s highest suspension gorge bridge.' },
      { day: 7, title: 'Kaza to Chandratal Moon Lake Camping', description: 'Cross 15,000 ft Kunzum Pass and camp in alpine dome tents near Chandratal Lake.' },
      { day: 8, title: 'Chandratal to Manali via Atal Tunnel', description: 'Challenging off-road stretch over Batal/Gramphu and exit into lush Manali.' },
      { day: 9, title: 'Manali to Chandigarh Return', description: 'Final drop-off at Chandigarh.' }
    ],
    inclusions: [
      '4x4 High-Clearance Tempo Traveller / SUV for entire 9 days',
      '8 Nights in Traditional Boutique Homestays & Swiss Camps',
      'All Breakfasts and Dinners',
      'Inner Line Permits and environmental green fees',
      'Medical grade Oxygen Cylinder and high-altitude first-aid kit'
    ],
    exclusions: ['Lunches & cafe snacks', 'Personal gear rental'],
    facilities: ['4x4 Vehicle', 'High Altitude Swiss Tents', 'Permits Included', 'Oxygen Kit'],
    gpsLocation: { lat: 32.2276, lng: 78.0710, address: 'Kaza, Spiti Valley, HP' },
    rating: 4.97,
    reviewsCount: 190,
    bookingsCount: 480,
    status: 'approved',
    isAffordableDeal: false,
  },

  // 8. Adventure Tour - Rishikesh Rafting & Camping
  {
    _id: 'pkg_302',
    title: 'Rishikesh 16KM White Water Rafting, Beach Camping & Cliff Jump',
    destination: 'Rishikesh & Shivpuri, Uttarakhand',
    tourType: 'Adventure Tour',
    category: 'Adventure Tours',
    theme: 'Rafting & Camping',
    description: 'Conquer thrilling Grade III & IV rapids on the holy Ganges. Includes 16 km white water rafting expedition, 25 ft cliff jumping into river Ganges, riverside dome camping with bonfire, volleyball, and evening Ganga Aarti at Triveni Ghat.',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1200&q=80', // White water rafting
      'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=1200&q=80', // Rishikesh Ganga
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', // Yoga / Ganges nature
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 4500,
    discountPrice: 2999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 35,
    availableSeats: 22,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString()],
    meetingPoint: 'Haridwar Railway Station / Rishikesh ISBT / Tapovan',
    travelMode: 'Private Cabs & Rafting Boats',
    itinerary: [
      { day: 1, title: 'Arrival at Shivpuri Campsite & Sunset Ganga Aarti', description: 'Check-in to riverside luxury camps with swimming pool. Evening visit to Triveni Ghat for sunset Maha Ganga Aarti.' },
      { day: 2, title: '16 KM Grade III+ Rafting & Cliff Jump', description: 'Gear up with safety helmets and life jackets. Conquer rapids like Roller Coaster and Golf Course with a 25 ft cliff jump.' },
      { day: 3, title: 'Neer Garh Waterfall Hike & Departure', description: 'Morning guided hike to Neer Garh waterfall and check out.' }
    ],
    inclusions: [
      '2 Nights Swiss Alpine Tents / AC Cottages',
      'All 6 Meals (2 Breakfast, 2 Lunch, 2 Dinner)',
      '16 KM Grade III+ Rafting with IRF-certified raft captain',
      'Cliff jumping & bodysurfing safety gear',
      'Evening Bonfire with music'
    ],
    exclusions: ['Bungee jumping tickets', 'Transfers from home city'],
    facilities: ['Riverside Camping', 'Certified Raft Captains', 'All Meals Included', 'Bonfire & Music'],
    gpsLocation: { lat: 30.1352, lng: 78.3842, address: 'Shivpuri, Rishikesh' },
    rating: 4.91,
    reviewsCount: 280,
    bookingsCount: 740,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 9. Group Tour - Amritsar Golden Temple & Heritage
  {
    _id: 'pkg_106',
    title: 'Amritsar Spiritual & Heritage Weekend Tour: Golden Temple, Wagah Border & Food Trail',
    destination: 'Amritsar, Punjab',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Spiritual, Heritage & Food',
    description: 'Experience the spiritual epicenter and cultural soul of Punjab. Visit the holy Sri Harmandir Sahib (Golden Temple) in shimmering night illuminations, participate in Langar community seva, witness the electrifying patriotism at Wagah Border Retreat Ceremony, explore Partition Museum and taste iconic Amritsari kulchas and creamy lassi.',
    images: [
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80', // Golden Temple Night reflection
      'https://images.unsplash.com/photo-1599818817208-1644781498fa?auto=format&fit=crop&w=1200&q=80', // Golden Temple Day
      'https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=1200&q=80', // Golden Temple entrance
      'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=1200&q=80'  // Amritsar Heritage street
    ],
    price: 4999,
    discountPrice: 3499,
    durationDays: 2,
    durationNights: 1,
    totalSeats: 30,
    availableSeats: 12,
    startDates: [new Date(Date.now() + 3 * 86400000).toISOString(), new Date(Date.now() + 10 * 86400000).toISOString()],
    meetingPoint: 'Ludhiana Bus Stand / Jalandhar / Amritsar Junction',
    travelMode: 'AC Tourist Coach / Tempo Traveller',
    itinerary: [
      { day: 1, title: 'Departure from Ludhiana/Tri-City, Golden Temple & Night Palki', description: 'Morning AC coach pickup from Ludhiana / Jalandhar. Check-in to heritage 4-star hotel near Golden Temple. Afternoon visit to Jallianwala Bagh & Partition Museum. Evening peaceful Darshan at Golden Temple and 10 PM Palki Sahib closing ceremony.' },
      { day: 2, title: 'Wagah Border Flag Lowering Ceremony & Culinary Food Walk', description: 'Morning holy dip and Langar community seva. Taste authentic spicy Amritsari Kulcha breakfast at Bhai Kulwant Singh. Afternoon drive to Indo-Pak Wagah Border for high-energy retreat parade. Return drive to Ludhiana by 10 PM.' }
    ],
    inclusions: [
      'AC Coach / Traveller transfers from Ludhiana / Jalandhar & back',
      '1 Night stay in 4-Star Hotel near Golden Temple',
      'Buffet Breakfast & Traditional Amritsari Food Tasting',
      'Wagah Border VIP seating coordination',
      'Expert Punjabi heritage storyteller guide'
    ],
    exclusions: ['Personal souvenir shopping', 'Room service expenses'],
    facilities: ['Near Golden Temple', 'AC Coach Transfers', 'Wagah Border Pass', 'Langar Experience'],
    gpsLocation: { lat: 31.6200, lng: 74.8765, address: 'Sri Harmandir Sahib, Amritsar, Punjab' },
    rating: 4.98,
    reviewsCount: 512,
    bookingsCount: 1120,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 10. Rajasthan Grand Forts Circuit - Kumbhalgarh, Chittorgarh & Udaipur
  {
    _id: 'pkg_107',
    title: 'Rajasthan Grand Forts & Kila Expedition: Kumbhalgarh Fort, Chittorgarh & Udaipur Lake Palace',
    destination: 'Udaipur, Kumbhalgarh & Chittorgarh, Rajasthan',
    tourType: 'Group Tour',
    category: 'Group Tours',
    theme: 'Mighty Forts & Royal Palaces',
    description: 'Explore the invincible fortresses (Kilas) of Mewar. Walk along the 36 km Great Wall of Kumbhalgarh Fort, witness the towering Vijay Stambha and Kirti Stambha at Chittorgarh Kila, cruise Lake Pichola at sunset, and stay in royal Mewari havelis.',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort Kila
      'https://images.unsplash.com/photo-1603258844022-ad18ee1d68fa?auto=format&fit=crop&w=1200&q=80', // Fort walls & ramparts
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80', // Udaipur Lake Pichola & Palace
      'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80'  // Jaisalmer Sonar Qila
    ],
    price: 13500,
    discountPrice: 9999,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 22,
    availableSeats: 8,
    startDates: [new Date(Date.now() + 5 * 86400000).toISOString(), new Date(Date.now() + 12 * 86400000).toISOString()],
    meetingPoint: 'Udaipur City Railway Station / Maharana Pratap Airport',
    travelMode: 'AC Deluxe Coach / Tempo Traveller',
    itinerary: [
      { day: 1, title: 'Arrival in City of Lakes Udaipur & Sunset Boat Cruise', description: 'Check-in to lake-view heritage hotel. Afternoon visit to City Palace complex and sunset boat ride on Lake Pichola overlooking Jag Mandir.' },
      { day: 2, title: 'Kumbhalgarh Fort Expedition (Great Wall of India)', description: 'Scenic drive through Aravalli hills to Kumbhalgarh Kila. Walk the legendary 36 km ramparts and Badal Mahal cloud palace.' },
      { day: 3, title: 'Chittorgarh Fort Day Tour (Pride of Rajputana)', description: 'Full day excursion to Chittorgarh Kila. Explore Vijay Stambha, Rani Padmini Palace, and Gaumukh reservoir.' },
      { day: 4, title: 'Saheliyon Ki Bari & Departure', description: 'Morning leisure visit to Saheliyon Ki Bari gardens and transfer for departure.' }
    ],
    inclusions: [
      '3 Nights accommodation in 4-Star Heritage Haveli Hotel',
      'Daily Buffet Breakfast and Royal Rajasthani Dinners',
      'All Transfers & Sightseeing in AC Coach',
      'Lake Pichola Sunset Boat Cruise Ticket',
      'Licensed Fort Heritage Guide'
    ],
    exclusions: ['Monument entrance fees', 'Personal cafe spending'],
    facilities: ['Heritage Haveli Stay', 'AC Coach Transfers', 'Lake Boat Ride', 'Meals Included'],
    gpsLocation: { lat: 24.5854, lng: 73.7125, address: 'City Palace, Udaipur, Rajasthan' },
    rating: 4.96,
    reviewsCount: 340,
    bookingsCount: 680,
    status: 'approved',
    isAffordableDeal: true,
  }
];



// -------------------------------------------------------------
// 2. STAYS & ACCOMMODATIONS (Hotels, Resorts, Homestays, Hostels, Camping, Villas)
// -------------------------------------------------------------
export const mockHotels = [
  // 1. Mountain Resort - Manali
  {
    _id: 'stay_101',
    name: 'Snow Valley Himalayan Cedar Resort & Spa',
    propertyType: 'Resorts',
    category: 'Resorts',
    description: 'Surrounded by towering pine and cedar trees in Log Huts Area of Old Manali. Panoramic views of snow-capped Pir Panjal ranges, warm wood-paneled suites, spa, multi-cuisine cafe, and bonfire lawns.',
    starRating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Alpine luxury room
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', // Mountain resort exterior
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', // Bedroom
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Log Huts Area, Old Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: '1.2 km from Hadimba Temple',
    location: { lat: 32.2432, lng: 77.1892 },
    amenities: ['High-Speed WiFi', 'Mountain View Balcony', 'Fireplace & Bonfire', 'Free Parking', 'Restaurant & Bar', 'Spa & Wellness'],
    nearbyAttractions: [{ name: 'Hadimba Temple', distanceKm: 1.2 }, { name: 'Mall Road', distanceKm: 2.0 }, { name: 'Old Manali Cafe Street', distanceKm: 0.6 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in',
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      breakfastIncluded: true,
      houseRules: ['Valid government ID required', 'Pets allowed on request']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: false,
    startingPrice: 3499,
    originalPrice: 4800,
    rating: 4.87,
    reviewsCount: 340,
    rooms: [
      { _id: 'room_101_a', name: 'Deluxe Pine-View Balcony Room', type: 'Deluxe Room', price: 3499, discountPrice: 2899, capacity: 2, bedType: 'King Bed', amenities: ['Attached Balcony', 'WiFi', 'Mountain View', 'Tea/Coffee Maker'], available: 5 },
      { _id: 'room_101_b', name: 'Duplex Snow-Peak Family Suite', type: 'Family Suite', price: 6200, discountPrice: 5199, capacity: 4, bedType: '2 King Beds', amenities: ['Private Balcony', 'Separate Lounge', 'Fireplace', 'Mini Bar'], available: 3 }
    ]
  },

  // 2. Beach Resort - Goa
  {
    _id: 'stay_102',
    name: 'Candolim Palms Beachfront Resort & Pool',
    propertyType: 'Resorts',
    category: 'Resorts',
    description: 'Located just 150 meters from the golden sands of Candolim Beach. Features tropical palm gardens, large swimming pool with sunbeds, open-air seafood restaurant, and poolside cocktail lounge.',
    starRating: 4.0,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', // Resort pool palms
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Beach
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', // Hotel bedroom
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Beach Road, Candolim, North Goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    landmark: '150m from Candolim Beach',
    location: { lat: 15.5188, lng: 73.7629 },
    amenities: ['Swimming Pool', 'Beach Access (2 min walk)', 'Free WiFi', 'Poolside Bar', 'Free Parking', 'Airport Shuttle'],
    nearbyAttractions: [{ name: 'Candolim Beach', distanceKm: 0.15 }, { name: 'Fort Aguada', distanceKm: 3.5 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 72 hours prior to check-in',
      checkInTime: '01:00 PM',
      checkOutTime: '11:00 AM',
      breakfastIncluded: true,
      houseRules: ['Couples and families welcome', 'Swimming costumes mandatory in pool']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: false,
    startingPrice: 2899,
    originalPrice: 4200,
    rating: 4.81,
    reviewsCount: 290,
    rooms: [
      { _id: 'room_102_a', name: 'Pool-View Deluxe Room', type: 'Deluxe Room', price: 2899, discountPrice: 2499, capacity: 2, bedType: 'Queen Bed', amenities: ['Pool View', 'Balcony', 'AC', 'Free WiFi'], available: 8 },
      { _id: 'room_102_b', name: 'Private Garden Cottage Suite', type: 'Cottage', price: 4500, discountPrice: 3800, capacity: 3, bedType: 'King Bed + Sofa', amenities: ['Private Sitout', 'Garden View', 'Mini Bar', 'Bathtub'], available: 4 }
    ]
  },

  // 3. Wooden Homestay - Jibhi, Himachal
  {
    _id: 'stay_103',
    name: 'Cedar Pine Riverside Wooden Homestay',
    propertyType: 'Homestays',
    category: 'Homestays',
    description: 'Authentic Kath-Kuni traditional wooden architecture built right on the banks of a gushing crystal-clear mountain stream in Jibhi. Homemade organic Himachali meals, cozy wood stoves, and tranquil forest views.',
    starRating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', // Jibhi wooden lodge
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1200&q=80', // Pine stream
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Near Jibhi Waterfall, Banjar Valley',
    city: 'Jibhi',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: '500m from Jibhi Waterfall',
    location: { lat: 31.6373, lng: 77.4721 },
    amenities: ['Riverside Deck', 'Homemade Meals', 'Free WiFi', 'Bonfire Pit', 'Hiking Trails', 'Pet Friendly'],
    nearbyAttractions: [{ name: 'Jibhi Waterfall', distanceKm: 0.5 }, { name: 'Jalori Pass', distanceKm: 12.0 }, { name: 'Chehni Kothi Fort', distanceKm: 8.0 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 24 hours prior',
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      breakfastIncluded: true,
      houseRules: ['Respect local village culture', 'Quiet hours after 10 PM']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1499,
    originalPrice: 2200,
    rating: 4.95,
    reviewsCount: 180,
    rooms: [
      { _id: 'room_103_a', name: 'Riverfront Wooden Attic Room', type: 'Homestay Room', price: 1499, discountPrice: 1299, capacity: 2, bedType: 'Double Bed', amenities: ['River Sound', 'Wooden Balcony', 'Heated Blanket', 'Hot Water'], available: 4 }
    ]
  },

  // 4. Backpacker Hostel - Dharamshala / Mcleodganj
  {
    _id: 'stay_104',
    name: 'The Himalayan Backpacker & Co-living Hostel',
    propertyType: 'Hostels',
    category: 'Hostels',
    description: 'Vibrant travelers hostel with shared dorms and private rooms overlooking Kangra Valley. Features high-speed fiber internet for remote workers, cafe lounge, board games, community kitchen, and weekend rooftop music jams.',
    starRating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', // Hostel common room / beds
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Dharamkot Road, Mcleodganj',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Near Bhagsu Nag Waterfall',
    location: { lat: 32.2426, lng: 76.3213 },
    amenities: ['100 Mbps WiFi', 'Community Work Desk', 'Cafe & Kitchen', 'Luggage Storage', 'Locker in Dorms', 'Board Games & Library'],
    nearbyAttractions: [{ name: 'Bhagsu Waterfall', distanceKm: 0.8 }, { name: 'Dalai Lama Temple', distanceKm: 1.5 }, { name: 'Triund Trek Base', distanceKm: 2.0 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 24 hours',
      checkInTime: '01:00 PM',
      checkOutTime: '11:00 AM',
      breakfastIncluded: false,
      houseRules: ['18+ age requirement for dorms', 'Lockers provided (bring own lock or buy at reception)']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 599,
    originalPrice: 900,
    rating: 4.88,
    reviewsCount: 420,
    rooms: [
      { _id: 'room_104_a', name: '6-Bed Mixed Dorm Bed with Locker', type: 'Dormitory Bed', price: 599, discountPrice: 499, capacity: 1, bedType: 'Single Bunk Bed', amenities: ['Power Socket', 'Reading Light', 'Personal Locker', 'WiFi'], available: 12 },
      { _id: 'room_104_b', name: 'Private Mountain-View Ensuite Room', type: 'Private Room', price: 1699, discountPrice: 1399, capacity: 2, bedType: 'Queen Bed', amenities: ['Attached Bathroom', 'Work Desk', 'Balcony', 'WiFi'], available: 3 }
    ]
  },

  // 5. Luxury Riverside Camping - Rishikesh
  {
    _id: 'stay_105',
    name: 'Ganges Riverside Alpine Swiss Camp & Glamping',
    propertyType: 'Camping',
    category: 'Camping',
    description: 'Luxury all-weather Swiss alpine tents set in lush nature in Shivpuri, Rishikesh. Featuring attached private tiled bathrooms with running hot water, on-site swimming pool, volleyball court, and evening campfire by the river.',
    starRating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', // Camp nature river
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80', // Glamping tent
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Badrinath Highway, Shivpuri',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    landmark: 'Near Shivpuri Rafting Base',
    location: { lat: 30.1352, lng: 78.3842 },
    amenities: ['Attached Washroom with Geyser', 'Swimming Pool', 'All 3 Meals Included', 'Bonfire & Music', 'Free Parking', 'Rafting Assistance'],
    nearbyAttractions: [{ name: 'Ganges River Bank', distanceKm: 0.2 }, { name: 'Neer Garh Waterfall', distanceKm: 5.0 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 48 hours',
      checkInTime: '12:00 PM',
      checkOutTime: '10:00 AM',
      breakfastIncluded: true,
      houseRules: ['Meals served in buffet dining hall', 'Bonfire provided in designated pit area']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1299,
    originalPrice: 1800,
    rating: 4.82,
    reviewsCount: 230,
    rooms: [
      { _id: 'room_105_a', name: 'Swiss Glamping Tent (Attached Washroom + Cooler/AC)', type: 'Luxury Tent', price: 1299, discountPrice: 1099, capacity: 3, bedType: 'Queen Bed + Single', amenities: ['Attached Bathroom', 'Geyser', 'Ceiling Fan', 'Buffet Meals Included'], available: 8 }
    ]
  },

  // 6. Heritage Palace Stay - Jaipur
  {
    _id: 'stay_106',
    name: 'Rajputana Heritage Haveli & Palace Hotel',
    propertyType: 'Hotels',
    category: 'Hotels',
    description: 'An authentic restored 19th-century royal Rajput Haveli in Jaipur. Hand-painted fresco ceilings, courtyards with fountains, rooftop view of Nahargarh Fort, royal cuisine restaurant, and swimming pool.',
    starRating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', // Haveli hotel
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=1200&q=80', // Jaipur fort
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Bani Park, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    landmark: '2 km from Jaipur Junction',
    location: { lat: 26.9220, lng: 75.7900 },
    amenities: ['Heritage Architecture', 'Swimming Pool', 'Rooftop Restaurant', 'Free WiFi', 'Room Service', 'Cultural Puppet Show'],
    nearbyAttractions: [{ name: 'City Palace', distanceKm: 3.0 }, { name: 'Hawa Mahal', distanceKm: 3.8 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 48 hours prior',
      checkInTime: '02:00 PM',
      checkOutTime: '12:00 PM',
      breakfastIncluded: true,
      houseRules: ['Valet parking available', 'Children below 5 stay free with parents']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: false,
    startingPrice: 3200,
    originalPrice: 4500,
    rating: 4.91,
    reviewsCount: 310,
    rooms: [
      { _id: 'room_106_a', name: 'Royal Heritage Deluxe Room', type: 'Heritage Deluxe', price: 3200, discountPrice: 2699, capacity: 2, bedType: 'King Bed', amenities: ['Carved Wooden Furniture', 'Courtyard View', 'AC', 'Free WiFi'], available: 6 }
    ]
  },

  // 7. Private Villa / Apartment - Amritsar
  {
    _id: 'stay_107',
    name: 'The Golden Heritage Luxury 3BHK Villa',
    propertyType: 'Villas / Apartments',
    category: 'Villas / Apartments',
    description: 'Spacious independent 3-bedroom private villa just 15 minutes from Golden Temple. Perfect for large families and group travelers, featuring fully-equipped modern kitchen, private lawn, high-speed WiFi, and 24/7 caretaker.',
    starRating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // Modern villa interior
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', // Living room
      'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=1200&q=80'
    ],
    address: 'Ranjit Avenue, Amritsar',
    city: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    landmark: 'Near Ranjit Avenue Market',
    location: { lat: 31.6340, lng: 74.8723 },
    amenities: ['Entire 3BHK Villa', 'Equipped Kitchen', 'Private Lawn', 'Free High-Speed WiFi', 'Covered Parking for 2 Cars', '24/7 Caretaker'],
    nearbyAttractions: [{ name: 'Golden Temple', distanceKm: 4.5 }, { name: 'Wagah Border', distanceKm: 28.0 }],
    policies: {
      cancellationPolicy: 'Free cancellation up to 72 hours',
      checkInTime: '02:00 PM',
      checkOutTime: '11:00 AM',
      breakfastIncluded: false,
      houseRules: ['Up to 8 guests allowed', 'Self-cooking allowed with kitchen appliances provided']
    },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: false,
    startingPrice: 6500,
    originalPrice: 8500,
    rating: 4.94,
    reviewsCount: 110,
    rooms: [
      { _id: 'room_107_a', name: 'Complete 3BHK Private Villa (3 King Bedrooms + Hall + Kitchen)', type: 'Entire Villa', price: 6500, discountPrice: 5499, capacity: 8, bedType: '3 King Beds + 2 Extra Mattresses', amenities: ['3 Bathrooms', 'AC in all rooms', 'Modular Kitchen', 'Washing Machine'], available: 1 }
    ]
  }
];

// -------------------------------------------------------------
// 3. STANDALONE ACTIVITIES & ADVENTURE EXPERIENCES
// -------------------------------------------------------------
export const mockActivities = [
  {
    _id: 'act_001',
    title: '83-Meter Giant Bungee Jumping & Giant Swing',
    location: 'Mohanchatti, Rishikesh, Uttarakhand',
    category: 'Adventure Sports',
    image: 'https://images.unsplash.com/photo-1522878129833-838a904a0e9e?auto=format&fit=crop&w=1000&q=80',
    duration: '2 - 3 Hours',
    price: 3750,
    discountPrice: 3550,
    rating: 4.95,
    reviewsCount: 420,
    shortDescription: 'Jump from India’s highest fixed bungee platform (83 meters / 273 ft) designed by Jump Masters from New Zealand with international safety standards.',
    requirements: ['Age: 12 - 45 Years', 'Weight: 40 kg - 110 kg', 'Medical fitness: No severe heart condition / back injury'],
    safetyInfo: 'Operated with certified Australian & NZ trained jump masters. Daily safety harness inspection & backup lines.',
    inclusions: ['83m Bungee Jump Certificate', 'Dare to Jump badge', 'Professional Jump Master Briefing', 'Safety harness gear'],
    slots: ['09:30 AM', '11:30 AM', '01:30 PM', '03:30 PM']
  },
  {
    _id: 'act_002',
    title: 'Tandem Paragliding Flight with HD Action Camera',
    location: 'Bir Billing & Solang Valley, Himachal',
    category: 'Adventure Sports',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1000&q=80',
    duration: '20 - 30 Minutes Air Time',
    price: 3200,
    discountPrice: 2499,
    rating: 4.92,
    reviewsCount: 380,
    shortDescription: 'Soar high above cedar forests and snowy ridges at Bir Billing (world’s 2nd highest takeoff site at 8,000 ft) with an experienced pilot.',
    requirements: ['Age: 10+ Years', 'Weight: 35 kg - 95 kg', 'Shoes: Sport / Trekking shoes mandatory'],
    safetyInfo: 'All flights piloted by pilots with 1,000+ logged air hours with backup reserve parachutes.',
    inclusions: ['20-30 min Tandem Paragliding flight', 'Takeoff point transfer (4x4)', 'GoPro HD video with wide angle footage on your phone'],
    slots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
  },
  {
    _id: 'act_003',
    title: '16 KM White Water Rafting with Cliff Jump & Bodysurfing',
    location: 'Shivpuri to NIM Beach, Rishikesh',
    category: 'Water Sports',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80',
    duration: '3.5 Hours',
    price: 1200,
    discountPrice: 899,
    rating: 4.89,
    reviewsCount: 560,
    shortDescription: 'Navigate thrilling Grade III & IV rapids (Roller Coaster, Golf Course, Clubhouse) on the turquoise Ganges river with a 25 ft cliff jumping stop.',
    requirements: ['Age: 14 - 60 Years', 'Swimmers & non-swimmers welcome (Life jackets provided)'],
    safetyInfo: 'Each raft led by certified IRF river guide with rescue throw bags and approved helmets.',
    inclusions: ['16 KM rafting expedition', 'Life jacket, helmet, paddle', '25ft Cliff Jump safety facilitation', 'Bodysurfing in calm stretch'],
    slots: ['08:30 AM', '11:00 AM', '02:00 PM']
  },
  {
    _id: 'act_004',
    title: 'Triund Hilltop Snow & Ridge Guided Day Trek',
    location: 'Mcleodganj / Dharamkot, Himachal',
    category: 'Trekking & Hiking',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    duration: '1 Full Day (6 - 8 Hours total)',
    price: 1500,
    discountPrice: 1099,
    rating: 4.94,
    reviewsCount: 290,
    shortDescription: 'Hike 9 km through rhododendron and oak forests up to the majestic Triund ridge (9,350 ft) directly facing the towering Dhauladhar snow wall.',
    requirements: ['Basic fitness for 9km uphill walk', 'Warm fleece & sturdy footwear recommended'],
    safetyInfo: 'Accompanied by licensed mountain guide with first aid box and mountain navigation.',
    inclusions: ['Certified local trek guide', 'Packed lunch at Triund top', 'Forest entry permit', 'Trekking pole support'],
    slots: ['07:30 AM Departure']
  },
  {
    _id: 'act_005',
    title: 'Goa Grand Island Scuba Diving & Dolphin Cruise with PADI Guide',
    location: 'Grand Island, Goa',
    category: 'Water Sports',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    duration: '6 Hours (Full Day Boat Trip)',
    price: 3500,
    discountPrice: 2699,
    rating: 4.86,
    reviewsCount: 310,
    shortDescription: 'Boat safari to Grand Island in the Arabian Sea. Includes shallow water scuba training, 15-20 min underwater dive with corals & tropical fish, dolphin spotting, and buffet lunch.',
    requirements: ['Age: 10+ Years', 'Non-swimmers fully welcome (1-on-1 dive master with each guest)'],
    safetyInfo: 'PADI certified instructors with clean compressed oxygen tanks and sanitized dive regulators.',
    inclusions: ['Boat cruise to Grand Island', 'Underwater Scuba Dive with PADI instructor', 'HD underwater photos and videos', 'Dolphin spotting cruise', 'Buffet Lunch & Soft Drinks'],
    slots: ['07:30 AM (Boat Jetty Departure)']
  },
  {
    _id: 'act_006',
    title: 'Amritsar Guided Heritage Walking Tour & Golden Temple Night Palki',
    location: 'Old Walled City, Amritsar, Punjab',
    category: 'Sightseeing & Culture',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
    duration: '3 Hours (Evening Tour)',
    price: 800,
    discountPrice: 499,
    rating: 4.98,
    reviewsCount: 240,
    shortDescription: 'Walk through historic Katras of Old Amritsar, Partition landmarks, taste legendary Amritsari Kulcha & Jalebi, and experience the sacred 10 PM Palki Sahib closing procession.',
    requirements: ['Modest dress code (head covering provided at temple)', 'All age groups welcome'],
    safetyInfo: 'Local Sikh history scholar guide with personalized radio receiver headsets for clear audio.',
    inclusions: ['Expert heritage storyteller guide', 'Traditional food tastings (Kulcha, Lassi, Jalebi)', 'Audio headset guide system', 'Langar community kitchen insight'],
    slots: ['06:00 PM - 09:30 PM']
  },
  {
    _id: 'act_007',
    title: 'Solang Valley Snow Scooter & Tube Sledding Adventure',
    location: 'Solang Valley, Manali, Himachal',
    category: 'Snow Activities',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    duration: '2 Hours',
    price: 1800,
    discountPrice: 1350,
    rating: 4.87,
    reviewsCount: 195,
    shortDescription: 'Feel the rush on powdery snow slopes. Ride high-powered snowmobiles with trained instructors, glide down snow slopes in alpine tubes, and take mountain photos.',
    requirements: ['Warm snow dress and waterproof gumboots (rental available on-site)'],
    safetyInfo: 'Designated snow adventure track with protective boundary barriers.',
    inclusions: ['Snowmobile 2 KM ride with driver', '3 Snow tubing runs', 'Safety helmet and instructor assistance'],
    slots: ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
  }
];

// -------------------------------------------------------------
// 4. NEARBY GETAWAYS (From Punjab / Ludhiana & North India)
// -------------------------------------------------------------
export const mockNearbyGetaways = [
  {
    id: 'gw_01',
    destination: 'Amritsar',
    tagline: 'Golden Temple, Wagah Border & Culinary Soul of Punjab',
    distanceFromLudhiana: '140 km',
    travelTime: '2.5 Hours via NH44',
    idealFor: '1-Day & 2-Day Trips · Family, Friends & Pilgrims',
    tripDurationType: '1-Day Trips',
    budgetEstimate: '₹1,500 - ₹3,500 per person',
    bestTravelMode: 'Vande Bharat / Car / AC Bus',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Sacred Golden Temple & Langar', 'Patriotic Wagah Border Retreat', 'Partition Museum', 'Authentic Amritsari Food Walks'],
    packageLink: '/packages/pkg_106'
  },
  {
    id: 'gw_02',
    destination: 'Chandigarh & Kasauli',
    tagline: 'Modern Architecture, Sukhna Lake & Pine Ridge Walks',
    distanceFromLudhiana: '100 km (Chd) / 145 km (Kasauli)',
    travelTime: '1.5 - 3 Hours',
    idealFor: '1-Day & Weekend Trips · Couples & Cafes',
    tripDurationType: 'Weekend Trips',
    budgetEstimate: '₹2,000 - ₹4,500 per person',
    bestTravelMode: 'Car / AC Cab / Bus',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Sukhna Lake Boating & Rock Garden', 'Kasauli Gilbert Pine Trail', 'Sector 8 & 26 Vibrant Cafes', 'Timber Trail Ropeway'],
    packageLink: '/packages'
  },
  {
    id: 'gw_03',
    destination: 'Shimla & Kufri',
    tagline: 'Queen of Hills, British Mall Road & Snow Peaks',
    distanceFromLudhiana: '215 km',
    travelTime: '4.5 - 5 Hours',
    idealFor: '2-Day Trips · Family & Honeymoon',
    tripDurationType: '2-Day Trips',
    budgetEstimate: '₹3,500 - ₹7,000 per person',
    bestTravelMode: 'AC Cab / Volvo Coach',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Historic Ridge & Mall Road', 'Jakhoo Ropeway to Hanuman Temple', 'Kufri Snow & Horse Rides', 'Naldehra Golf Course'],
    packageLink: '/packages'
  },

  {
    id: 'gw_04',
    destination: 'Jibhi & Tirthan Valley',
    tagline: 'Pristine Pine Woods, Hidden Waterfalls & Jalori Pass',
    distanceFromLudhiana: '320 km',
    travelTime: '7 - 8 Hours (Overnight Friday Bus)',
    idealFor: '3-Day Trips & Every Friday Weekend Departures · Gen Z & Friends',
    tripDurationType: '3-Day Trips',
    budgetEstimate: '₹4,999 - ₹6,500 (All-inclusive)',
    bestTravelMode: 'AC Pushback Group Coach / Cab',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Jibhi Waterfall & Treehouses', 'Jalori Pass 360-degree snow panorama', 'Serolsar Lake pine trek', 'Trout fishing in Tirthan river'],
    packageLink: '/packages/pkg_101'
  },
  {
    id: 'gw_05',
    destination: 'Kasol & Parvati Valley',
    tagline: 'Hippie Cafes, Riverside Camps & Natural Hot Sulfur Springs',
    distanceFromLudhiana: '340 km',
    travelTime: '7.5 - 8 Hours',
    idealFor: '3-Day Trips & Adventure Getaways · College Groups & Solo',
    tripDurationType: '3-Day Trips',
    budgetEstimate: '₹4,500 - ₹6,000 per person',
    bestTravelMode: 'AC Volvo Bus / Cab',
    image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Chalal Riverside Pine Walk', 'Manikaran Sahib Gurudwara Hot Springs', 'Kheerganga Summit Trek', 'Israeli Cafes in Old Kasol'],
    packageLink: '/packages/pkg_102'
  },
  {
    id: 'gw_06',
    destination: 'Mcleodganj & Dharamshala',
    tagline: 'Little Lhasa, Monasteries & Triund Stargazing Camp',
    distanceFromLudhiana: '205 km',
    travelTime: '4.5 - 5 Hours',
    idealFor: '2-Day & 3-Day Trips · Trekking & Cultural Retreats',
    tripDurationType: '2-Day Trips',
    budgetEstimate: '₹3,500 - ₹5,500 per person',
    bestTravelMode: 'AC Bus / Private Sedan',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    highlights: ['His Holiness Dalai Lama Temple', 'Triund Ridge Day Hike', 'Bhagsu Waterfall & Shiva Cafe', 'Tibetan Handicraft Market'],
    packageLink: '/packages/pkg_103'
  },
  {
    id: 'gw_07',
    destination: 'Rishikesh & Haridwar',
    tagline: 'River Rafting Capital, Beach Camps & Evening Maha Aarti',
    distanceFromLudhiana: '280 km',
    travelTime: '5.5 - 6 Hours',
    idealFor: '2-Day & 3-Day Trips · Adventure Sports & Spiritual Energy',
    tripDurationType: 'Weekend Trips',
    budgetEstimate: '₹3,000 - ₹5,000 per person',
    bestTravelMode: 'Vande Bharat / Train / Cab',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1000&q=80',
    highlights: ['16 KM White Water Rafting', '83m Bungee Jumping in Mohanchatti', 'Triveni Ghat Evening Ganga Aarti', 'Beatles Ashram & Tapovan Cafes'],
    packageLink: '/packages/pkg_302'
  },
  {
    id: 'gw_08',
    destination: 'Dalhousie & Khajjiar',
    tagline: 'Mini Switzerland of India, Deodar Forests & Colonial Charm',
    distanceFromLudhiana: '240 km',
    travelTime: '5.5 Hours',
    idealFor: '2-Day & 3-Day Trips · Families & Couples',
    tripDurationType: '2-Day Trips',
    budgetEstimate: '₹4,000 - ₹6,500 per person',
    bestTravelMode: 'AC Cab / Train to Pathankot',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Khajjiar Meadow & Lake', 'Dainkund Peak 360-degree viewpoint', 'Panchpula Waterfalls', 'Colonial Churches of Dalhousie'],
    packageLink: '/packages'
  }
];

// -------------------------------------------------------------
// 5. TRANSPORTATION OPTIONS (Flights, Trains, Buses, Cabs)
// -------------------------------------------------------------
export const mockTransportRoutes = {
  flights: [
    { id: 'fl_01', airline: 'IndiGo', flightNo: '6E 2145', from: 'Delhi (DEL)', to: 'Goa (GOX)', departure: '07:15 AM', arrival: '09:45 AM', duration: '2h 30m', stops: 'Non-stop', price: 4850, baggage: '15 kg Check-in + 7 kg Cabin' },
    { id: 'fl_02', airline: 'Air India', flightNo: 'AI 883', from: 'Delhi (DEL)', to: 'Srinagar (SXR)', departure: '11:20 AM', arrival: '12:50 PM', duration: '1h 30m', stops: 'Non-stop', price: 5400, baggage: '15 kg Check-in + 7 kg Cabin' },
    { id: 'fl_03', airline: 'Vistara', flightNo: 'UK 945', from: 'Chandigarh (IXC)', to: 'Mumbai (BOM)', departure: '03:40 PM', arrival: '06:05 PM', duration: '2h 25m', stops: 'Non-stop', price: 5900, baggage: '15 kg Check-in + 7 kg Cabin' },
    { id: 'fl_04', airline: 'IndiGo', flightNo: '6E 612', from: 'Amritsar (ATQ)', to: 'Delhi (DEL)', departure: '08:50 AM', arrival: '09:55 AM', duration: '1h 05m', stops: 'Non-stop', price: 2950, baggage: '15 kg Check-in + 7 kg Cabin' },
    { id: 'fl_05', airline: 'Alliance Air', flightNo: '9I 805', from: 'Delhi (DEL)', to: 'Kullu Manali (KUU)', departure: '06:45 AM', arrival: '08:05 AM', duration: '1h 20m', stops: 'Non-stop', price: 6200, baggage: '15 kg Check-in + 7 kg Cabin' }
  ],
  trains: [
    { id: 'tr_01', trainNo: '22439', trainName: 'Vande Bharat Express', from: 'New Delhi (NDLS)', to: 'Katra / Vaishno Devi', dep: '06:00 AM', arr: '02:00 PM', duration: '8h 00m', classes: ['CC: ₹1,550', 'EC: ₹2,880'], runsOn: 'All days except Tue' },
    { id: 'tr_02', trainNo: '12013', trainName: 'Amritsar Shatabdi', from: 'New Delhi (NDLS)', to: 'Ludhiana / Amritsar', dep: '04:30 PM', arr: '09:05 PM (Ludhiana)', duration: '4h 35m', classes: ['CC: ₹940', 'EC: ₹1,690'], runsOn: 'Daily' },
    { id: 'tr_03', trainNo: '12059', trainName: 'Kota Jan Shatabdi', from: 'Hazrat Nizamuddin (NZM)', to: 'Jaipur / Kota', dep: '12:45 PM', arr: '05:30 PM', duration: '4h 45m', classes: ['2S: ₹185', 'CC: ₹640'], runsOn: 'Daily' },
    { id: 'tr_04', trainNo: '12017', trainName: 'Dehradun Shatabdi', from: 'New Delhi (NDLS)', to: 'Haridwar / Rishikesh', dep: '06:45 AM', arr: '11:33 AM (Haridwar)', duration: '4h 48m', classes: ['CC: ₹890', 'EC: ₹1,540'], runsOn: 'Daily' }
  ],
  buses: [
    { id: 'bs_01', operator: 'Zingbus Electric / Volvo 9600', route: 'Delhi (Kashmiri Gate) → Manali Mall Road', dep: '08:30 PM', arr: '08:30 AM', duration: '12h 00m', type: 'Multi-Axle AC Semi-Sleeper (2+2)', price: 1199, rating: 4.8, amenities: ['Live GPS', 'USB Charger', 'Blanket & Water', 'Emergency Button'] },
    { id: 'bs_02', operator: 'City Land Travels AC Volvo', route: 'Chandigarh (Sector 43) → Kasol / Bhuntar', dep: '10:00 PM', arr: '06:30 AM', duration: '8h 30m', type: 'AC Volvo Semi-Sleeper', price: 950, rating: 4.7, amenities: ['Live GPS', 'Reading Light', 'Blanket'] },
    { id: 'bs_03', operator: 'IntrCity SmartBus Premium', route: 'Ludhiana (Sherpur Chowk) → Delhi Airport (IGI)', dep: '11:00 PM', arr: '05:00 AM', duration: '6h 00m', type: 'AC Sleeper / Seater Lounge', price: 850, rating: 4.9, amenities: ['Airport Drop', 'WiFi', 'Washroom onboard'] },
    { id: 'bs_04', operator: 'Laxmi Holidays Volvo Multi-Axle', route: 'Delhi (Majnu Ka Tila) → Shimla ISBT', dep: '10:30 PM', arr: '06:30 AM', duration: '8h 00m', type: 'AC Volvo B11R', price: 799, rating: 4.75, amenities: ['Comfort Footrest', 'Water bottle'] }
  ],
  cabs: [
    { id: 'cab_01', vehicleType: 'Sedan (Swift Dzire / Etios)', capacity: '4 Passengers + 2 Bags', ratePerKm: '₹12/km', baseTripCost: '₹2,800', bestFor: 'Couples, Solo, Chandigarh to Shimla / Delhi', features: ['Clean AC Sedan', 'Verified Commercial Chauffeur', 'Fastag Enabled'] },
    { id: 'cab_02', vehicleType: 'Premium SUV (Toyota Innova Crysta)', capacity: '6-7 Passengers + 4 Bags', ratePerKm: '₹18/km', baseTripCost: '₹4,500', bestFor: 'Families & Himalayan Mountain Roads', features: ['Captain Seats', 'Dual AC', 'Experienced Hill Driver', 'Luggage Carrier'] },
    { id: 'cab_03', vehicleType: 'Deluxe Tempo Traveller (12 / 17 / 26 Seater)', capacity: '12 - 26 Passengers + Large Boot', ratePerKm: '₹24/km', baseTripCost: '₹7,500', bestFor: 'College Groups, Corporate Teams & Weekend Tours', features: ['Pushback Recliner Seats', 'Music System & LED', 'Ample Legroom'] }
  ]
};

// -------------------------------------------------------------
// 6. PASSPORT ASSISTANCE SERVICES
// -------------------------------------------------------------
export const mockPassportPlans = [
  {
    id: 'pass_fresh',
    name: 'Fresh Passport Application Assistance (Adult)',
    category: 'Fresh Application',
    description: 'Complete guidance and end-to-end procedural support for first-time passport applicants. Includes document pre-screening, official Passport Seva portal submission, appointment booking, and interview preparation.',
    officialGovtFee: 1500,
    agencyServiceFee: 499,
    estimatedDays: '15 - 20 Working Days (subject to police verification)',
    keyInclusions: [
      'Document eligibility & error check',
      'Official Passport Seva account creation & form filling',
      'Appointment scheduling at nearest PSK / POPSK',
      'Document checklist & verification kit',
      'Post-appointment dispatch tracking support'
    ]
  },
  {
    id: 'pass_tatkal',
    name: 'Tatkaal (Urgent) Passport Assistance',
    category: 'Tatkaal Urgent',
    description: 'Expedited application assistance for urgent travel. Priority slot booking and Annexure preparation for dispatch within 3 - 5 days through official government Tatkaal scheme.',
    officialGovtFee: 3500,
    agencyServiceFee: 799,
    estimatedDays: '3 - 5 Working Days (Official Tatkaal timeline)',
    keyInclusions: [
      'Tatkaal mandatory 3-document verification check',
      'Immediate priority appointment booking at PSK',
      'Annexure F / E documentation assistance',
      'Dedicated executive phone support'
    ]
  },
  {
    id: 'pass_renewal',
    name: 'Passport Renewal / Re-issue Assistance',
    category: 'Renewal & Re-issue',
    description: 'For expiring passports, exhausted visa pages, damaged passports, or changes in name / address / marital status.',
    officialGovtFee: 1500,
    agencyServiceFee: 499,
    estimatedDays: '10 - 15 Working Days',
    keyInclusions: [
      'Old passport validation check',
      'Name / Address correction affidavit drafting assistance',
      'Slot booking at regional PSK center',
      'Status tracking alerts via SMS / WhatsApp'
    ]
  },
  {
    id: 'pass_minor',
    name: 'Minor Passport Assistance (Under 18 Years)',
    category: 'Minor Passport',
    description: 'Application assistance for children below 18 years, including parent consent Annexure D preparation and document formatting.',
    officialGovtFee: 1000,
    agencyServiceFee: 499,
    estimatedDays: '12 - 18 Working Days',
    keyInclusions: [
      'Minor Annexure D preparation',
      'Parental passport & birth certificate verification',
      'Joint appointment scheduling for parents & child'
    ]
  },
  {
    id: 'pass_pcc',
    name: 'Police Clearance Certificate (PCC) Assistance',
    category: 'Police Clearance',
    description: 'Procedural support for immigration, employment, long-term student visas, and overseas residency PCC requests.',
    officialGovtFee: 500,
    agencyServiceFee: 399,
    estimatedDays: '7 - 12 Working Days',
    keyInclusions: [
      'PCC form filing on official MEA portal',
      'Appointment at regional PSK',
      'Local police station coordination guidance'
    ]
  }
];

export const passportDocumentChecklists = {
  fresh: [
    { doc: 'Proof of Date of Birth', options: 'Birth Certificate / 10th Standard School Marksheet / Pan Card' },
    { doc: 'Proof of Present Address', options: 'Aadhaar Card / Bank Passbook with photo & bank seal / Electricity Bill / Rent Agreement' },
    { doc: 'Proof of Identity', options: 'Aadhaar Card / Voter ID Card / PAN Card' },
    { doc: 'Non-ECR (Emigration Check Not Required)', options: '10th Standard Passing Certificate or higher educational degree' }
  ],
  renewal: [
    { doc: 'Original Old Passport', options: 'First 2 and last 2 pages along with ECR/Non-ECR page' },
    { doc: 'Self-attested copies of old passport', options: 'Self-attested photocopies of all pages' },
    { doc: 'Proof of Address (if address changed)', options: 'Updated Aadhaar Card / Bank Passbook / Electricity Bill' }
  ],
  tatkal: [
    { doc: 'Any 3 Official Documents', options: '1. Aadhaar Card, 2. PAN Card, 3. Voter ID / 10th Certificate / Driving License' },
    { doc: 'Annexure E / Self-Declaration', options: 'Standard verification affidavit for Tatkaal scheme' }
  ]
};

// -------------------------------------------------------------
// 7. USER BOOKINGS & PAST MEMORIES
// -------------------------------------------------------------
export const mockCustomerBookings = [
  {
    _id: 'bk_101',
    bookingType: 'package',
    package: mockPackages[0],
    itemTitle: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    destination: 'Jibhi & Tirthan Valley, Himachal Pradesh',
    image: mockPackages[0].images[0],
    bookingDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    guestsCount: 2,
    totalAmount: 11998,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_in_991238',
    primaryGuest: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210' }
  },
  {
    _id: 'bk_102',
    bookingType: 'hotel',
    hotel: mockHotels[0],
    itemTitle: 'Snow Valley Himalayan Cedar Resort & Spa',
    destination: 'Manali, Himachal Pradesh',
    image: mockHotels[0].images[0],
    bookingDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    checkInDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    checkOutDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    guestsCount: 2,
    roomName: 'Deluxe Pine-View Balcony Room',
    totalAmount: 5798,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_in_884219',
    primaryGuest: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210' }
  },
  {
    _id: 'bk_103',
    bookingType: 'activity',
    activity: mockActivities[0],
    itemTitle: '83-Meter Giant Bungee Jumping & Giant Swing',
    destination: 'Mohanchatti, Rishikesh',
    image: mockActivities[0].image,
    bookingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    activityDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    slotTime: '11:30 AM',
    guestsCount: 1,
    totalAmount: 3550,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_in_772190',
    primaryGuest: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210' }
  },
  {
    _id: 'bk_104',
    bookingType: 'passport',
    servicePlan: mockPassportPlans[0],
    itemTitle: 'Fresh Passport Application Assistance (Adult)',
    destination: 'PSK Ludhiana / Chandigarh',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    applicantName: 'Priya Sharma',
    dob: '1998-05-14',
    preferredPSK: 'PSK Ludhiana (Near Model Town)',
    totalAmount: 1999, // 1500 govt + 499 agency
    govtFee: 1500,
    agencyFee: 499,
    status: 'under_review',
    applicationTrackingId: 'MEA-LDH-2026-88192',
    paymentStatus: 'paid',
    paymentId: 'pay_in_664192',
    primaryGuest: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210' }
  }
];

export const mockPreviousTripGallery = [
  { id: 'spot_01', title: 'Serolsar Lake Snow Forest Trail', spot: 'Jalori Pass, Jibhi, HP', category: 'Mountains', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', traveler: 'Rohit Verma & Friends', quote: 'Jibhi riverside wooden stay and the snowy trail to Serolsar lake was pure magic.', rating: 5.0, likes: 450, date: 'January 2026' },
  { id: 'spot_02', title: 'Sunset over Sam Sand Dunes', spot: 'Jaisalmer, Rajasthan', category: 'Heritage', image: 'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80', traveler: 'Ananya & Siddharth', quote: 'Camel safari, Kalbeliya folk dance under starry desert skies. Perfectly organized.', rating: 4.9, likes: 380, date: 'December 2025' },
  { id: 'spot_03', title: 'Golden Temple Evening Palki Sahib', spot: 'Amritsar, Punjab', category: 'Cultural', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80', traveler: 'Gurpreet & Family', quote: 'Peaceful atmosphere and midnight Langar seva. Unforgettable spiritual experience.', rating: 5.0, likes: 510, date: 'February 2026' },
  { id: 'spot_04', title: '16KM White Water Rafting', spot: 'Shivpuri, Rishikesh', category: 'Adventure', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80', traveler: 'Karan & Corporate Team', quote: 'The 25ft cliff jump into holy Ganges river was the highlight of our weekend!', rating: 4.95, likes: 390, date: 'November 2025' }
];

export const domesticDestinations = [
  { name: 'Himachal Pradesh', query: 'Himachal', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80', subText: 'Jibhi, Manali, Kasol, Spiti & Shimla', badge: 'Mountains & Treks' },
  { name: 'Kashmir', query: 'Kashmir', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=80', subText: 'Srinagar, Dal Lake, Gulmarg & Pahalgam', badge: 'Heaven on Earth' },
  { name: 'Rajasthan', query: 'Rajasthan', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80', subText: 'Jaipur, Jodhpur Fort, Jaisalmer & Thar Desert', badge: 'Royal Forts & Heritage' },
  { name: 'Punjab & Amritsar', query: 'Amritsar', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=700&q=80', subText: 'Golden Temple & Wagah Border Retreat', badge: 'Culture & Food' },
  { name: 'Uttarakhand', query: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=700&q=80', subText: 'Rishikesh Rafting, Mussoorie & Nainital', badge: 'River Rafting & Yoga' },
  { name: 'Goa', query: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80', subText: 'Candolim, Baga, Fontainhas & Cruises', badge: 'Sun & Beaches' }
];

// -------------------------------------------------------------
// LOCAL PERSISTENCE HELPERS
// -------------------------------------------------------------
const STORAGE_KEY_PACKAGES = 'travelagency_packages_v9';
const STORAGE_KEY_HOTELS = 'travelagency_hotels_v9';
const STORAGE_KEY_ACTIVITIES = 'travelagency_activities_v9';
const STORAGE_KEY_BOOKINGS = 'travelagency_bookings_v9';
const STORAGE_KEY_PASSPORT = 'travelagency_passport_v9';
const STORAGE_KEY_WISHLIST = 'travelagency_wishlist_v9';



export const getStoredPackages = () => {
  const stored = localStorage.getItem(STORAGE_KEY_PACKAGES);
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(mockPackages));
  return mockPackages;
};

export const getStoredHotels = () => {
  const stored = localStorage.getItem(STORAGE_KEY_HOTELS);
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem(STORAGE_KEY_HOTELS, JSON.stringify(mockHotels));
  return mockHotels;
};

export const getStoredActivities = () => {
  const stored = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(mockActivities));
  return mockActivities;
};

export const getStoredBookings = () => {
  const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(mockCustomerBookings));
  return mockCustomerBookings;
};

export const saveBooking = (newBooking) => {
  const bookings = getStoredBookings();
  const updated = [newBooking, ...bookings];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return updated;
};

export const getStoredPassportRequests = () => {
  const stored = localStorage.getItem(STORAGE_KEY_PASSPORT);
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  const initial = [mockCustomerBookings.find(b => b.bookingType === 'passport')].filter(Boolean);
  localStorage.setItem(STORAGE_KEY_PASSPORT, JSON.stringify(initial));
  return initial;
};

export const savePassportRequest = (req) => {
  const list = getStoredPassportRequests();
  const updated = [req, ...list];
  localStorage.setItem(STORAGE_KEY_PASSPORT, JSON.stringify(updated));
  // also add to universal bookings
  saveBooking(req);
  return updated;
};

export const getStoredWishlist = () => {
  const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  const initial = [mockPackages[0], mockHotels[0]];
  localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(initial));
  return initial;
};

export const toggleWishlistItem = (item) => {
  const list = getStoredWishlist();
  const exists = list.some(x => x._id === item._id);
  const updated = exists ? list.filter(x => x._id !== item._id) : [...list, item];
  localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(updated));
  return updated;
};

export const mockCustomerPastTrips = [
  {
    id: 'trip_001',
    packageTitle: 'Himachal Group Tour: Jibhi & Tirthan Valley',
    destination: 'Jibhi, Himachal Pradesh',
    travelDates: '10 Jan 2026 - 13 Jan 2026',
    days: 3,
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    costPaid: '₹5,999',
    ratingGiven: 5,
    spotsVisited: [
      { name: 'Jibhi Waterfall', type: 'Nature Walk', rating: 5, notes: 'Wooden bridge over pine stream.' },
      { name: 'Serolsar Lake', type: 'Trek', rating: 5, notes: 'Snowy trail through oak trees.' }
    ],
    photos: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'],
    reviewNote: 'Great weekend trip! Bus was super clean and coordinator was awesome.'
  }
];

export const getStoredMemories = () => {
  const stored = localStorage.getItem('travelagency_memories_v6');
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem('travelagency_memories_v6', JSON.stringify(mockCustomerPastTrips));
  return mockCustomerPastTrips;
};

export const saveMemory = (newMemory) => {
  const memories = getStoredMemories();
  const updated = [newMemory, ...memories];
  localStorage.setItem('travelagency_memories_v6', JSON.stringify(updated));
  return updated;
};

