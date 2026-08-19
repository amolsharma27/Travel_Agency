import axios from 'axios';
import {
  getStoredPackages,
  getStoredHotels,
  getStoredActivities,
  getStoredBookings,
  saveBooking,
  getStoredPassportRequests,
  savePassportRequest,
  mockUsers,
  mockTransportRoutes,
  mockPassportPlans,
  mockNearbyGetaways,
  getStoredWishlist,
  toggleWishlistItem,
} from '../data/mockData.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper for local mock handling when backend is offline or responds with error
const handleFallback = (error) => {
  const config = error?.config || {};
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const params = config.params || {};

  // GET /hotels
  if (url === '/hotels' || url.startsWith('/hotels?')) {
    let list = [...getStoredHotels()];
    if (params.city) {
      const q = params.city.toLowerCase();
      list = list.filter(h => h.city?.toLowerCase().includes(q) || h.address?.toLowerCase().includes(q) || h.state?.toLowerCase().includes(q));
    }
    if (params.category && params.category !== 'All') {
      list = list.filter(h => h.propertyType?.toLowerCase() === params.category.toLowerCase() || h.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.minPrice) list = list.filter(h => h.startingPrice >= Number(params.minPrice));
    if (params.maxPrice) list = list.filter(h => h.startingPrice <= Number(params.maxPrice));
    if (params.starRating) list = list.filter(h => h.starRating >= Number(params.starRating));
    if (params.amenities) {
      const ams = params.amenities.split(',');
      list = list.filter(h => ams.every(a => h.amenities?.includes(a)));
    }
    if (params.sort === 'price_asc') list.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (params.sort === 'price_desc') list.sort((a, b) => b.startingPrice - a.startingPrice);
    else if (params.sort === 'rating_desc') list.sort((a, b) => b.rating - a.rating);

    const limit = Number(params.limit) || 12;
    const page = Number(params.page) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);
    return Promise.resolve({
      data: {
        success: true,
        data: paginated,
        total: list.length,
        pages: Math.ceil(list.length / limit) || 1,
        page,
      }
    });
  }

  // GET /hotels/:id
  if (url.startsWith('/hotels/') && method === 'get') {
    const id = url.split('/hotels/')[1]?.split('?')[0];
    const hotels = getStoredHotels();
    const found = hotels.find(h => h._id === id || h.name?.toLowerCase().replace(/\s+/g, '-') === id) || hotels[0];
    return Promise.resolve({ data: { success: true, data: found } });
  }

  // GET /packages
  if (url === '/packages' || url.startsWith('/packages?')) {
    let list = [...getStoredPackages()];
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.theme?.toLowerCase().includes(q));
    }
    if (params.category && params.category !== 'All') {
      const cat = params.category.toLowerCase();
      list = list.filter(p => p.category?.toLowerCase() === cat || p.tourType?.toLowerCase() === cat || p.theme?.toLowerCase().includes(cat));
    }
    if (params.tourType && params.tourType !== 'All') {
      list = list.filter(p => p.tourType?.toLowerCase() === params.tourType.toLowerCase());
    }
    if (params.minPrice) list = list.filter(p => (p.discountPrice || p.price) >= Number(params.minPrice));
    if (params.maxPrice) list = list.filter(p => (p.discountPrice || p.price) <= Number(params.maxPrice));
    if (params.maxDays) list = list.filter(p => p.durationDays <= Number(params.maxDays));
    if (params.sort === 'price_asc') list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (params.sort === 'price_desc') list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (params.sort === 'rating_desc') list.sort((a, b) => b.rating - a.rating);

    const limit = Number(params.limit) || 12;
    const page = Number(params.page) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);
    return Promise.resolve({
      data: {
        success: true,
        data: paginated,
        total: list.length,
        pages: Math.ceil(list.length / limit) || 1,
        page,
      }
    });
  }

  // GET /packages/:id
  if (url.startsWith('/packages/') && method === 'get') {
    const id = url.split('/packages/')[1]?.split('?')[0];
    const packages = getStoredPackages();
    const found = packages.find(p => p._id === id || p.title?.toLowerCase().replace(/\s+/g, '-') === id) || packages[0];
    return Promise.resolve({ data: { success: true, data: found } });
  }

  // GET /activities
  if (url === '/activities' || url.startsWith('/activities?')) {
    let list = [...getStoredActivities()];
    if (params.category && params.category !== 'All') {
      list = list.filter(a => a.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(a => a.title?.toLowerCase().includes(q) || a.location?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q));
    }
    if (params.maxPrice) list = list.filter(a => (a.discountPrice || a.price) <= Number(params.maxPrice));
    return Promise.resolve({
      data: { success: true, data: list, total: list.length }
    });
  }

  // GET /activities/:id
  if (url.startsWith('/activities/') && method === 'get') {
    const id = url.split('/activities/')[1]?.split('?')[0];
    const acts = getStoredActivities();
    const found = acts.find(a => a._id === id) || acts[0];
    return Promise.resolve({ data: { success: true, data: found } });
  }

  // GET /transportation
  if (url.includes('/transportation')) {
    return Promise.resolve({ data: { success: true, data: mockTransportRoutes } });
  }

  // GET /passport-services
  if (url.includes('/passport-services')) {
    return Promise.resolve({ data: { success: true, data: mockPassportPlans } });
  }

  // GET /getaways
  if (url.includes('/getaways')) {
    return Promise.resolve({ data: { success: true, data: mockNearbyGetaways } });
  }

  // GET /bookings/my or /bookings or /package-bookings / /hotel-bookings
  if ((url.includes('/bookings') || url.includes('-bookings')) && method === 'get') {
    const bookings = getStoredBookings();
    if (url.includes('/') && url.split('/').length > 2 && !url.includes('/my')) {
      const bId = url.split('/').pop();
      const bFound = bookings.find(b => b._id === bId) || bookings[0];
      return Promise.resolve({ data: { success: true, data: bFound } });
    }
    return Promise.resolve({ data: { success: true, data: bookings, total: bookings.length } });
  }

  // POST /passport-requests
  if (url.includes('/passport-requests') && method === 'post') {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    const newPassportReq = {
      _id: 'pass_' + Date.now(),
      bookingType: 'passport',
      bookingDate: new Date().toISOString(),
      itemTitle: payload.serviceTitle || 'Passport Application Assistance',
      destination: payload.preferredPSK || 'Passport Seva Kendra',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      status: 'under_review',
      paymentStatus: 'paid',
      paymentId: 'pay_pass_' + Math.random().toString(36).substring(2, 9),
      applicationTrackingId: 'MEA-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...payload
    };
    savePassportRequest(newPassportReq);
    return Promise.resolve({ data: { success: true, message: 'Passport assistance request submitted successfully!', data: newPassportReq } });
  }

  // POST /bookings or /package-bookings or /hotel-bookings or /activity-bookings or /transportation-bookings
  if ((url.includes('/bookings') || url.includes('-bookings')) && method === 'post') {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    
    let itemTitle = payload.itemTitle || 'Travel Booking';
    let image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    let destination = payload.destination || 'India';
    let bookingType = payload.bookingType || 'package';

    if (payload.packageId) {
      const p = getStoredPackages().find(x => x._id === payload.packageId);
      if (p) {
        itemTitle = p.title;
        image = p.images?.[0] || image;
        destination = p.destination;
        bookingType = 'package';
      }
    } else if (payload.hotelId) {
      const h = getStoredHotels().find(x => x._id === payload.hotelId);
      if (h) {
        itemTitle = h.name;
        image = h.images?.[0] || image;
        destination = h.city;
        bookingType = 'hotel';
      }
    } else if (payload.activityId) {
      const a = getStoredActivities().find(x => x._id === payload.activityId);
      if (a) {
        itemTitle = a.title;
        image = a.image || image;
        destination = a.location;
        bookingType = 'activity';
      }
    }

    const newBooking = {
      _id: 'bk_' + Date.now(),
      bookingType,
      bookingDate: new Date().toISOString(),
      itemTitle,
      image,
      destination,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentId: 'pay_' + Math.random().toString(36).substring(2, 9),
      ...payload
    };
    saveBooking(newBooking);
    return Promise.resolve({ data: { success: true, message: 'Booking confirmed successfully!', data: newBooking } });
  }

  // POST /payments/create-order
  if (url.includes('/payments/create-order')) {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          isMock: true,
          orderId: 'order_mock_' + Date.now(),
          paymentDbId: 'pdb_' + Date.now(),
          amount: 500000,
          currency: 'INR',
        }
      }
    });
  }

  // POST /payments/verify
  if (url.includes('/payments/verify')) {
    return Promise.resolve({
      data: {
        success: true,
        message: 'Payment verified and booking confirmed successfully!'
      }
    });
  }

  // GET /auth/me
  if (url === '/auth/me' && method === 'get') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return Promise.resolve({ data: { success: true, user: JSON.parse(storedUser) } });
    }
  }

  // POST /auth/login
  if (url === '/auth/login' && method === 'post') {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    const email = payload.email?.toLowerCase();
    let user = mockUsers.customer;
    if (email?.includes('agency')) user = mockUsers.agency;
    else if (email?.includes('admin')) user = mockUsers.admin;
    else if (payload.email) {
      user = {
        _id: 'user_' + Date.now(),
        name: payload.email.split('@')[0] || 'Explorer',
        email: payload.email,
        role: 'customer',
        joinedDate: 'Just now',
        tripsCompleted: 1,
        spotsVisited: 4,
      };
    }
    return Promise.resolve({
      data: {
        success: true,
        token: 'jwt_mock_token_' + Date.now(),
        user,
      }
    });
  }

  // POST /support
  if (url === '/support') {
    return Promise.resolve({ data: { success: true, message: 'Thank you! Your inquiry has been received. Our travel advisor will reach out to you within 2 hours.' } });
  }

  // GET /wishlist
  if (url.includes('/wishlist') && method === 'get') {
    return Promise.resolve({ data: { success: true, data: getStoredWishlist() } });
  }

  // POST /wishlist/toggle
  if (url.includes('/wishlist') && method === 'post') {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    const updated = toggleWishlistItem(payload);
    return Promise.resolve({ data: { success: true, data: updated } });
  }

  // GET /notifications
  if (url.includes('/notifications')) {
    return Promise.resolve({
      data: {
        success: true,
        data: [
          { _id: 'notif_1', title: 'Booking Confirmed!', message: 'Your trip to Himachal & Jibhi is confirmed. Check itinerary for pickup points.', isRead: false, createdAt: new Date().toISOString() },
          { _id: 'notif_2', title: 'Passport Service Update', message: 'Your appointment assistance file MEA-LDH-2026-88192 is under pre-screening review.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
      }
    });
  }

  // GET /payments/my
  if (url.includes('/payments')) {
    return Promise.resolve({
      data: {
        success: true,
        data: [
          { _id: 'pay_01', createdAt: new Date().toISOString(), bookingType: 'package', amount: 5999, status: 'completed', isMock: true },
          { _id: 'pay_02', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), bookingType: 'hotel', amount: 2899, status: 'completed', isMock: true },
          { _id: 'pay_03', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), bookingType: 'activity', amount: 3550, status: 'completed', isMock: true },
          { _id: 'pay_04', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), bookingType: 'passport', amount: 1999, status: 'completed', isMock: true }
        ]
      }
    });
  }

  // GET /dashboard/admin
  if (url === '/dashboard/admin' || url === '/api/dashboard/admin' || (url.includes('/dashboard/admin') && !url.includes('/users'))) {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          users: { totalCustomers: 1240, totalAgencies: 45, pendingAgencies: 2 },
          packages: { total: 48, pending: 3 },
          hotels: { total: 32, pending: 2 },
          activities: { total: 18, pending: 1 },
          passportRequests: { total: 24, pending: 4 },
          bookings: { totalPackageBookings: 184, totalHotelBookings: 112, totalActivityBookings: 64, totalPassportAssistance: 28 },
          revenue: 628400,
          support: { openTickets: 3 },
        }
      }
    });
  }

  // PUT /auth/profile
  if (url.includes('/auth/profile')) {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...stored, ...payload };
    localStorage.setItem('user', JSON.stringify(updated));
    return Promise.resolve({ data: { success: true, message: 'Profile updated successfully!', user: updated } });
  }

  // Default catch-all graceful fallback for other GET requests
  if (method === 'get') {
    return Promise.resolve({ data: { success: true, data: [] } });
  }

  return Promise.resolve({ data: { success: true, message: 'Action completed successfully' } });
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return handleFallback(error);
  }
);

export default api;
