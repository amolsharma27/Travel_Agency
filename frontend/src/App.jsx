import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import Hotels from './pages/Hotels.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import HotelBookingForm from './pages/HotelBookingForm.jsx';

import Packages from './pages/Packages.jsx';
import PackageDetails from './pages/PackageDetails.jsx';
import PackageBookingForm from './pages/PackageBookingForm.jsx';

import Transportation from './pages/Transportation.jsx';
import Activities from './pages/Activities.jsx';
import ActivityDetails from './pages/ActivityDetails.jsx';
import PassportServices from './pages/PassportServices.jsx';

import BookingConfirmation from './pages/BookingConfirmation.jsx';
import { About, Contact, FAQ, Privacy, Terms, NotFound } from './pages/StaticPages.jsx';

// Dedicated Admin Portal System
import AdminRoute from './components/AdminRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

// Admin Sub-Modules
import AdminOverview from './pages/dashboard/AdminOverview.jsx';
import AdminInbox from './pages/dashboard/AdminInbox.jsx';
import AdminEnquiries from './pages/AdminEnquiries.jsx';
import AdminPackages from './pages/dashboard/AdminPackages.jsx';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1727] dark:text-slate-100 font-sans">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' }
        }}
      />

      {/* PUBLIC TOP NAVBAR (Only rendered on public website, hidden in Admin Portal) */}
      {!isAdminPath && <Navbar />}

      {/* MAIN ROUTING AREA */}
      <main className="flex-1">
        <Routes>
          {/* ======================================================== */}
          {/* 1. PUBLIC WEBSITE ROUTES                                 */}
          {/* ======================================================== */}
          <Route path="/" element={<Home />} />

          {/* Tours & Packages */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:idOrSlug" element={<PackageDetails />} />
          <Route path="/packages/:id/book" element={<PackageBookingForm />} />

          {/* Stays & Hotels */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:idOrSlug" element={<HotelDetails />} />
          <Route path="/hotels/:hotelId/book/:roomId" element={<HotelBookingForm />} />

          {/* Transportation */}
          <Route path="/transportation" element={<Transportation />} />

          {/* Activities & Adventure */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />

          {/* Nearby Getaways Shortcut */}
          <Route path="/nearby-getaways" element={<Navigate to="/packages?category=Nearby+Getaways" replace />} />

          {/* Passport Services */}
          <Route path="/passport-services" element={<PassportServices />} />

          {/* Booking Confirmation */}
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />

          {/* Static Informational Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Public Enquiries shortcut redirects to Admin Enquiries */}
          <Route path="/enquiries" element={<Navigate to="/admin/enquiries" replace />} />

          {/* ======================================================== */}
          {/* 2. DEDICATED ADMIN PORTAL (ISOLATED & SECURE)            */}
          {/* ======================================================== */}
          {/* Admin Login Gateway */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Command Studio */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="*" element={<Navigate to="/admin/overview" replace />} />
          </Route>

          {/* Graceful Fallbacks for Old Dashboard Paths */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
          <Route path="/agency/*" element={<Navigate to="/" replace />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* PUBLIC FOOTER (Only rendered on public website, hidden in Admin Portal) */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
