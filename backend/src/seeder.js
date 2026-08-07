import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Package from './models/Package.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';

dotenv.config();
await connectDB();

const run = async () => {
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Package.deleteMany({}),
    Hotel.deleteMany({}),
    Room.deleteMany({}),
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'TravelStay Admin',
    email: 'admin@travelstay.com',
    password: 'Admin@123',
    role: 'admin',
  });

  const agency = await User.create({
    name: 'Wanderlust Holidays',
    email: 'agency@travelstay.com',
    password: 'Agency@123',
    role: 'agency',
    agencyName: 'Wanderlust Holidays',
    agencyDescription: 'Premium tours, honeymoon escapes, and luxury hotel packages across India since 2012. Recipient of National Travel Excellence Award.',
    agencyStatus: 'approved',
  });

  const customer = await User.create({
    name: 'Priya Sharma',
    email: 'customer@travelstay.com',
    password: 'Customer@123',
    role: 'customer',
  });

  console.log('Creating tour packages...');
  const packages = await Package.create([
    {
      agency: agency._id,
      title: 'Magical Manali & Solang Getaway',
      destination: 'Manali, Himachal Pradesh',
      description: 'A 5-day escape through snow-capped peaks, riverside cafes, and adventure sports in Manali and Solang Valley.',
      images: [
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80'
      ],
      price: 14999,
      discountPrice: 12999,
      durationDays: 5,
      durationNights: 4,
      totalSeats: 20,
      availableSeats: 20,
      startDates: [new Date(Date.now() + 15 * 86400000), new Date(Date.now() + 30 * 86400000)],
      meetingPoint: 'Delhi ISBT Kashmiri Gate',
      travelMode: 'Bus',
      itinerary: [
        { day: 1, title: 'Delhi to Manali Overnight Volvo Journey', description: 'Depart from Delhi in the evening. Enjoy a comfortable overnight Volvo bus journey through the picturesque hills.' },
        { day: 2, title: 'Manali Arrival & Local Sightseeing', description: 'Arrive and check in to hotel. Afternoon visit to Hadimba Temple, Club House, Vashisht Hot Springs, and shopping on Mall Road.' },
        { day: 3, title: 'Solang Valley Adventure Day', description: 'Drive to Solang Valley. Indulge in exciting adventure sports like paragliding, zorbing, and amateur skiing.' },
        { day: 4, title: 'Excursion to Jogini Waterfall & Old Manali', description: 'Short trek to the beautiful Jogini Waterfalls followed by a lazy lunch exploring the cafes in Old Manali.' },
        { day: 5, title: 'Return Journey to Delhi', description: 'Check out in the morning, buy souvenirs, and board the evening Volvo back to Delhi.' }
      ],
      inclusions: ['Semi-Sleeper AC Volvo transfers', '4 Nights in Deluxe Room', 'Daily Breakfast & Dinner', 'Local sightseeing by private cab'],
      exclusions: ['Adventure activities charges', 'Lunch & personal expenses', 'Airfare/Train ticket to Delhi'],
      facilities: ['AC Coach', 'First-aid kit', 'Dedicated Tour Coordinator'],
      category: 'Adventure',
      gpsLocation: { lat: 32.2432, lng: 77.1892, address: 'Manali, HP' },
      rating: 4.8,
      reviewsCount: 34,
      bookingsCount: 156,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Goa Beach Holiday Bliss',
      destination: 'Goa',
      description: 'Sun, sand, and seafood — 4 days of beach hopping, water sports, and vibrant nightlife in North and South Goa.',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
      ],
      price: 19999,
      discountPrice: 16999,
      durationDays: 4,
      durationNights: 3,
      totalSeats: 30,
      availableSeats: 30,
      startDates: [new Date(Date.now() + 10 * 86400000), new Date(Date.now() + 24 * 86400000)],
      meetingPoint: 'Mopa Goa Airport / Madgaon Station',
      travelMode: 'Flight',
      itinerary: [
        { day: 1, title: 'Arrival & North Goa Beach Sunset', description: 'Pick up and check in to beach resort. Spend evening relaxing at Baga Beach and enjoying sunset.' },
        { day: 2, title: 'North Goa Sightseeing & Water Sports', description: 'Visit Calangute beach, Anjuna Beach, and Vagator. Enjoy parasailing and jet-skiing (optional).' },
        { day: 3, title: 'South Goa Heritage Tour & Cruise', description: 'Visit Basilica of Bom Jesus, Mangueshi Temple, and enjoy an evening Mandovi River Cruise.' },
        { day: 4, title: 'Departure with memories', description: 'Check out from hotel, pick up local cashew nuts and feni, and transfer to airport/station.' }
      ],
      inclusions: ['3 Nights stay in Beach Resort', 'Airport/Station transfers', 'Daily Buffet Breakfast', 'Half-day South Goa sightseeing', 'Mandovi river cruise tickets'],
      exclusions: ['Flight fares', 'Lunch & dinners', 'Watersports charges'],
      facilities: ['Beachside Hotel', 'Rooftop Swimming Pool', 'Welcome Drink'],
      category: 'Beach',
      gpsLocation: { lat: 15.5527, lng: 73.7517, address: 'Candolim, Goa' },
      rating: 4.6,
      reviewsCount: 42,
      bookingsCount: 220,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Kerala Backwaters & Tea Gardens',
      destination: 'Munnar & Alleppey, Kerala',
      description: 'Experience God’s Own Country with mist-clad hills of Munnar and the iconic houseboat cruises in Alleppey.',
      images: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1545638191-1dfb006517a8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
      ],
      price: 24999,
      discountPrice: 21999,
      durationDays: 6,
      durationNights: 5,
      totalSeats: 15,
      availableSeats: 15,
      startDates: [new Date(Date.now() + 20 * 86400000)],
      meetingPoint: 'Kochi International Airport',
      travelMode: 'Flight',
      itinerary: [
        { day: 1, title: 'Arrival in Kochi & Drive to Munnar', description: 'Pickup from Kochi Airport. Scenic 4-hour drive to Munnar passing Valara and Cheeyappara waterfalls.' },
        { day: 2, title: 'Munnar Tea Gardens Exploration', description: 'Visit Mattupetty Dam, Echo Point, Kundala Lake, Eravikulam National Park to spot Nilgiri Tahr, and Tea Museum.' },
        { day: 3, title: 'Drive to Thekkady Wild Life Sanctuary', description: 'Scenic drive to Thekkady. Take a spice plantation tour and enjoy an evening martial arts (Kalaripayattu) show.' },
        { day: 4, title: 'Alleppey Houseboat Check-in', description: 'Drive to Alleppey. Board your private traditional houseboat and cruise past canals and coconut groves. Overnight on board.' },
        { day: 5, title: 'Houseboat Cruise & Kochi City Tour', description: 'Disembark and travel back to Kochi. Tour Fort Kochi, Chinese Fishing Nets, and Jewish Synagogue.' },
        { day: 6, title: 'Departure', description: 'Check out and transfer to airport/station for departure.' }
      ],
      inclusions: ['1 Night Luxury Houseboat (All meals included)', '3 Nights Munnar Resort & 1 Night Kochi Hotel', 'All transfers by private Sedan cab', 'Spice plantation tour entry'],
      exclusions: ['Elephant safari fees', 'Personal laundry & shopping', 'GST 5%'],
      facilities: ['Private Houseboat', 'Local driver cum guide', 'Spice Plantation tour'],
      category: 'Honeymoon',
      gpsLocation: { lat: 10.0125, lng: 76.3262, address: 'Kochi, Kerala' },
      rating: 4.9,
      reviewsCount: 56,
      bookingsCount: 180,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Srinagar & Kashmir Valley Paradise',
      destination: 'Srinagar, Jammu & Kashmir',
      description: 'A breathtakingly beautiful tour of Srinagar, Gulmarg, and Pahalgam. Live in houseboats and ride shikaras on Dal Lake.',
      images: [
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589136777351-fdc9c9400c7e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80'
      ],
      price: 29999,
      discountPrice: 25999,
      durationDays: 6,
      durationNights: 5,
      totalSeats: 16,
      availableSeats: 16,
      startDates: [new Date(Date.now() + 18 * 86400000)],
      meetingPoint: 'Srinagar International Airport',
      travelMode: 'Flight',
      itinerary: [
        { day: 1, title: 'Arrival & Luxury Houseboat Check-in', description: 'Arrive at Srinagar airport. Enjoy check-in to a traditional carved wood houseboat. Evening Shikara ride.' },
        { day: 2, title: 'Mughal Gardens Tour', description: 'Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi gardens. Take photographs in traditional Kashmiri attire.' },
        { day: 3, title: 'Excursion to Gulmarg Meadow of Flowers', description: 'Day trip to Gulmarg. Take the world-famous Gondola cable car ride (Phase 1 & 2) up into the snow clouds.' },
        { day: 4, title: 'Srinagar to Pahalgam Valley of Shepherds', description: 'Drive to Pahalgam. En route visit saffron fields and Avantipura ruins. Check in at resort.' },
        { day: 5, title: 'Betaab Valley & Aru Valley Tour', description: 'Explore scenic Betaab Valley and Aru Valley in local union cabs. Enjoy pony rides alongside Lidder river.' },
        { day: 6, title: 'Departure from Srinagar', description: 'Drive back to Srinagar airport for departure flight.' }
      ],
      inclusions: ['1 Night Deluxe Houseboat (Dal Lake)', '4 Nights 4-Star Resort stays', 'Daily Breakfast & Dinner', '1-Hour Dal Lake Shikara ride', 'Private Innova for all transfers'],
      exclusions: ['Gondola ride tickets', 'Local union cab charges in Pahalgam', 'Pony/Horse ride fees'],
      facilities: ['Heated rooms', 'Local Kashmiri tour guide', 'Airport Meet & Greet'],
      category: 'Honeymoon',
      gpsLocation: { lat: 34.0837, lng: 74.7973, address: 'Dal Lake, Srinagar' },
      rating: 4.95,
      reviewsCount: 78,
      bookingsCount: 290,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Ladakh Motorbike & Lake Adventure',
      destination: 'Leh Ladakh',
      description: 'Ride across the highest motorable passes, discover ancient monasteries, and sleep by the pristine blue Pangong Tso Lake.',
      images: [
        'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80'
      ],
      price: 34999,
      discountPrice: 29999,
      durationDays: 7,
      durationNights: 6,
      totalSeats: 12,
      availableSeats: 12,
      startDates: [new Date(Date.now() + 25 * 86400000)],
      meetingPoint: 'Leh Airport',
      travelMode: 'Mixed',
      itinerary: [
        { day: 1, title: 'Leh Arrival & Acclimatization Day', description: 'Arrive at Leh airport. Rest completely for the day to adapt to high altitude (3,500m). Afternoon stroll on Leh Market.' },
        { day: 2, title: 'Sham Valley Sightseeing', description: 'Visit Sangam (Confluence of Indus & Zanskar), Magnetic Hill, Gurudwara Pathar Sahib, and Hall of Fame.' },
        { day: 3, title: 'Leh to Nubra Valley via Khardung La', description: 'Cross Khardung La (5,359m), the world-famous pass. Reach Nubra Valley, check-in to camps, ride double-humped camels on sand dunes.' },
        { day: 4, title: 'Nubra Valley to Pangong Lake', description: 'Drive via Shyok river road directly to Pangong Tso Lake (4,250m). Stay overnight in lakeside cottage camps.' },
        { day: 5, title: 'Pangong Tso to Leh via Chang La', description: 'Wake up to a freezing sunrise over Pangong. Drive back to Leh crossing the high Chang La pass.' },
        { day: 6, title: 'Monasteries & Leh Palace Tour', description: 'Visit Thiksey Monastery, Hemis Monastery, and explore Leh Palace.' },
        { day: 7, title: 'Departure', description: 'Transfer to Leh Airport in the morning.' }
      ],
      inclusions: ['Royal Enfield bikes (350/500cc) with fuel', '6 Nights twin-share camp/hotel stay', 'Daily Breakfast & Dinner', 'Backup vehicle with mechanic & spare parts', 'Inner Line Permits'],
      exclusions: ['Airfare to Leh', 'Camel ride charges', 'Travel Insurance & personal medical expenses'],
      facilities: ['RE Bikes provided', 'Oxygen cylinder in backup vehicle', 'Professional Road Captain'],
      category: 'Adventure',
      gpsLocation: { lat: 34.1526, lng: 77.5771, address: 'Leh, Ladakh' },
      rating: 4.85,
      reviewsCount: 29,
      bookingsCount: 95,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Royal Rajasthan Palace Heritage Tour',
      destination: 'Jaipur & Udaipur, Rajasthan',
      description: 'Immerse yourself in history. Travel like royalty through palace museums, forts, and sparkling lakes in Jaipur and Udaipur.',
      images: [
        'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562135014-47a44f52119e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1603258844022-ad18ee1d68fa?auto=format&fit=crop&w=800&q=80'
      ],
      price: 18999,
      discountPrice: 15999,
      durationDays: 5,
      durationNights: 4,
      totalSeats: 25,
      availableSeats: 25,
      startDates: [new Date(Date.now() + 22 * 86400000)],
      meetingPoint: 'Jaipur Railway Station / Airport',
      travelMode: 'Train',
      itinerary: [
        { day: 1, title: 'Welcome to Pink City Jaipur', description: 'Transfer to heritage hotel. Visit Chokhi Dhani ethnic resort in the evening for traditional Rajasthani dinner.' },
        { day: 2, title: 'Jaipur Forts & Hawa Mahal Tour', description: 'Explore majestic Amber Fort with elephant/jeep ride. Visit City Palace, Jantar Mantar, and take photos outside Hawa Mahal.' },
        { day: 3, title: 'Jaipur to Udaipur (The City of Lakes)', description: 'Board morning express train or private transfer to Udaipur. Check in. Rest or enjoy evening walking around Lake Pichola.' },
        { day: 4, title: 'Udaipur City Palace & Lake Cruise', description: 'Visit City Palace complex, Saheliyon-ki-Bari gardens, Jagdish temple, and take a sunset boat cruise on Lake Pichola.' },
        { day: 5, title: 'Udaipur Departure', description: 'Shopping at local markets (handicrafts & puppets) and transfer to airport/station.' }
      ],
      inclusions: ['Heritage Hotel stays (4 nights)', 'Jaipur to Udaipur Train Ticket (AC Chair Car)', 'Daily buffet breakfast', 'Private AC Sedan cab for local tours', 'Traditional Chokhi Dhani dinner buffet'],
      exclusions: ['Historical monument entry fees', 'Guide charges', 'Camera/Video fees at palaces'],
      facilities: ['Heritage stays', 'Private city cab', 'Chokhi Dhani dinner'],
      category: 'Cultural',
      gpsLocation: { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
      rating: 4.7,
      reviewsCount: 38,
      bookingsCount: 140,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Exotic Andaman Islands Getaway',
      destination: 'Havelock Island, Andaman',
      description: 'Swim in the clearest turquoise waters, walk on white sandy Radhanagar beach, and try scuba diving in the Andamans.',
      images: [
        'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      ],
      price: 32999,
      discountPrice: 28999,
      durationDays: 5,
      durationNights: 4,
      totalSeats: 18,
      availableSeats: 18,
      startDates: [new Date(Date.now() + 14 * 86400000)],
      meetingPoint: 'Port Blair Airport',
      travelMode: 'Flight',
      itinerary: [
        { day: 1, title: 'Port Blair Arrival & Cellular Jail Tour', description: 'Arrive in Port Blair, transfer to hotel. Visit historic Cellular Jail and watch the evening Light & Sound Show.' },
        { day: 2, title: 'Cruise to Havelock Island & Radhanagar Beach', description: 'Board the morning luxury ferry (Makruzz) to Havelock Island. Visit Radhanagar beach (voted Asia’s best beach) for sunset.' },
        { day: 3, title: 'Elephant Beach Boat & Snorkeling Excursion', description: 'Take a speed boat to Elephant Beach. Indulge in complimentary snorkeling, coral viewing, and sea walking.' },
        { day: 4, title: 'Ferry to Neil Island & Natural Bridge', description: 'Take private ferry to Neil Island. Visit Laxmanpur beach, Bharatpur Beach, and the Natural Howrah Bridge rock formation.' },
        { day: 5, title: 'Return to Port Blair & Departure', description: 'Take morning ferry back to Port Blair and head to the airport for flight home.' }
      ],
      inclusions: ['Ferry tickets (Makruzz / Nautika)', '4 Nights in Beach Resorts', 'Daily Breakfast', 'All airport/ferry transfers in private cabs', 'Cellular jail entry & light show tickets'],
      exclusions: ['Scuba diving/Water activity charges', 'Flights to Port Blair', 'Lunch & dinner meals'],
      facilities: ['Beach Resorts', 'Cruise tickets included', 'Water sports team'],
      category: 'Beach',
      gpsLocation: { lat: 11.9761, lng: 92.9876, address: 'Havelock, Andaman' },
      rating: 4.88,
      reviewsCount: 31,
      bookingsCount: 88,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Rishikesh Spiritual & River Rafting',
      destination: 'Rishikesh, Uttarakhand',
      description: 'Rejuvenate in the foothills of Himalayas. Perfect blend of Ganga Aarti, yoga ashrams, and thrilling white-water rafting.',
      images: [
        'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
      ],
      price: 8999,
      discountPrice: 7499,
      durationDays: 3,
      durationNights: 2,
      totalSeats: 40,
      availableSeats: 40,
      startDates: [new Date(Date.now() + 8 * 86400000), new Date(Date.now() + 20 * 86400000)],
      meetingPoint: 'Dehradun Airport / Haridwar Station',
      travelMode: 'Cab',
      itinerary: [
        { day: 1, title: 'Rishikesh Arrival & Ganga Aarti', description: 'Arrive at hotel/camp. Visit Laxman Jhula, Ram Jhula, and experience the divine evening Ganga Aarti at Triveni Ghat.' },
        { day: 2, title: 'White Water Rafting & Cliff Jumping', description: 'Drive to Shivpuri. Embark on a thrilling 16km rafting down the Ganges including body surfing and cliff jumping. Evening bonfire.' },
        { day: 3, title: 'Yoga Session & Departure', description: 'Early morning meditation and yoga session. Check out and transfer back.' }
      ],
      inclusions: ['2 Nights Camp stay with Bonfire', 'All meals included (Buffet style)', '16km River Rafting adventure with expert gear', 'Cliff jumping & body surfing fees'],
      exclusions: ['Travel to Haridwar/Dehradun', 'Bungee jumping charges (can be booked extra)', 'Personal guide costs'],
      facilities: ['Adventure Campsite', 'Expert Rafting Instructors', 'Riverfront bonfire'],
      category: 'Pilgrimage',
      gpsLocation: { lat: 30.0869, lng: 78.2676, address: 'Rishikesh, UK' },
      rating: 4.65,
      reviewsCount: 65,
      bookingsCount: 310,
      status: 'approved',
    },
    {
      agency: agency._id,
      title: 'Golden Triangle & Taj Mahal Tour',
      destination: 'Delhi, Agra & Jaipur',
      description: 'Explore the heart of India. Travel through history, visiting the Taj Mahal in Agra, Red Fort in Delhi, and palaces of Jaipur.',
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1547983699-a25b21fd16d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80'
      ],
      price: 12999,
      discountPrice: 10999,
      durationDays: 4,
      durationNights: 3,
      totalSeats: 30,
      availableSeats: 30,
      startDates: [new Date(Date.now() + 12 * 86400000)],
      meetingPoint: 'Delhi Airport / Hotels',
      travelMode: 'Cab',
      itinerary: [
        { day: 1, title: 'Delhi Sightseeing & Drive to Agra', description: 'Visit Qutub Minar, India Gate, and President House. Drive via Yamuna Expressway to Agra. Check-in.' },
        { day: 2, title: 'Taj Mahal at Sunrise & Agra Fort', description: 'Early morning visit to Taj Mahal. Visit historic Agra Fort and then drive to Jaipur, visiting Fatehpur Sikri en route.' },
        { day: 3, title: 'Pink City Jaipur Royal Tour', description: 'Visit Amber Fort, City Palace, Hawa Mahal, and explore Rajasthani handicraft markets.' },
        { day: 4, title: 'Return to Delhi / Departure', description: 'Drive back to Delhi for drop-off at Airport or hotel.' }
      ],
      inclusions: ['3 Nights stay in 4-star hotels', 'Private AC Sedan cab for the entire 4-day tour', 'Daily Buffet Breakfast', 'Toll taxes, parking & fuel charges'],
      exclusions: ['Monument entry fees', 'Guide tips', 'Lunch & dinners'],
      facilities: ['Private Cab', 'Taj Mahal View Hotel', 'Professional Driver'],
      category: 'Historical',
      gpsLocation: { lat: 27.1751, lng: 78.0421, address: 'Agra, UP' },
      rating: 4.8,
      reviewsCount: 52,
      bookingsCount: 200,
      status: 'approved',
    }
  ]);

  console.log('Creating hotels...');
  const hotelsData = [
    {
      owner: agency._id,
      name: 'Taj Lake Palace',
      description: 'Float in luxury. Set in the middle of Lake Pichola, this majestic heritage hotel features royal carvings, spa therapies, and gourmet dining.',
      propertyType: 'Resort',
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Pichola Lake Island',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      landmark: 'Lake Pichola',
      location: { lat: 24.5755, lng: 73.6798 },
      amenities: ['Free WiFi', 'Swimming Pool', 'Luxury Spa', 'Rooftop Restaurant', 'Butler Service', 'Fitness Center'],
      nearbyAttractions: [{ name: 'City Palace Udaipur', distanceKm: 0.2 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 48,
        breakfastIncluded: true,
        houseRules: ['Valet parking available', 'Smart casual wear at restaurants'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 19999,
      rating: 4.95,
      reviewsCount: 88
    },
    {
      owner: agency._id,
      name: 'Kumarakom Lake Resort',
      description: 'Nestled by the Vembanad Lake, this award-winning luxury resort offers traditional Keralite villas, heritage styling, and private pool accesses.',
      propertyType: 'Resort',
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Vembanad Lake Shore',
      city: 'Kumarakom',
      state: 'Kerala',
      country: 'India',
      landmark: 'Kumarakom Bird Sanctuary',
      location: { lat: 9.5915, lng: 76.4223 },
      amenities: ['Free WiFi', 'Infinity Pool', 'Ayurveda Spa', 'Lakefront Dining', 'Boating Activities'],
      nearbyAttractions: [{ name: 'Bird Sanctuary', distanceKm: 1.5 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['Check-in at reception', 'Pets not allowed'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 12499,
      rating: 4.9,
      reviewsCount: 65
    },
    {
      owner: agency._id,
      name: 'Whispering Palms Beach Resort',
      description: 'Step directly onto the sand. A beautiful 4-star beachfront resort in Candolim offering spacious rooms, pools, live music, and seafood grill.',
      propertyType: 'Hotel',
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Sinquerim Beach Road',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      landmark: 'Fort Aguada',
      location: { lat: 15.5011, lng: 73.7632 },
      amenities: ['Free WiFi', 'Swimming Pool', 'Bar', 'Gym', 'Games Room', 'Spa'],
      nearbyAttractions: [{ name: 'Aguada Fort', distanceKm: 1.0 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['Proper swimwear required in pool', 'Quiet hours after 10 PM'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 5999,
      rating: 4.5,
      reviewsCount: 110
    },
    {
      owner: agency._id,
      name: 'Snow Valley Resorts',
      description: 'Surrounded by pine forests, Snow Valley is the largest resort in Log Huts area Manali, offering stunning valley views and central heating.',
      propertyType: 'Resort',
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Log Huts Area',
      city: 'Manali',
      state: 'Himachal Pradesh',
      country: 'India',
      landmark: 'Hadimba Temple',
      location: { lat: 32.2533, lng: 77.1812 },
      amenities: ['Free WiFi', 'In-house Restaurant', 'Central Heating', 'Garden lawns', 'Kid play zone'],
      nearbyAttractions: [{ name: 'Hadimba Temple', distanceKm: 0.4 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['ID proof required', 'Heated blankets provided'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 4200,
      rating: 4.6,
      reviewsCount: 134
    },
    {
      owner: agency._id,
      name: 'The Khyber Himalayan Resort',
      description: 'Luxury under the snow. Nestled in Gulmarg pines, this premier 5-star mountain resort offers skiing, a heated indoor pool, and dramatic Peak views.',
      propertyType: 'Resort',
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Khyber Pine Forest Range',
      city: 'Gulmarg',
      state: 'Jammu & Kashmir',
      country: 'India',
      landmark: 'Gulmarg Gondola',
      location: { lat: 34.0487, lng: 74.3812 },
      amenities: ['Free WiFi', 'Heated Indoor Pool', 'Skiing Concierge', 'Luxury Lounge', 'Steam & Sauna'],
      nearbyAttractions: [{ name: 'Gulmarg Gondola base', distanceKm: 0.1 }],
      policies: {
        cancellationPolicy: 'Partial Refund',
        cancellationWindowHours: 72,
        breakfastIncluded: true,
        houseRules: ['Strict winter clothing required', 'Alcohol service restricted in lounge'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 15500,
      rating: 4.97,
      reviewsCount: 74
    },
    {
      owner: agency._id,
      name: 'Havelock Island Beach Resort',
      description: 'Indulge in a premium island lifestyle with pristine private beach access, poolside cocktail bars, and professional PADI scuba services.',
      propertyType: 'Resort',
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Govind Nagar Beach No. 2',
      city: 'Havelock',
      state: 'Andaman',
      country: 'India',
      landmark: 'Havelock Jetty',
      location: { lat: 11.9897, lng: 92.9803 },
      amenities: ['Free WiFi', 'Private Beach', 'PADI Dive Center', 'Swimming Pool', 'Seafood Restaurant'],
      nearbyAttractions: [{ name: 'Radhanagar Beach', distanceKm: 6.5 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['Check-out at 10 AM', 'Scuba needs medical fit certificate'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 8499,
      rating: 4.7,
      reviewsCount: 46
    },
    {
      owner: agency._id,
      name: 'The Grand Dragon Ladakh',
      description: 'The premier luxury eco-hotel in Ladakh, blending traditional Tibetan architecture with modern underfloor central heating and valley views.',
      propertyType: 'Hotel',
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Old Road, Sheynam',
      city: 'Leh',
      state: 'Ladakh',
      country: 'India',
      landmark: 'Leh Market',
      location: { lat: 34.1565, lng: 77.5812 },
      amenities: ['Free WiFi', 'Oxygen Lounge', 'Underfloor Heating', 'Garden Restaurant', 'Travel Desk'],
      nearbyAttractions: [{ name: 'Leh Palace', distanceKm: 1.2 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['Oxygen cylinders available 24/7', 'Smoke-free hotel premises'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 7999,
      rating: 4.82,
      reviewsCount: 55
    },
    {
      owner: agency._id,
      name: 'The Azure Grand',
      description: 'A premium MERN-verified property offering skyline views, a swimming pool, and easy access to Punjab’s major markets.',
      propertyType: 'Hotel',
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'MG Road, Sector 14',
      city: 'Ludhiana',
      state: 'Punjab',
      country: 'India',
      landmark: 'Near City Center Mall',
      location: { lat: 30.901, lng: 75.8573 },
      amenities: ['Free WiFi', 'Swimming Pool', 'Gym', 'Parking', 'Spa', 'Restaurant'],
      nearbyAttractions: [{ name: 'City Center Mall', distanceKm: 0.5 }],
      policies: {
        cancellationPolicy: 'Free Cancellation',
        cancellationWindowHours: 24,
        breakfastIncluded: true,
        houseRules: ['No smoking in rooms', 'Valid ID required at check-in'],
      },
      status: 'approved',
      isFeatured: true,
      startingPrice: 3499,
      rating: 4.4,
      reviewsCount: 22
    }
  ];

  for (const data of hotelsData) {
    const hotel = await Hotel.create(data);

    // Create corresponding rooms for each hotel to activate booking
    if (hotel.name === 'Taj Lake Palace') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Luxury Palace Room Lake View',
          description: 'Carved heritage windows facing Pichola Lake, royal furnishings, butler support.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 450,
          basePrice: 19999,
          totalRooms: 6,
          amenities: ['AC', 'TV', 'Minibar', 'BathTub', 'Butler Service'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Royal Lake Suite',
          description: 'A massive suite once used by Rajasthani princes, complete with royal portraits, swing seat, and panoramic lake terrace.',
          maxAdults: 3,
          maxChildren: 2,
          bedType: 'King',
          sizeSqft: 950,
          basePrice: 39999,
          totalRooms: 2,
          amenities: ['AC', 'TV', 'Minibar', 'BathTub', 'Butler Service', 'Terrace'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'Kumarakom Lake Resort') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Luxury Pavilion Room',
          description: 'Cozy pavilion styling, ensuite open-roof garden bathroom.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 380,
          basePrice: 12499,
          totalRooms: 8,
          amenities: ['AC', 'TV', 'Open Bathroom', 'Lawn View'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Heritage Lake View Villa with Private Pool',
          description: 'Exquisite Keralite architecture, wood paneling, direct view of Vembanad and private plunge pool.',
          maxAdults: 3,
          maxChildren: 2,
          bedType: 'King',
          sizeSqft: 650,
          basePrice: 22499,
          totalRooms: 4,
          amenities: ['AC', 'TV', 'Private Pool', 'Lake view', 'Minibar'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'Whispering Palms Beach Resort') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Standard Studio Room',
          description: 'Modern room, pool facing balcony, premium fittings.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'Double',
          sizeSqft: 280,
          basePrice: 5999,
          totalRooms: 20,
          amenities: ['AC', 'TV', 'Balcony', 'WiFi'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Beachside Cottage Suite',
          description: 'Individual cottage cabins adjacent to sand. Private hammock and sunloungers.',
          maxAdults: 3,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 400,
          basePrice: 9999,
          totalRooms: 5,
          amenities: ['AC', 'TV', 'Hammock', 'Mini Bar'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'Snow Valley Resorts') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Standard Hill View Room',
          description: 'Cozy wood paneled room with views of the deodar pines.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 300,
          basePrice: 4200,
          totalRooms: 15,
          amenities: ['AC', 'TV', 'Heater', 'WiFi'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Duplex Family Room',
          description: 'Two-tier room with internal wooden stairs, ideal for families traveling with children.',
          maxAdults: 4,
          maxChildren: 2,
          bedType: 'Double + Twin',
          sizeSqft: 500,
          basePrice: 7500,
          totalRooms: 5,
          amenities: ['AC', 'TV', 'Heater', 'Balcony'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'The Khyber Himalayan Resort') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Premier Forest View Room',
          description: 'Floor-to-ceiling windows showing Gulmarg pine forest and snow hills, Kashmiri rugs.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 420,
          basePrice: 15500,
          totalRooms: 10,
          amenities: ['AC', 'TV', 'Central Heating', 'Bathtub', 'Luxury Toiletries'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Luxury Gulmarg Suite',
          description: 'Huge suite with separate living area, marble fireplace, private terrace overlooking Gondola run.',
          maxAdults: 3,
          maxChildren: 2,
          bedType: 'King',
          sizeSqft: 850,
          basePrice: 31000,
          totalRooms: 3,
          amenities: ['AC', 'TV', 'Heating', 'Fireplace', 'Terrace', 'Minibar'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'Havelock Island Beach Resort') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Deluxe Garden Cottage',
          description: 'Cottage surrounded by tropical flower gardens, easy walk to private beach.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 320,
          basePrice: 8499,
          totalRooms: 12,
          amenities: ['AC', 'TV', 'WiFi', 'Coffee Maker'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Beachfront Pool Villa',
          description: 'Ocean facing pool access villa, modern glass walls, sun deck lounge chair.',
          maxAdults: 3,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 500,
          basePrice: 13999,
          totalRooms: 4,
          amenities: ['AC', 'TV', 'Private Deck', 'Espresso Maker', 'Bathtub'],
          breakfastIncluded: true,
        }
      ]);
    } else if (hotel.name === 'The Grand Dragon Ladakh') {
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Deluxe Mountain View Room',
          description: 'Large double room looking out directly to Stok Kangri range. Double glazed insulation.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 340,
          basePrice: 7999,
          totalRooms: 14,
          amenities: ['AC', 'TV', 'Underfloor Heating', 'WiFi'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Royal Dragon Suite',
          description: 'Traditional wood motifs, luxury furnishings, large separate living lounge and direct Stok view.',
          maxAdults: 3,
          maxChildren: 2,
          bedType: 'King',
          sizeSqft: 700,
          basePrice: 14999,
          totalRooms: 2,
          amenities: ['AC', 'TV', 'Heating', 'Separate Living Room', 'Premium Toiletries'],
          breakfastIncluded: true,
        }
      ]);
    } else {
      // The Azure Grand
      await Room.create([
        {
          hotel: hotel._id,
          name: 'Deluxe King Room',
          description: 'Spacious room with a king bed and city view.',
          maxAdults: 2,
          maxChildren: 1,
          bedType: 'King',
          sizeSqft: 320,
          basePrice: 3499,
          totalRooms: 10,
          amenities: ['AC', 'TV', 'Minibar', 'Balcony'],
          breakfastIncluded: true,
        },
        {
          hotel: hotel._id,
          name: 'Executive Suite',
          description: 'Suite with a separate living area and premium amenities.',
          maxAdults: 3,
          maxChildren: 2,
          bedType: 'King',
          sizeSqft: 550,
          basePrice: 5999,
          totalRooms: 4,
          amenities: ['AC', 'TV', 'Minibar', 'Balcony', 'Bathtub'],
          breakfastIncluded: true,
        }
      ]);
    }
  }

  console.log('Seeding complete.');
  console.log('---------------------------------------');
  console.log('Admin login:    admin@travelstay.com / Admin@123');
  console.log('Agency login:   agency@travelstay.com / Agency@123');
  console.log('Customer login: customer@travelstay.com / Customer@123');
  console.log('---------------------------------------');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
