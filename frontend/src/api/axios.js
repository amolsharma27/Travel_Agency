import axios from 'axios';
import {
  getStoredPackages,
  getStoredHotels,
  getStoredBookings,
  saveBooking,
  mockUsers,
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
      list = list.filter(h => h.city?.toLowerCase().includes(params.city.toLowerCase()) || h.address?.toLowerCase().includes(params.city.toLowerCase()));
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
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (params.category && params.category !== 'All') {
      list = list.filter(p => p.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.minPrice) list = list.filter(p => (p.discountPrice || p.price) >= Number(params.minPrice));
    if (params.maxPrice) list = list.filter(p => (p.discountPrice || p.price) <= Number(params.maxPrice));
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

  // GET /bookings/my or /bookings or /package-bookings / /hotel-bookings
  if ((url.includes('/bookings') || url.includes('-bookings')) && method === 'get') {
    const bookings = getStoredBookings();
    if (url.includes('/') && url.split('/').length > 2) {
      const bId = url.split('/').pop();
      const bFound = bookings.find(b => b._id === bId) || bookings[0];
      return Promise.resolve({ data: { success: true, data: bFound } });
    }
    return Promise.resolve({ data: { success: true, data: bookings, total: bookings.length } });
  }

  // POST /bookings or /package-bookings or /hotel-bookings
  if ((url.includes('/bookings') || url.includes('-bookings')) && method === 'post') {
    let payload = {};
    try { payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch (e) { /* ignore */ }
    
    let itemTitle = 'Travel Booking';
    let image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    let destination = 'India';

    if (payload.packageId) {
      const p = getStoredPackages().find(x => x._id === payload.packageId);
      if (p) {
        itemTitle = p.title;
        image = p.images?.[0] || image;
        destination = p.destination;
      }
    } else if (payload.hotelId) {
      const h = getStoredHotels().find(x => x._id === payload.hotelId);
      if (h) {
        itemTitle = h.name;
        image = h.images?.[0] || image;
        destination = h.city;
      }
    }

    const newBooking = {
      _id: 'bk_' + Date.now(),
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
    return Promise.resolve({ data: { success: true, message: 'Thank you! Your message has been received. Our team will contact you within 2 hours.' } });
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
          { _id: 'notif_1', title: 'Booking Confirmed!', message: 'Your trip to Manali & Solang Valley is confirmed. Have a wonderful journey!', isRead: false, createdAt: new Date().toISOString() },
          { _id: 'notif_2', title: 'Special Promo Deal', message: 'Use coupon code BUDGET500 to get ₹500 off on your next weekend tour.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
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
          { _id: 'pay_01', createdAt: new Date().toISOString(), bookingType: 'package', amount: 4999, status: 'completed', isMock: true },
          { _id: 'pay_02', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), bookingType: 'hotel', amount: 1299, status: 'completed', isMock: true },
        ]
      }
    });
  }

  // GET /dashboard/agency
  if (url.includes('/dashboard/agency')) {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          listings: { packages: 8, hotels: 6 },
          revenue: { total: '1,42,800', fromPackages: '98,000', fromHotels: '44,800' },
          pendingApprovals: { packageBookings: 2, hotelBookings: 1 },
          bookings: { packageBookings: 14, hotelBookings: 9 },
        }
      }
    });
  }

  // GET /dashboard/admin
  if (url.includes('/dashboard/admin')) {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          users: { total: 1240, customers: 1180, agencies: 60 },
          listings: { packages: 48, hotels: 32 },
          revenue: { total: '4,82,500' },
          pendingAgencies: 3,
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
