import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiCompass, FiCalendar, FiMapPin, FiUsers, FiDownload, FiCheckCircle,
  FiArrowRight, FiHeart, FiCamera, FiAward, FiShield, FiClock,
  FiBookOpen, FiCreditCard, FiExternalLink, FiFileText, FiPrinter, FiAlertCircle
} from 'react-icons/fi';
import { FaPassport, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios.js';

const CustomerOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketModal, setTicketModal] = useState(null);

  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/customer');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
      setError('Could not load dashboard data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleDownloadTicket = (b) => {
    setTicketModal(b);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading your travel dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-6 text-center space-y-3">
        <FiAlertCircle className="mx-auto text-red-500 text-2xl" />
        <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchCustomerData}
          className="rounded-xl bg-[#0F2942] text-white text-xs font-bold px-4 py-2 hover:bg-[#E11D48] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const upcomingBooking = data?.upcomingBooking;
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME HERO CARD */}
      <div className="rounded-2xl bg-[#0F2942] p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <FiAward /> Explorer Tier
            </span>
            <span className="text-xs text-slate-400 font-mono">
              UID: {user?._id ? `PCTE-${user._id.slice(-6).toUpperCase()}` : 'PCTE-TR-8819'}
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Explorer'}! 👋
          </h2>
          <p className="text-xs text-slate-300">
            Freedom To Evolve — Manage your upcoming tours, hotel stays, travel boarding passes, and bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/packages"
            className="flex items-center gap-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 text-xs font-bold shadow transition-colors"
          >
            <FiCompass /> Discover New Tours
          </Link>
          <Link
            to="/dashboard/documents"
            className="flex items-center gap-1.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <FaPassport /> Travel Documents
          </Link>
        </div>
      </div>

      {/* 2. QUICK STATISTICS 4-KPI GRID */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Link
          to="/dashboard/bookings"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming Trips</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <FiCalendar size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">
            {data?.upcomingTrips ?? 0}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            {data?.upcomingTrips ? `${data.upcomingTrips} Active Departures` : 'No upcoming trips'}
          </p>
        </Link>

        <Link
          to="/dashboard/bookings"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <FiBookOpen size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">
            {data?.totalBookings ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">
            {data?.completedTrips ? `${data.completedTrips} Completed` : 'Tours & Stays'}
          </p>
        </Link>

        <Link
          to="/dashboard/rewards"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <FiAward size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-amber-500">
            ₹{(data?.totalSpent ?? 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-amber-600 font-semibold">
            {data?.rewardPoints ? `${data.rewardPoints} Reward Points` : 'Earn Points on Bookings'}
          </p>
        </Link>

        <Link
          to="/dashboard/wishlist"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Wishlist</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <FiHeart size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">
            {data?.savedWishlistCount ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">Tours &amp; Stays Bookmarked</p>
        </Link>
      </div>

      {/* 3. PROMINENT UPCOMING TRIP CARD OR EMPTY STATE */}
      {upcomingBooking ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48] flex items-center gap-1.5">
                <FiCompass /> Your Next Adventure
              </span>
              <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                {upcomingBooking.itemTitle}
              </h3>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
              <FiCheckCircle /> {upcomingBooking.status === 'confirmed' ? 'Confirmed Departure' : 'Pending Verification'}
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <img
                src={upcomingBooking.image || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                alt={upcomingBooking.itemTitle}
                className="h-44 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              />
            </div>

            <div className="md:col-span-8 flex flex-col justify-between space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Destination &amp; Circuit</span>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <FiMapPin className="text-[#E11D48]" /> {upcomingBooking.destination}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Travel Dates</span>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <FiCalendar className="text-[#0F2942] dark:text-amber-400" /> {new Date(upcomingBooking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Booking Pass Reference</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {upcomingBooking.bookingRef || upcomingBooking._id} ({upcomingBooking.guestsCount || 1} Travellers)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Operator Partner</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {upcomingBooking.operator || 'PCTE Verified Partner'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/dashboard/bookings"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Manage Booking
                </Link>

                <button
                  onClick={() => handleDownloadTicket(upcomingBooking)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold transition shadow"
                >
                  <FiDownload /> View Boarding Pass / Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-8 text-center space-y-3">
          <FiCompass className="mx-auto text-3xl text-slate-400" />
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">No upcoming trips booked yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to explore? Discover weekend getaways from Punjab, Himachal mountain circuits, or luxury beachfront stays.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2.5 text-xs font-bold shadow transition-colors"
          >
            <FiCompass /> Browse Tour Packages
          </Link>
        </div>
      )}

      {/* 4. RECENT ACTIVITY & RECENT BOOKINGS */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left: Recent Bookings List (6 Cols) */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiClock className="text-[#E11D48]" /> Recent Booking Activity
            </h3>
            <Link to="/dashboard/bookings" className="text-xs font-bold text-[#E11D48] hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {recentBookings.length > 0 ? (
              recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{b.itemTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {b.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 block">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      b.status === 'cancelled' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400">No recent bookings recorded.</p>
            )}
          </div>
        </div>

        {/* Right: Quick Discovery Shortcuts (6 Cols) */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiCompass className="text-emerald-500" /> Featured Travel Circuits
              </h3>
              <Link to="/packages" className="text-xs font-bold text-[#E11D48] hover:underline">
                Explore All →
              </Link>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <Link to="/packages" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] flex items-center justify-between transition group">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] transition">Himachal Mountain Group Tours</p>
                  <p className="text-[10px] text-slate-400">Jibhi, Tirthan Valley, Jalori Pass &amp; Manali</p>
                </div>
                <span className="font-mono font-bold text-emerald-600">From ₹5,999</span>
              </Link>

              <Link to="/hotels" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] flex items-center justify-between transition group">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] transition">Luxury Mountain &amp; Beach Resorts</p>
                  <p className="text-[10px] text-slate-400">Verified chalets, heritage palaces &amp; villas</p>
                </div>
                <span className="font-mono font-bold text-emerald-600">From ₹3,499/N</span>
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/packages"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0F2942] hover:text-white text-slate-800 dark:text-slate-200 py-2.5 text-xs font-bold transition"
            >
              Browse All Verified Packages <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* E-TICKET PREVIEW MODAL */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Travel Agency Boarding Pass</span>
                <h3 className="font-display text-lg font-black">{ticketModal.bookingRef || ticketModal._id}</h3>
              </div>
              <button onClick={() => setTicketModal(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#0F2942] text-white flex justify-between items-center">
                <div>
                  <p className="font-bold">{ticketModal.itemTitle}</p>
                  <p className="text-[11px] text-slate-300">{ticketModal.destination}</p>
                </div>
                <span className="text-xs font-bold text-amber-300 capitalize">{ticketModal.status} Pass</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Lead Traveler:</span>
                <span className="font-bold">{user?.name || 'Explorer'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-bold">{new Date(ticketModal.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Operator:</span>
                <span className="font-bold">{ticketModal.operator || 'PCTE Travel Agency'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(ticketModal.totalAmount || 0).toLocaleString('en-IN')} (Paid)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                  setTicketModal(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold transition shadow"
              >
                <FiPrinter /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerOverview;
