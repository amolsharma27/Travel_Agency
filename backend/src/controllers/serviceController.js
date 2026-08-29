import asyncHandler from 'express-async-handler';

export const defaultActivities = [
  {
    _id: 'act_01',
    title: '83-Meter Bungee Jumping Experience',
    category: 'Adventure Sports',
    location: 'Rishikesh, Uttarakhand',
    duration: '1.5 Hours',
    price: 3850,
    discountPrice: 3550,
    rating: 4.95,
    reviewsCount: 420,
    minAge: 12,
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    overview: "India's highest fixed-platform cantilever bungee jump at Mohan Chatti, Rishikesh. Built with technical safety master guidance from New Zealand jumpmasters.",
    safetyRating: '100% Certified Safety',
    slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM'],
    inclusions: ['Cantilever Jump with Safety Harness', 'Video Footage with 3 Camera Angles', 'Dare to Jump Certificate', 'Instructor Briefing'],
    requirements: ['Weight between 35 kg to 110 kg', 'No serious heart condition', 'Comfortable sports shoes'],
  },
  {
    _id: 'act_02',
    title: 'Solang Valley High Altitude Paragliding',
    category: 'Adventure Sports',
    location: 'Solang Valley, Manali (HP)',
    duration: '20-25 Mins Flight',
    price: 3200,
    discountPrice: 2800,
    rating: 4.92,
    reviewsCount: 380,
    minAge: 10,
    images: [
      'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Fly over snow-covered pine peaks and the Solang ski slopes with licensed tandem pilots.',
    safetyRating: 'Licensed Pilots',
    slots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'],
    inclusions: ['Tandem Paragliding Flight', 'Full HD Action Cam Video', 'Safety Helmet & Harness'],
    requirements: ['Weight 30 kg to 95 kg', 'Warm windproof jacket'],
  },
  {
    _id: 'act_03',
    title: 'Shivpuri Grade IV River Rafting (16 KM)',
    category: 'Water Sports',
    location: 'Rishikesh, Uttarakhand',
    duration: '3.5 Hours',
    price: 1800,
    discountPrice: 1450,
    rating: 4.88,
    reviewsCount: 650,
    minAge: 14,
    images: [
      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Navigate through legendary Ganga rapids: Roller Coaster, Golf Course, Clubhouse, and Cash Flow.',
    safetyRating: 'Grade IV Lifejackets',
    slots: ['07:30 AM', '10:30 AM', '01:30 PM'],
    inclusions: ['16 KM Rapid Descent', 'Cliff Jumping & Body Surfing', 'US Coast Guard Certified Lifejacket'],
    requirements: ['Ability to hold raft grip', 'No swimming requirement (lifejacket buoyant)'],
  },
  {
    _id: 'act_04',
    title: 'Triund Snow Ridge Trek & Overnight Camping',
    category: 'Trekking & Hiking',
    location: 'McLeod Ganj, Dharamshala (HP)',
    duration: '2 Days / 1 Night',
    price: 2499,
    discountPrice: 1999,
    rating: 4.9,
    reviewsCount: 290,
    minAge: 10,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Tranquil hike through rhododendron and oak forests up to Triund Ridge with panoramic views of the Dhauladhar range.',
    safetyRating: 'Mountain Guides',
    slots: ['08:30 AM Departure'],
    inclusions: ['Alpine Camping Tents', 'Sleeping Bags & Foam Mats', 'Campfire Dinner & Breakfast', 'Certified Trek Lead'],
    requirements: ['Moderate walking stamina', 'Sturdy walking shoes'],
  }
];

export const defaultTransportRoutes = {
  flights: [
    { id: 'fl_01', from: 'Delhi (DEL)', to: 'Srinagar (SXR)', airline: 'IndiGo', flightNo: '6E-2194', departure: '06:15 AM', arrival: '07:45 AM', duration: '1h 30m', price: 4850, stops: 'Non-stop', days: 'Daily' },
    { id: 'fl_02', from: 'Delhi (DEL)', to: 'Goa (GOI)', airline: 'Air India Express', flightNo: 'IX-1142', departure: '08:30 AM', arrival: '11:15 AM', duration: '2h 45m', price: 5400, stops: 'Non-stop', days: 'Daily' },
    { id: 'fl_03', from: 'Chandigarh (IXC)', to: 'Srinagar (SXR)', airline: 'IndiGo', flightNo: '6E-412', departure: '11:00 AM', arrival: '12:10 PM', duration: '1h 10m', price: 4200, stops: 'Non-stop', days: 'Tue, Thu, Sat' },
    { id: 'fl_04', from: 'Delhi (DEL)', to: 'Dharamshala (DHM)', airline: 'SpiceJet', flightNo: 'SG-2931', departure: '07:00 AM', arrival: '08:25 AM', duration: '1h 25m', price: 5100, stops: 'Non-stop', days: 'Daily' }
  ],
  trains: [
    { id: 'tr_01', trainNo: '12013', trainName: 'Amritsar Shatabdi Express', from: 'New Delhi (NDLS)', to: 'Amritsar (ASR)', dep: '16:30', arr: '22:45', duration: '6h 15m', classes: ['CC', 'EC'], runsOn: 'All Days', price: 1150 },
    { id: 'tr_02', trainNo: '22439', trainName: 'Vande Bharat Express (Katra)', from: 'New Delhi (NDLS)', to: 'Shri Mata Vaishno Devi (SVDK)', dep: '06:00', arr: '14:00', duration: '8h 00m', classes: ['CC', 'EC'], runsOn: 'Daily except Tue', price: 1630 },
    { id: 'tr_03', trainNo: '12011', trainName: 'Kalka Shatabdi Express', from: 'New Delhi (NDLS)', to: 'Chandigarh / Kalka', dep: '07:40', arr: '11:05', duration: '3h 25m', classes: ['CC', 'EC'], runsOn: 'All Days', price: 890 }
  ],
  buses: [
    { id: 'bs_01', operator: 'PCTE Volvo Lines', busType: 'AC Multi-Axle Volvo Semi-Sleeper (2+2)', from: 'Delhi ISBT (Majnu Ka Tila)', to: 'Manali Mall Road', dep: '20:30', arr: '09:00', duration: '12h 30m', rating: 4.9, price: 1199, amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Live GPS Tracking'] },
    { id: 'bs_02', operator: 'PCTE Volvo Lines', busType: 'AC Volvo Pushback (2+2)', from: 'Chandigarh (Tribune Chowk)', to: 'Dharamshala / McLeod Ganj', dep: '22:00', arr: '05:30', duration: '7h 30m', rating: 4.85, price: 850, amenities: ['Reclining Seats', 'Blanket', 'Charging Point'] },
    { id: 'bs_03', operator: 'Himalayan Luxury Coach', busType: 'AC BharatBenz Sleeper (2+1)', from: 'Ludhiana (Bus Stand)', to: 'Delhi Airport (IGI T3)', dep: '23:30', arr: '05:00', duration: '5h 30m', rating: 4.95, price: 799, amenities: ['Individual Curtains', 'Charging Port', 'AC Comfort'] }
  ],
  cabs: [
    { id: 'cb_01', type: 'Sedan (Swift Dzire / Etios)', seats: '4 Passengers + 2 Bags', ratePerKm: '₹12/km', outstationBase: '₹3,200 / day', inclusions: ['AC Cab', 'Experienced Hill Driver', 'Fuel & Toll Guidance'] },
    { id: 'cb_02', type: 'SUV (Toyota Innova Crysta / Ertiga)', seats: '6-7 Passengers + 4 Bags', ratePerKm: '₹18/km', outstationBase: '₹4,800 / day', inclusions: ['Premium Captain Seats', 'Spacious Legroom', 'Experienced Mountain Chauffeur'] },
    { id: 'cb_03', type: 'Force Urbania / Tempo Traveller (12/17 Seater)', seats: '12-17 Passengers', ratePerKm: '₹26/km', outstationBase: '₹7,500 / day', inclusions: ['Pushback Recliners', 'High Roof', 'Stereo Music System', 'Luggage Carrier'] }
  ]
};

export const defaultGetaways = [
  {
    id: 'gw_01',
    destination: 'Kasauli & Barog',
    state: 'Himachal Pradesh',
    distanceFromOrigin: '125 km (approx 2.5 hrs)',
    tripDurationType: '1-Day Trips & 2-Day Weekend',
    idealFor: 'Couple Getaways, Peaceful Relaxing',
    tagline: 'Quiet pine forest walks, British colonial church, and Gilbert nature trail.',
    highlights: ['Gilbert Trail Pine Walk', 'Christ Church heritage', 'Sunset Point overlooking Punjab plains'],
    bestTimeToVisit: 'Throughout the year (Pleasant Summers & Cozy Winters)',
    startingBudget: '₹2,499 per person',
    travelMode: 'Private Cab or Self-Drive Highway via Himalayan Expressway',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gw_02',
    destination: 'Chail & Kufri',
    state: 'Himachal Pradesh',
    distanceFromOrigin: '175 km (approx 4.5 hrs)',
    tripDurationType: '2-Day Trips',
    idealFor: 'Families & Friends Trips',
    tagline: 'World highest cricket ground, cedar deodar forests, and heritage Chail Palace.',
    highlights: ['Chail Palace Garden', 'Himalayan Wildlife Nature Park', 'Panoramic snow views of Choor Chandni peak'],
    bestTimeToVisit: 'March to June & Dec to Feb (Snowfall)',
    startingBudget: '₹3,200 per person',
    travelMode: 'AC Coach or Sedan Cab via Kandaghat bypass',
    image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gw_03',
    destination: 'Rishikesh & Shivpuri',
    state: 'Uttarakhand',
    distanceFromOrigin: '245 km (approx 5.5 hrs)',
    tripDurationType: '3-Day Trips & Adventure Getaways',
    idealFor: 'Friends Groups, Adventure Enthusiasts',
    tagline: 'White water Ganga rafting, bungee jumping, and cliff camping.',
    highlights: ['Grade IV 16km Rafting', 'Evening Ganga Aarti at Triveni Ghat', 'Riverside camp stay with bonfire'],
    bestTimeToVisit: 'September to June',
    startingBudget: '₹4,499 per person',
    travelMode: 'Overnight Volvo Coach or Train to Haridwar/Rishikesh',
    image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gw_04',
    destination: 'Amritsar Golden Heritage',
    state: 'Punjab',
    distanceFromOrigin: '140 km (approx 2 hrs via GT Road NH44)',
    tripDurationType: '1-Day Trips & 2-Day Trips',
    idealFor: 'Spiritual, Food Lovers, Cultural',
    tagline: 'Sri Harmandir Sahib, Wagah Border retreat parade, and legendary Amritsari kulchas.',
    highlights: ['Golden Temple midnight Palki Sahib seva', 'Wagah Border Beating Retreat VIP view', 'Heritage street food walk'],
    bestTimeToVisit: 'October to March',
    startingBudget: '₹1,999 per person',
    travelMode: 'Shatabdi Express / AC Volvo Highway Bus / Car',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
  }
];

// @desc  Get activities list
// @route GET /api/activities
// @access Public
export const getActivities = asyncHandler(async (req, res) => {
  const { category, q, maxPrice } = req.query;
  let list = [...defaultActivities];

  if (category && category !== 'All') {
    list = list.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (q) {
    const query = q.toLowerCase();
    list = list.filter(a => a.title.toLowerCase().includes(query) || a.location.toLowerCase().includes(query));
  }
  if (maxPrice) {
    list = list.filter(a => (a.discountPrice || a.price) <= Number(maxPrice));
  }

  res.json({ success: true, count: list.length, data: list });
});

// @desc  Get single activity
// @route GET /api/activities/:id
// @access Public
export const getActivityById = asyncHandler(async (req, res) => {
  const activity = defaultActivities.find(a => a._id === req.params.id) || defaultActivities[0];
  res.json({ success: true, data: activity });
});

// @desc  Get transport schedules
// @route GET /api/transportation
// @access Public
export const getTransportation = asyncHandler(async (req, res) => {
  res.json({ success: true, data: defaultTransportRoutes });
});

// @desc  Get nearby getaways
// @route GET /api/getaways
// @access Public
export const getGetaways = asyncHandler(async (req, res) => {
  res.json({ success: true, count: defaultGetaways.length, data: defaultGetaways });
});
