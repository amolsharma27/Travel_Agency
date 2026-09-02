import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

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
import NearbyGetaways from './pages/NearbyGetaways.jsx';
import PassportServices from './pages/PassportServices.jsx';

import BookingConfirmation from './pages/BookingConfirmation.jsx';
import AdminEnquiries from './pages/AdminEnquiries.jsx';
import { About, Contact, FAQ, Privacy, Terms, NotFound } from './pages/StaticPages.jsx';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1727] dark:text-slate-100 font-sans">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' }
        }}
      />

      {/* GLOBAL TOP NAVBAR */}
      <Navbar />

      {/* MAIN ROUTING AREA */}
      <main className="flex-1">
        <Routes>
          {/* Main Home (Includes Full-Screen Upcoming Tour Landing Section + Sticky Navbar) */}
          <Route path="/" element={<Home />} />

          {/* 1. Tours & Packages */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:idOrSlug" element={<PackageDetails />} />
          <Route path="/packages/:id/book" element={<PackageBookingForm />} />

          {/* 2. Stays & Hotels */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:idOrSlug" element={<HotelDetails />} />
          <Route path="/hotels/:hotelId/book/:roomId" element={<HotelBookingForm />} />

          {/* 3. Transportation */}
          <Route path="/transportation" element={<Transportation />} />

          {/* 4. Activities & Adventure */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />

          {/* 5. Nearby Getaways (Integrated inside Tours) */}
          <Route path="/nearby-getaways" element={<Navigate to="/packages?category=Nearby+Getaways" replace />} />

          {/* 6. Passport Services */}
          <Route path="/passport-services" element={<PassportServices />} />

          {/* 7. Student Enquiries Portal (Staff / Operations) */}
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/enquiries" element={<AdminEnquiries />} />

          {/* Booking Confirmation */}
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />

          {/* Static Informational Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Graceful Redirects for Auth/Old Dashboard Pages */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
          <Route path="/agency/*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/enquiries" replace />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* PUBLIC FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
