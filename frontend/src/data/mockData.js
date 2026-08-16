// Comprehensive PCTE Travel Agency Data Store — Freedom To Evolve
// Featuring Every Friday Weekend Tours, Educational Journeys, Himalayan Expeditions, & Heritage Stays

export const mockUsers = {
  customer: {
    _id: 'cust_001',
    name: 'Priya Sharma',
    email: 'customer@pctetravels.com',
    role: 'customer',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    city: 'Ludhiana, Punjab',
    joinedDate: 'March 2023',
    tripsCompleted: 5,
    spotsVisited: 22,
    reviewsGiven: 9,
  },
  agency: {
    _id: 'agency_001',
    name: 'PCTE Travel Agency',
    email: 'info@pctetravels.com',
    role: 'agency',
    agencyName: 'PCTE Travel Agency',
    agencyDescription: 'Official PCTE Travel Agency — Freedom To Evolve. Specializing in Every Friday Weekend Trips, Educational Journeys, Himalayan Treks, and Royal Heritage Expeditions.',
    agencyStatus: 'approved',
    phone: '+91 99966 96928',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  admin: {
    _id: 'admin_001',
    name: 'PCTE Admin',
    email: 'admin@pctetravels.com',
    role: 'admin',
    phone: '+91 98000 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  }
};

export const mockPackages = [
  // 1. EVERY FRIDAY WEEKEND TOUR - JIBHI & TIRTHAN VALLEY
  {
    _id: 'pkg_101',
    title: 'Jibhi & Tirthan Valley Weekend Tour (Every Friday Departure)',
    destination: 'Jibhi & Tirthan Valley, Himachal',
    description: 'Depart every Friday evening from Delhi/Chandigarh. Explore hidden pine forest waterfalls, Jalori Pass (10,800ft), 360° Serolsar Lake trek, and riverside wooden homestays.',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=900&q=80'
    ],
    price: 8500,
    discountPrice: 5999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 24,
    availableSeats: 9,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString(), new Date(Date.now() + 11 * 86400000).toISOString()],
    meetingPoint: 'Majnu Ka Tila (Delhi) / Tribune Chowk (Chandigarh)',
    travelMode: 'AC Pushback Coach / Tempo Traveller',
    itinerary: [
      { day: 1, title: 'Friday Night Departure & Scenic Drive', description: 'Overnight journey in AC Tempo Traveller through Mandi & Aut Tunnel into Tirthan Valley.' },
      { day: 2, title: 'Jibhi Waterfall & Wooden Treehouse Check-in', description: 'Check-in to riverside wooden cottages. Hike to Jibhi Waterfall and evening bonfire with acoustic jams.' },
      { day: 3, title: 'Jalori Pass & Serolsar Lake Snow Trek', description: 'Drive up Jalori Pass (10,800ft) and 5km snow forest trek to Serolsar Lake. Board return Volvo in evening.' }
    ],
    inclusions: ['AC Coach Transfers (Delhi/Chandigarh - Jibhi - Delhi)', '2 Nights in Wooden Riverside Cottages', '4 Meals (Breakfasts & Dinners)', 'Bonfire & Music Evening', 'Guided Trek to Serolsar Lake'],
    exclusions: ['Lunch & personal cafe spends', 'Trekking gear rental'],
    facilities: ['Weekend Friday Departure', 'AC Coach', 'Riverside Stay', 'Bonfire Included'],
    category: 'Weekend Tours',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 31.6373, lng: 77.4721, address: 'Jibhi, Himachal Pradesh' },
    rating: 4.95,
    reviewsCount: 310,
    bookingsCount: 840,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 2. EVERY FRIDAY WEEKEND TOUR - KASOL & KHEERGANGA TREK
  {
    _id: 'pkg_102',
    title: 'Kasol, Manikaran & Kheerganga Natural Hot Springs Trek',
    destination: 'Kasol & Parvati Valley, Himachal',
    description: 'The ultimate Parvati Valley weekend getaway. Hike past pine forests and waterfalls to Kheerganga top (9,700ft), dip in natural hot thermal springs, and experience hippie Israel cafe culture in Kasol.',
    images: [
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=900&q=80'
    ],
    price: 7999,
    discountPrice: 4999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 30,
    availableSeats: 12,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString(), new Date(Date.now() + 11 * 86400000).toISOString()],
    meetingPoint: 'Kashmiri Gate ISBT, Delhi',
    travelMode: 'Semi-Sleeper AC Volvo',
    itinerary: [
      { day: 1, title: 'Friday Night Volvo Departure', description: 'Overnight Volvo journey to Bhuntar & Kasol.' },
      { day: 2, title: 'Kasol Chalal Riverside Walk & Manikaran Sahib', description: 'Check-in to Parvati river camp. Visit historic Manikaran Sahib Gurudwara and explore Kasol market cafes.' },
      { day: 3, title: 'Kheerganga Summit Trek & Hot Springs', description: 'Guided 12km trek to Kheerganga top. Relax in natural hot sulfur springs surrounded by snowy peaks.' }
    ],
    inclusions: ['AC Volvo Bus Tickets', '1 Night Kasol Camp + 1 Night Kheerganga Dome Tents', 'Daily Breakfast & Dinner', 'Trek Guide & Sleeping Bags'],
    exclusions: ['Lunch', 'Personal expenses'],
    facilities: ['Alpine Dome Tents', 'Hot Thermal Springs', 'Guided Trek', 'Volvo Transfers'],
    category: 'Weekend Tours',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 32.0100, lng: 77.3150, address: 'Kasol, Parvati Valley, HP' },
    rating: 4.91,
    reviewsCount: 420,
    bookingsCount: 1120,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 3. EVERY FRIDAY WEEKEND TOUR - MCLEODGANJ & TRIUND TREK
  {
    _id: 'pkg_103',
    title: 'Mcleodganj Dalai Lama Temple & Triund Hilltop Camping',
    destination: 'Mcleodganj & Dharamshala, Himachal',
    description: 'Experience Tibetan culture, Bhagsu waterfall, Dalai Lama Temple, and camp under millions of stars on Triund Hill (9,350ft) with towering Dhauladhar snow ridges.',
    images: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80'
    ],
    price: 7499,
    discountPrice: 4799,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 25,
    availableSeats: 8,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString()],
    meetingPoint: 'Delhi ISBT / Chandigarh Tribune Chowk',
    travelMode: 'Semi-Sleeper AC Volvo',
    itinerary: [
      { day: 1, title: 'Friday Night Volvo Departure', description: 'Board evening Volvo bus to Dharamshala.' },
      { day: 2, title: 'Mcleodganj & Dalai Lama Monastery', description: 'Check-in to hotel. Visit Namgyal Monastery, St. John in Wilderness church, and Bhagsu Nag waterfall.' },
      { day: 3, title: 'Triund Hill Trek & Sunset Camping', description: 'Scenic 9km hike to Triund Top. Sunset bonfire and stargazing over Dhauladhar snow wall.' }
    ],
    inclusions: ['AC Volvo Bus Transfers', '1 Night Mcleodganj Hotel + 1 Night Triund Ridge Tents', 'Daily Breakfast & Dinner', 'Certified Trek Leader'],
    exclusions: ['Pony charges', 'Personal lunch'],
    facilities: ['Triund Ridge Camp', 'Tibetan Monastery Tour', 'Guide Included'],
    category: 'Weekend Tours',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 32.2426, lng: 76.3213, address: 'Mcleodganj, Dharamshala' },
    rating: 4.88,
    reviewsCount: 290,
    bookingsCount: 780,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 4. SPITI VALLEY CIRCUIT (Himachal Special)
  {
    _id: 'pkg_104',
    title: 'Spiti Valley Ultimate Circuit Tour (9 Days Expedition)',
    destination: 'Spiti Valley, Himachal',
    description: 'Journey through Middle Land. Cross Kunzum Pass (15,000ft), visit Key Monastery, Hikkim (world’s highest post office), Langza Buddha Statue, Chicham Bridge & Chandratal Lake.',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80'
    ],
    price: 24999,
    discountPrice: 18999,
    durationDays: 9,
    durationNights: 8,
    totalSeats: 16,
    availableSeats: 5,
    startDates: [new Date(Date.now() + 10 * 86400000).toISOString(), new Date(Date.now() + 24 * 86400000).toISOString()],
    meetingPoint: 'Chandigarh Railway Station / Airport',
    travelMode: '4x4 Tempo Traveller / SUV',
    itinerary: [
      { day: 1, title: 'Chandigarh to Shimla / Narkanda', description: 'Drive through apple orchards to Narkanda.' },
      { day: 2, title: 'Narkanda to Sangla & Chitkul (Last Village)', description: 'Drive along Sutlej river to Chitkul, the last Indian village near Tibet border.' },
      { day: 3, title: 'Chitkul to Kalpa & Suicide Point View', description: 'Marvel at 6,000m Kinnaur Kailash peak views from Kalpa.' },
      { day: 4, title: 'Kalpa to Kaza via Nako Lake & Tabo Monastery', description: 'Visit 1000-year-old Tabo monastery and Gue Mummy village.' },
      { day: 5, title: 'Kaza High Altitude Villages (Hikkim, Komic, Langza)', description: 'Send postcards from Hikkim (14,567ft), highest post office in the world.' },
      { day: 6, title: 'Key Monastery & Chicham Suspension Bridge', description: 'Explore iconic Key Monastery perched on cliff and cross Asia’s highest bridge.' },
      { day: 7, title: 'Kaza to Chandratal Moon Lake Camping', description: 'Cross Kunzum Pass (15,000ft) and camp near crystal-blue Chandratal Lake.' },
      { day: 8, title: 'Chandratal to Manali via Atal Tunnel', description: 'Drive through rugged Lahaul terrain and Atal Tunnel into Manali.' },
      { day: 9, title: 'Manali to Chandigarh Departure', description: 'Return drive with memories of Spiti cold desert.' }
    ],
    inclusions: ['Private 4x4 SUV / Tempo Traveller for 9 Days', '8 Nights Stay in Boutique Homestays & Chandratal Camps', 'All Breakfasts & Dinners', 'Inner Line Permit fees', 'Oxygen Cylinder support'],
    exclusions: ['Personal expenses & lunches'],
    facilities: ['4x4 Vehicle', 'High Altitude Tents', 'Postcard Experience', 'Permits Included'],
    category: 'Adventure',
    budgetCategory: 'Moderate',
    gpsLocation: { lat: 32.2276, lng: 78.0710, address: 'Kaza, Spiti Valley, HP' },
    rating: 4.97,
    reviewsCount: 180,
    bookingsCount: 460,
    status: 'approved',
    isAffordableDeal: false,
  },

  // 5. EDUCATIONAL JOURNEY (Student Group Trip & Heritage)
  {
    _id: 'pkg_105',
    title: 'Educational Heritage & Eco-Science Tour (Punjab & Himachal)',
    destination: 'Amritsar & Palampur, Punjab & HP',
    description: 'Specially crafted for schools, colleges & student groups. Visit Golden Temple, Jallianwala Bagh, Wagah Border retreat, IHBT Tea Science Lab & organic farm workshops.',
    images: [
      'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?auto=format&fit=crop&w=900&q=80'
    ],
    price: 6500,
    discountPrice: 4299,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 45,
    availableSeats: 28,
    startDates: [new Date(Date.now() + 12 * 86400000).toISOString()],
    meetingPoint: 'Amritsar Junction Station / School Campus',
    travelMode: 'Deluxe 45-Seater AC Coach',
    itinerary: [
      { day: 1, title: 'Amritsar Arrival & Wagah Border Ceremony', description: 'Check-in to hotel. Witness patriotic Beating Retreat ceremony at Wagah Border.' },
      { day: 2, title: 'Golden Temple, Partition Museum & Heritage Walk', description: 'Visit Golden Temple, Jallianwala Bagh memorial, and interactive Partition Museum.' },
      { day: 3, title: 'Drive to Palampur Tea Gardens & CSIR Agriculture Lab', description: 'Field trip to CSIR-IHBT agricultural research center & organic tea manufacturing plant.' },
      { day: 4, title: 'Student Team Building & Return Journey', description: 'Team building activities and certificates distribution before return.' }
    ],
    inclusions: ['45-Seater Deluxe AC Coach Transfers', '3 Nights Accommodation in 3-Star Student Hotels', 'All Meals (Breakfast, Lunch, Dinner)', 'Guided Educational Facilitators & Security Personnel', 'Industrial & Museum Entry Tickets'],
    exclusions: ['Personal shopping'],
    facilities: ['Educational Guide', 'AC Deluxe Bus', 'All Meals Included', 'Safety First Care'],
    category: 'Educational Journeys',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 31.6200, lng: 74.8765, address: 'Amritsar, Punjab' },
    rating: 4.92,
    reviewsCount: 140,
    bookingsCount: 520,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 6. PUNJAB HERITAGE - AMRITSAR & ANANDPUR SAHIB
  {
    _id: 'pkg_106',
    title: 'Royal Punjab Heritage, Golden Temple & Virasat-e-Khalsa',
    destination: 'Amritsar & Anandpur Sahib, Punjab',
    description: 'Immerse in Punjabi warmth and history. Experience sacred Golden Temple, community Langar service, Virasat-e-Khalsa museum, and authentic Haveli village dhaba food.',
    images: [
      'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=900&q=80'
    ],
    price: 4999,
    discountPrice: 3499,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 30,
    availableSeats: 16,
    startDates: [new Date(Date.now() + 5 * 86400000).toISOString()],
    meetingPoint: 'Amritsar Junction Railway Station',
    travelMode: 'AC Cab / Shared Traveller',
    itinerary: [
      { day: 1, title: 'Golden Temple Night Palki Sahib Ceremony', description: 'Check-in to hotel. Experience serene evening atmosphere and Palki Sahib procession at Golden Temple.' },
      { day: 2, title: 'Wagah Border & Sadda Pind Cultural Village', description: 'Visit Jallianwala Bagh, Wagah Border, and evening bhangra dance with Punjabi buffet at Sadda Pind.' },
      { day: 3, title: 'Anandpur Sahib & Virasat-e-Khalsa Museum', description: 'Tour the grand Virasat-e-Khalsa museum before departure.' }
    ],
    inclusions: ['2 Nights Hotel Stay in Amritsar', 'Daily Breakfast & Sadda Pind Cultural Dinner', 'All Transfers by AC Private Vehicle', 'Guided Heritage Walk'],
    exclusions: ['Train / Flight tickets'],
    facilities: ['Heritage Hotel', 'Cultural Buffet', 'Wagah Border Pass'],
    category: 'Cultural',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 31.6200, lng: 74.8765, address: 'Golden Temple, Amritsar' },
    rating: 4.89,
    reviewsCount: 230,
    bookingsCount: 610,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 7. BEACH - GOA
  {
    _id: 'pkg_002',
    title: 'Goa Sun, Sand & Coastal Beachside Backpacking',
    destination: 'North & South Goa Beaches',
    description: 'Experience the magical beaches of Goa. Relax on golden palm-lined shores, cruise the Mandovi river, and explore Latin quarters of Fontainhas.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80'
    ],
    price: 8999,
    discountPrice: 5999,
    durationDays: 4,
    durationNights: 3,
    totalSeats: 30,
    availableSeats: 16,
    startDates: [new Date(Date.now() + 7 * 86400000).toISOString()],
    meetingPoint: 'Thivim Railway Station / Mopa Airport Goa',
    travelMode: 'AC Coach / Scooty option',
    itinerary: [
      { day: 1, title: 'Arrival & Calangute Beach Sunset Walk', description: 'Arrive in Goa and check in to our beach resort near Candolim.' },
      { day: 2, title: 'North Goa Beaches & Fort Aguada', description: 'Visit Fort Aguada, Chapora Fort, and enjoy watersports at Baga Beach.' },
      { day: 3, title: 'Fontainhas Latin Quarter & Sunset River Cruise', description: 'Walk through colorful Portuguese heritage streets in Fontainhas and Mandovi river cruise.' },
      { day: 4, title: 'Anjuna Flea Market & Departure', description: 'Browse boho handicrafts at Anjuna Beach before drop-off.' }
    ],
    inclusions: ['3 Nights stay in Beach Resort with Pool', 'Daily Breakfast Buffet', 'Airport/Station Transfers', 'Mandovi River Sunset Cruise Pass'],
    exclusions: ['Watersports fees', 'Lunch & dinner'],
    facilities: ['Swimming Pool', 'Beach Access', 'Free WiFi', 'Tour Coordinator'],
    category: 'Beach',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 15.5527, lng: 73.7517, address: 'Candolim Beach, Goa' },
    rating: 4.88,
    reviewsCount: 240,
    bookingsCount: 680,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 8. HERITAGE / RAJASTHAN
  {
    _id: 'pkg_003',
    title: 'Jaipur, Jodhpur & Thar Desert Camel Safari Expedition',
    destination: 'Jaipur, Jodhpur & Jaisalmer, Rajasthan',
    description: 'Immerse in royal majesty. Tour Amber Fort palace, Mehrangarh Fort, Pink City bazaars, and spend a night camping under the stars in Thar Desert sand dunes.',
    images: [
      'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1562135014-47a44f52119e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603258844022-ad18ee1d68fa?auto=format&fit=crop&w=900&q=80'
    ],
    price: 14999,
    discountPrice: 9999,
    durationDays: 6,
    durationNights: 5,
    totalSeats: 25,
    availableSeats: 11,
    startDates: [new Date(Date.now() + 6 * 86400000).toISOString()],
    meetingPoint: 'Jaipur Junction Railway Station / Airport',
    travelMode: 'Private AC Sedan / Tempo Traveller',
    itinerary: [
      { day: 1, title: 'Pink City Arrival & Hawa Mahal', description: 'Check in to a heritage Haveli hotel. Visit Hawa Mahal and Johari Bazaar.' },
      { day: 2, title: 'Amber Fort & Nahargarh Sunset View', description: 'Explore grand Amber Fort and sunset over Jaipur from Nahargarh Fort.' },
      { day: 3, title: 'Drive to Blue City Jodhpur & Mehrangarh Fort', description: 'Visit towering Mehrangarh Fort and Jaswant Thada cenotaph.' },
      { day: 4, title: 'Jaisalmer & Thar Desert Camp', description: 'Evening camel safari on Sam Sand Dunes with traditional Kalbeliya folk dance & campfire.' },
      { day: 5, title: 'Jaisalmer Living Fort & Havelis', description: 'Explore golden sandstone Jaisalmer Fort.' },
      { day: 6, title: 'Departure from Jaisalmer/Jodhpur', description: 'Drop off at Railway Station / Airport.' }
    ],
    inclusions: ['2 Nights Heritage Haveli Stay in Jaipur', '1 Night Jodhpur Hotel', '2 Nights Luxury Desert Camp', 'All Breakfasts & 1 Royal Desert Dinner', 'Camel Safari & Dune Bashing'],
    exclusions: ['Monument entrance tickets', 'Personal shopping'],
    facilities: ['Heritage Stays', 'Desert Tents', 'Camel Safari', 'AC Transport'],
    category: 'Cultural',
    budgetCategory: 'Moderate',
    gpsLocation: { lat: 26.9124, lng: 75.7873, address: 'Amber Fort, Jaipur, Rajasthan' },
    rating: 4.92,
    reviewsCount: 185,
    bookingsCount: 510,
    status: 'approved',
    isAffordableDeal: true,
  },

  // 9. UTTARAKHAND / RAFTING
  {
    _id: 'pkg_005',
    title: 'Rishikesh River Rafting, Beach Camping & Ganga Aarti',
    destination: 'Rishikesh & Shivpuri, Uttarakhand',
    description: 'Conquer Grade III+ rapids on the holy Ganges, cliff jump from 25ft rocks, camp under starry skies, and witness the divine Triveni Ghat Ganga Aarti.',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80'
    ],
    price: 4499,
    discountPrice: 2999,
    durationDays: 3,
    durationNights: 2,
    totalSeats: 35,
    availableSeats: 22,
    startDates: [new Date(Date.now() + 4 * 86400000).toISOString()],
    meetingPoint: 'Haridwar Railway Station / Rishikesh ISBT',
    travelMode: 'Cab / Shared Traveller',
    itinerary: [
      { day: 1, title: 'Arrival & Triveni Ghat Aarti', description: 'Arrive at Shivpuri campsite. Evening visit to Triveni Ghat for sunset Maha Ganga Aarti.' },
      { day: 2, title: '16KM White Water Rafting & Cliff Jump', description: '16KM rafting expedition down rapids like Roller Coaster and Golf Course. Cliff jump into the Ganges.' },
      { day: 3, title: 'Neer Garh Waterfall Hike & Departure', description: 'Morning guided yoga by the river before check-out.' }
    ],
    inclusions: ['2 Nights Alpine Tents / AC Cottages', 'All 6 Meals', '16 KM Grade III+ Rafting with safety captain', 'Cliff jumping gear', 'Evening Bonfire & Music'],
    exclusions: ['Bungee jumping passes'],
    facilities: ['Riverside Camping', 'Swimming Pool on Camp', 'Bonfire & Music'],
    category: 'Adventure',
    budgetCategory: 'Budget',
    gpsLocation: { lat: 30.1352, lng: 78.3842, address: 'Shivpuri, Rishikesh' },
    rating: 4.91,
    reviewsCount: 280,
    bookingsCount: 740,
    status: 'approved',
    isAffordableDeal: true,
  }
];

export const mockHotels = [
  {
    _id: 'hotel_001',
    name: 'Zostel & Mountain View Resort Manali',
    description: 'A cozy mountain haven in Old Manali. Panoramic snow-peak views of Solang valley, pine orchards, warm wood interiors, fireplace cafe, and high-speed WiFi.',
    propertyType: 'Mountain Resort',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80'
    ],
    address: 'Old Manali Club House Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    landmark: 'Old Manali Bridge',
    location: { lat: 32.2432, lng: 77.1892 },
    amenities: ['Free High-Speed WiFi', 'Mountain View Cafe', 'Fireplace & Bonfire', 'Free Parking'],
    nearbyAttractions: [{ name: 'Hadimba Temple', distanceKm: 0.8 }, { name: 'Mall Road', distanceKm: 1.5 }],
    policies: { cancellationPolicy: 'Free Cancellation up to 24 hours before check-in', cancellationWindowHours: 24, breakfastIncluded: true, houseRules: ['Check-in: 12:00 PM'] },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1199,
    originalPrice: 1999,
    rating: 4.87,
    reviewsCount: 320,
    rooms: [
      { _id: 'room_001_a', name: 'Deluxe Snow-Peak View Balcony Room', type: 'Deluxe Private', price: 1899, discountPrice: 1399, capacity: 2, bedType: 'King Bed', amenities: ['Attached Balcony', 'WiFi'], available: 6 }
    ]
  },
  {
    _id: 'hotel_002',
    name: 'Candolim Beachside Palms Resort & Cottages',
    description: 'Affordable tropical resort just 200m from Candolim Beach shore. Lush coconut gardens, swimming pool, sun loungers, poolside cafe, and North Goa beach access.',
    propertyType: 'Beach Resort',
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80'
    ],
    address: 'Candolim Beach Road, North Goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    landmark: 'Near Candolim Football Ground',
    location: { lat: 15.5188, lng: 73.7629 },
    amenities: ['Swimming Pool', 'Free WiFi', 'Poolside Bar', 'Free Parking'],
    nearbyAttractions: [{ name: 'Candolim Beach', distanceKm: 0.2 }],
    policies: { cancellationPolicy: 'Free Cancellation up to 48 hours', cancellationWindowHours: 48, breakfastIncluded: true, houseRules: ['Check-in: 1:00 PM'] },
    status: 'approved',
    isFeatured: true,
    isBudgetFriendly: true,
    startingPrice: 1499,
    originalPrice: 2400,
    rating: 4.79,
    reviewsCount: 260,
    rooms: [
      { _id: 'room_002_a', name: 'Poolside Deluxe Room', type: 'Deluxe Room', price: 2299, discountPrice: 1799, capacity: 2, bedType: 'King Bed', amenities: ['Pool View', 'AC'], available: 5 }
    ]
  }
];

export const domesticDestinations = [
  { name: 'Himachal Pradesh', query: 'Himachal', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80', subText: 'Jibhi, Kasol, Spiti, Manali & Shimla', badge: 'Weekend & Treks' },
  { name: 'Rajasthan', query: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=700&q=80', subText: 'Jaipur, Jodhpur, Jaisalmer & Desert', badge: 'Royal Heritage' },
  { name: 'Punjab', query: 'Punjab', image: 'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=700&q=80', subText: 'Amritsar Golden Temple & Wagah Border', badge: 'Cultural & Food' },
  { name: 'Uttarakhand', query: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=700&q=80', subText: 'Rishikesh Rafting, Chakrata & Mussoorie', badge: 'Adventure & Yoga' },
  { name: 'Goa', query: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80', subText: 'Calangute, Anjuna & Latin Quarters', badge: 'Beach Getaways' },
  { name: 'Educational Journeys', query: 'Educational', image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=700&q=80', subText: 'Student Group Trips & Science Labs', badge: 'School / College Groups' },
];

export const mockPreviousTripGallery = [
  { id: 'spot_01', title: 'Serolsar Lake Snow Forest Trek', spot: 'Jalori Pass, Jibhi, HP', category: 'Himalayas', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', traveler: 'Rohit & Friends (Every Friday Group)', quote: 'Jibhi wooden homestay and snow trek to Serolsar lake was unreal!', rating: 5.0, likes: 450, date: 'January 2025' },
  { id: 'spot_02', title: 'Sunset over Sam Sand Dunes', spot: 'Jaisalmer, Rajasthan', category: 'Heritage', image: 'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80', traveler: 'Siddharth & Family', quote: 'Camel safari and cultural desert dance show under moonlight.', rating: 4.9, likes: 380, date: 'December 2024' },
  { id: 'spot_03', title: 'Golden Temple Evening Palki Sahib', spot: 'Amritsar, Punjab', category: 'Cultural', image: 'https://images.unsplash.com/photo-1588096344356-9b578f79f429?auto=format&fit=crop&w=800&q=80', traveler: 'Simran & College Group', quote: 'Langar experience and peaceful atmosphere at 10 PM.', rating: 5.0, likes: 510, date: 'February 2025' },
  { id: 'spot_04', title: '16KM White Water Rafting', spot: 'Shivpuri, Rishikesh', category: 'Adventure', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80', traveler: 'Amit & Corporate Team', quote: '25ft cliff jump into holy Ganges river. Best weekend reset!', rating: 4.95, likes: 390, date: 'November 2024' }
];

export const mockCustomerPastTrips = [
  {
    id: 'trip_001',
    packageTitle: 'Jibhi & Tirthan Valley Weekend Tour',
    destination: 'Jibhi, Himachal Pradesh',
    travelDates: '10 Jan 2025 - 13 Jan 2025',
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

export const mockCustomerBookings = [
  {
    _id: 'bk_101',
    bookingType: 'package',
    package: mockPackages[0], // Jibhi
    itemTitle: 'Jibhi & Tirthan Valley Weekend Tour (Every Friday Departure)',
    destination: 'Jibhi & Tirthan Valley, Himachal',
    image: mockPackages[0].images[0],
    bookingDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    startDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    guestsCount: 2,
    totalAmount: 11998,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'pay_ts_991238',
    primaryGuest: { name: 'Priya Sharma', email: 'customer@pctetravels.com', phone: '+91 98765 43210' }
  }
];

export const getStoredPackages = () => {
  const stored = localStorage.getItem('travelstay_packages_v5');
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem('travelstay_packages_v5', JSON.stringify(mockPackages));
  return mockPackages;
};

export const getStoredHotels = () => {
  const stored = localStorage.getItem('travelstay_hotels_v5');
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem('travelstay_hotels_v5', JSON.stringify(mockHotels));
  return mockHotels;
};

export const getStoredBookings = () => {
  const stored = localStorage.getItem('travelstay_bookings_v5');
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem('travelstay_bookings_v5', JSON.stringify(mockCustomerBookings));
  return mockCustomerBookings;
};

export const saveBooking = (newBooking) => {
  const bookings = getStoredBookings();
  const updated = [newBooking, ...bookings];
  localStorage.setItem('travelstay_bookings_v5', JSON.stringify(updated));
  return updated;
};

export const getStoredMemories = () => {
  const stored = localStorage.getItem('travelstay_memories_v5');
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  localStorage.setItem('travelstay_memories_v5', JSON.stringify(mockCustomerPastTrips));
  return mockCustomerPastTrips;
};

export const saveMemory = (newMemory) => {
  const memories = getStoredMemories();
  const updated = [newMemory, ...memories];
  localStorage.setItem('travelstay_memories_v5', JSON.stringify(updated));
  return updated;
};

export const getStoredWishlist = () => {
  const stored = localStorage.getItem('travelstay_wishlist_v5');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  const initial = [mockPackages[0], mockPackages[1]];
  localStorage.setItem('travelstay_wishlist_v5', JSON.stringify(initial));
  return initial;
};

export const toggleWishlistItem = (item) => {
  const list = getStoredWishlist();
  const exists = list.some(x => x._id === item._id);
  const updated = exists ? list.filter(x => x._id !== item._id) : [...list, item];
  localStorage.setItem('travelstay_wishlist_v5', JSON.stringify(updated));
  return updated;
};

