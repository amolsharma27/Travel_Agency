import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiCompass, FiCalendar, FiMapPin, FiUsers, FiDownload, FiCheckCircle,
  FiArrowRight, FiHeart, FiCamera, FiAward, FiShield, FiClock,
  FiBookOpen, FiCreditCard, FiExternalLink, FiFileText, FiPrinter
} from 'react-icons/fi';
import { FaPassport, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStoredBookings, getStoredWishlist, getStoredMemories } from '../../data/mockData.js';

const CustomerOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [memories, setMemories] = useState([]);
  const [ticketModal, setTicketModal] = useState(null);

  useEffect(() => {
    setBookings(getStoredBookings());
    setWishlist(getStoredWishlist());
    setMemories(getStoredMemories());
  }, []);

  const upcomingBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'under_review') || bookings[0];

  const handleDownloadTicket = (b) => {
    setTicketModal(b);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME HERO CARD */}
      <div className="rounded-2xl bg-[#0F2942] p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <FiAward /> Gold Explorer Tier
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: PCTE-TR-8819</span>
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Explorer'}! 👋
          </h2>
          <p className="text-xs text-slate-300">
            Freedom To Evolve — Manage your upcoming tours, travel boarding passes, and reward points.
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
            {bookings.filter(b => b.status === 'confirmed').length || 1}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Confirmed Departures</p>
        </Link>

        <Link
          to="/dashboard/memories"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Trips</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <FiCamera size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">
            {memories.length + 4}
          </p>
          <p className="text-[10px] text-slate-400">22 Spots Visited</p>
        </Link>

        <Link
          to="/dashboard/rewards"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reward Points</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <FiAward size={14} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black text-amber-500">1,450</p>
          <p className="text-[10px] text-amber-600 font-semibold">Worth ₹1,450 Off</p>
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
            {wishlist.length || 2}
          </p>
          <p className="text-[10px] text-slate-400">Tours &amp; Stays Bookmarked</p>
        </Link>
      </div>

      {/* 3. PROMINENT UPCOMING TRIP CARD */}
      {upcomingBooking && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48] flex items-center gap-1.5">
                <FiCompass /> Your Next Adventure
              </span>
              <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                {upcomingBooking.itemTitle || 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass'}
              </h3>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
              <FiCheckCircle /> Confirmed Departure
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
                    <FiMapPin className="text-[#E11D48]" /> {upcomingBooking.destination || 'Jibhi & Tirthan Valley, HP'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Travel Dates</span>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <FiCalendar className="text-[#0F2942] dark:text-amber-400" /> 28 Aug 2026 - 31 Aug 2026
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Booking Pass Reference</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {upcomingBooking._id || 'BK-2026-8801'} ({upcomingBooking.guestsCount || 2} Travellers)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Pickup Location</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Ludhiana / Chandigarh Phase 8 (08:30 PM)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/packages/pkg_101"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  View Trip Details
                </Link>

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
                  <FiDownload /> Download Boarding Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECENT ACTIVITY & DISCOVER SHORTCUTS */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left: Active Passport Assistance & KYC Status (6 Cols) */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaPassport className="text-[#E11D48]" /> Active Passport &amp; KYC Files
            </h3>
            <Link to="/dashboard/documents" className="text-xs font-bold text-[#E11D48] hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Fresh 36-Page Adult Passport</p>
                <p className="text-[10px] text-slate-400 font-mono">MEA File: MEA-LDH-2026-88192 (PSK Ludhiana)</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                Pre-Screened
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Aadhaar Identity Card</p>
                <p className="text-[10px] text-slate-400">UIDAI Verified (•••• 8821)</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Discovery Spots (6 Cols) */}
        <div className="md:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiCompass className="text-emerald-500" /> Weekend Departures from Punjab
              </h3>
              <Link to="/packages" className="text-xs font-bold text-[#E11D48] hover:underline">
                Explore All →
              </Link>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <Link to="/packages/pkg_102" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] flex items-center justify-between transition group">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] transition">Kashmir Paradise Group Tour</p>
                  <p className="text-[10px] text-slate-400">5 Days / 4 Nights · Srinagar &amp; Gulmarg</p>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹14,999</span>
              </Link>

              <Link to="/packages/pkg_103" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] flex items-center justify-between transition group">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] transition">Rajasthan Royal Heritage Group Tour</p>
                  <p className="text-[10px] text-slate-400">4 Days / 3 Nights · Jaipur &amp; Jaisalmer</p>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹9,800</span>
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/packages"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0F2942] hover:text-white text-slate-800 dark:text-slate-200 py-2.5 text-xs font-bold transition"
            >
              Browse All 48 Domestic Packages <FiArrowRight />
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
                <h3 className="font-display text-lg font-black">{ticketModal._id || 'BK-2026-8801'}</h3>
              </div>
              <button onClick={() => setTicketModal(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#0F2942] text-white flex justify-between items-center">
                <div>
                  <p className="font-bold">{ticketModal.itemTitle || 'Himachal Group Tour'}</p>
                  <p className="text-[11px] text-slate-300">{ticketModal.destination || 'Jibhi, Himachal Pradesh'}</p>
                </div>
                <span className="text-xs font-bold text-amber-300">Confirmed Pass</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Lead Traveler:</span>
                <span className="font-bold">{user?.name || 'Amol Sharma'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Departure Boarding:</span>
                <span className="font-bold">Majnu Ka Tila (Delhi) / Tribune Chowk (Chandigarh)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Reporting Time:</span>
                <span className="font-bold text-[#E11D48]">08:30 PM (Every Friday)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(ticketModal.totalAmount || 11998).toLocaleString('en-IN')} (Paid)</span>
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
