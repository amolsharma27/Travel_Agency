import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  FiUser, FiBookOpen, FiHeart, FiBell, FiCreditCard, FiGrid,
  FiMap, FiHome, FiUsers, FiCheckSquare, FiMessageSquare, FiCamera,
  FiTruck, FiActivity, FiShield, FiSliders, FiDollarSign, FiStar,
  FiTrendingUp, FiLifeBuoy, FiSettings, FiAward, FiPieChart, FiBriefcase
} from 'react-icons/fi';
import { FaPassport } from 'react-icons/fa';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ProtectedRoute, RoleRoute } from './components/RouteGuards.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

import Hotels from './pages/Hotels.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import HotelBookingForm from './pages/HotelBookingForm.jsx';

import Packages from './pages/Packages.jsx';
import PackageDetails from './pages/PackageDetails.jsx';
import PackageBookingForm from './pages/PackageBookingForm.jsx';

import Transportation from './pages/Transportation.jsx';
import Activities from './pages/Activities.jsx';
import ActivityDetails from './pages/ActivityDetails.jsx';
import NearbyGetaways from './pages/NearbyGetaways.jsx';
import PassportServices from './pages/PassportServices.jsx';

import BookingConfirmation from './pages/BookingConfirmation.jsx';
import { About, Contact, FAQ, Privacy, Terms, NotFound } from './pages/StaticPages.jsx';

// Customer Dashboard Pages
import CustomerOverview from './pages/dashboard/CustomerOverview.jsx';
import CustomerProfile from './pages/dashboard/CustomerProfile.jsx';
import CustomerBookings from './pages/dashboard/CustomerBookings.jsx';
import CustomerWishlist from './pages/dashboard/CustomerWishlist.jsx';
import CustomerMemories from './pages/dashboard/CustomerMemories.jsx';
import CustomerDocuments from './pages/dashboard/CustomerDocuments.jsx';
import CustomerRewards from './pages/dashboard/CustomerRewards.jsx';
import CustomerSupport from './pages/dashboard/CustomerSupport.jsx';
import { CustomerNotifications, CustomerPayments } from './pages/dashboard/CustomerExtras.jsx';

// Agency Dashboard Pages
import AgencyOverview from './pages/dashboard/AgencyOverview.jsx';
import AgencyPackages from './pages/dashboard/AgencyPackages.jsx';
import AgencyHotels from './pages/dashboard/AgencyHotels.jsx';
import AgencyBookings from './pages/dashboard/AgencyBookings.jsx';
import AgencyCustomers from './pages/dashboard/AgencyCustomers.jsx';
import AgencyAvailability from './pages/dashboard/AgencyAvailability.jsx';
import AgencyEarnings from './pages/dashboard/AgencyEarnings.jsx';
import AgencyReviews from './pages/dashboard/AgencyReviews.jsx';
import AgencyPerformance from './pages/dashboard/AgencyPerformance.jsx';
import AgencySettings from './pages/dashboard/AgencySettings.jsx';

// Admin Dashboard Pages
import AdminOverview from './pages/dashboard/AdminOverview.jsx';
import AdminUsers from './pages/dashboard/AdminUsers.jsx';
import AdminListings from './pages/dashboard/AdminListings.jsx';
import AdminBookings from './pages/dashboard/AdminBookings.jsx';
import AdminAgencies from './pages/dashboard/AdminAgencies.jsx';
import AdminPayments from './pages/dashboard/AdminPayments.jsx';
import AdminPassport from './pages/dashboard/AdminPassport.jsx';
import AdminReviews from './pages/dashboard/AdminReviews.jsx';
import AdminSupport from './pages/dashboard/AdminSupport.jsx';
import AdminReports from './pages/dashboard/AdminReports.jsx';
import AdminSettings from './pages/dashboard/AdminSettings.jsx';

// Customer Sidebar Links
const customerLinks = [
  { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { to: '/dashboard/bookings', label: 'My Bookings & Requests', icon: FiBookOpen },
  { to: '/dashboard/memories', label: 'Trips & Travel Spots', icon: FiCamera },
  { to: '/dashboard/wishlist', label: 'Saved Wishlist', icon: FiHeart },
  { to: '/dashboard/payments', label: 'Invoices & Payments', icon: FiCreditCard },
  { to: '/dashboard/documents', label: 'Travel Documents', icon: FaPassport },
  { to: '/dashboard/rewards', label: 'Loyalty & Reward Points', icon: FiAward },
  { to: '/dashboard/notifications', label: 'Notifications', icon: FiBell },
];

const customerBottomLinks = [
  { to: '/dashboard/support', label: 'Help & Support', icon: FiLifeBuoy },
  { to: '/dashboard/profile', label: 'Settings', icon: FiSettings },
];

// Agency Sidebar Links
const agencyLinks = [
  { to: '/agency', label: 'Overview', icon: FiGrid, end: true },
  { to: '/agency/packages', label: 'Tour Packages', icon: FiMap },
  { to: '/agency/hotels', label: 'Stays & Hotels', icon: FiHome },
  { to: '/agency/bookings', label: 'Bookings', icon: FiBookOpen },
  { to: '/agency/customers', label: 'Customers', icon: FiUsers },
  { to: '/agency/availability', label: 'Availability', icon: FiSliders },
  { to: '/agency/earnings', label: 'Earnings & Payouts', icon: FiDollarSign },
  { to: '/agency/reviews', label: 'Reviews & Ratings', icon: FiStar },
  { to: '/agency/performance', label: 'Performance', icon: FiTrendingUp },
];

const agencyBottomLinks = [
  { to: '/agency/settings', label: 'Agency Settings', icon: FiSettings },
];

// Admin Sidebar Links
const adminLinks = [
  { to: '/admin', label: 'Analytics & Overview', icon: FiGrid, end: true },
  { to: '/admin/users', label: 'Users & Operators', icon: FiUsers },
  { to: '/admin/listings', label: 'Listings & Requests', icon: FiCheckSquare },
  { to: '/admin/bookings', label: 'Bookings', icon: FiBookOpen },
  { to: '/admin/agencies', label: 'Agencies', icon: FiBriefcase },
  { to: '/admin/payments', label: 'Payments', icon: FiCreditCard },
  { to: '/admin/passport', label: 'Passport Services', icon: FaPassport },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/support', label: 'Support Inquiries', icon: FiMessageSquare },
  { to: '/admin/reports', label: 'Reports', icon: FiPieChart },
];

const adminBottomLinks = [
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1727] dark:text-slate-100 font-sans">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' } }} />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 1. Tours */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:idOrSlug" element={<PackageDetails />} />
          <Route
            path="/packages/:id/book"
            element={<ProtectedRoute><PackageBookingForm /></ProtectedRoute>}
          />

          {/* 2. Stays */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:idOrSlug" element={<HotelDetails />} />
          <Route
            path="/hotels/:hotelId/book/:roomId"
            element={<ProtectedRoute><HotelBookingForm /></ProtectedRoute>}
          />

          {/* 3. Transportation */}
          <Route path="/transportation" element={<Transportation />} />

          {/* 4. Activities */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />

          {/* 5. Nearby Getaways */}
          <Route path="/nearby-getaways" element={<NearbyGetaways />} />

          {/* 6. Passport Services */}
          <Route path="/passport-services" element={<PassportServices />} />

          {/* Booking Confirmation */}
          <Route
            path="/booking-confirmation"
            element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>}
          />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* 1. Customer Dashboard */}
          <Route
            path="/dashboard"
            element={<RoleRoute roles={['customer']}><DashboardLayout title="My Customer Account" links={customerLinks} bottomLinks={customerBottomLinks} /></RoleRoute>}
          >
            <Route index element={<CustomerOverview />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="bookings" element={<CustomerBookings />} />
            <Route path="memories" element={<CustomerMemories />} />
            <Route path="wishlist" element={<CustomerWishlist />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="documents" element={<CustomerDocuments />} />
            <Route path="rewards" element={<CustomerRewards />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="support" element={<CustomerSupport />} />
          </Route>

          {/* 2. Agency Dashboard */}
          <Route
            path="/agency"
            element={<RoleRoute roles={['agency']}><DashboardLayout title="Agency Management Portal" links={agencyLinks} bottomLinks={agencyBottomLinks} /></RoleRoute>}
          >
            <Route index element={<AgencyOverview />} />
            <Route path="packages" element={<AgencyPackages />} />
            <Route path="hotels" element={<AgencyHotels />} />
            <Route path="bookings" element={<AgencyBookings />} />
            <Route path="customers" element={<AgencyCustomers />} />
            <Route path="availability" element={<AgencyAvailability />} />
            <Route path="earnings" element={<AgencyEarnings />} />
            <Route path="reviews" element={<AgencyReviews />} />
            <Route path="performance" element={<AgencyPerformance />} />
            <Route path="settings" element={<AgencySettings />} />
          </Route>

          {/* 3. Admin Dashboard */}
          <Route
            path="/admin"
            element={<RoleRoute roles={['admin']}><DashboardLayout title="Admin Operations Console" links={adminLinks} bottomLinks={adminBottomLinks} /></RoleRoute>}
          >
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="agencies" element={<AdminAgencies />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="passport" element={<AdminPassport />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
