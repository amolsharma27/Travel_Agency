import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin, FiCalendar, FiClock, FiCheckCircle, FiPhone,
  FiMail, FiSend, FiArrowLeft, FiCheck, FiX, FiAlertTriangle,
  FiUsers, FiMusic, FiCoffee, FiDollarSign
} from 'react-icons/fi';
import { FaCar, FaWhatsapp, FaSuitcase, FaHotel, FaBus } from 'react-icons/fa';
import api from '../api/axios.js';
import CustomTourModal from '../components/CustomTourModal.jsx';
import StudentRegistrationModal from '../components/StudentRegistrationModal.jsx';
import { getStoredPackages } from '../data/mockData.js';
import mussoorieBg from '../assets/mussoorie-kempty-tour.jpg';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=70';
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const OFFICIAL_EMAIL = 'pcte_travels@pcte.edu.in';

const PackageDetails = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/packages/${idOrSlug}`);
        if (data?.data) {
          setPkg(data.data);
        } else {
          const localPkgs = getStoredPackages();
          const match = localPkgs.find(p => p._id === idOrSlug || p.slug === idOrSlug);
          setPkg(match || localPkgs[0]);
        }
      } catch {
        const localPkgs = getStoredPackages();
        const match = localPkgs.find(p => p._id === idOrSlug || p.slug === idOrSlug);
        setPkg(match || localPkgs[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2942] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading tour details…</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 bg-white dark:bg-[#0F1D30] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Package Not Found</h2>
          <p className="mt-2 text-xs text-slate-500">This tour might have been updated or moved.</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-6 rounded-md bg-[#0F2942] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
          >
            Browse All Tour Packages
          </button>
        </div>
      </div>
    );
  }

  const isMussoorie =
    pkg._id === 'pkg_mussoorie_01' ||
    pkg.slug === 'mussoorie-trip' ||
    pkg.slug === 'mussoorie-kempty-water-fall' ||
    pkg.title?.toLowerCase().includes('mussoorie');

  const galleryImages = pkg.images && pkg.images.length > 0 
    ? pkg.images 
    : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  const whatsappMessage = encodeURIComponent(
    isMussoorie
      ? 'Hello PCTE Travels, I am interested in the official Mussoorie Excursion (11-13 Sep). Please provide me with details on seat booking.'
      : `Hello PCTE Travels, I am interested in requesting details for the ${pkg.title} tour.`
  );
  const whatsappUrl = `https://wa.me/91${PHONE_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Navigation & Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/packages')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0F2942] dark:hover:text-amber-400 cursor-pointer"
          >
            <FiArrowLeft /> Back to all packages
          </button>

          {!isMussoorie && (
            <Link
              to="/packages/mussoorie-trip"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F2942] text-amber-300 text-xs font-bold px-3 py-1 hover:bg-[#1B1464] border border-amber-400/40 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              View Upcoming Mussoorie Trip (11–13 Sep) &rarr;
            </Link>
          )}
        </div>

        {/* ========================================================================= */}
        {/* GLOBAL ALERT BANNER FOR OTHER TOURS: HIGHLIGHTS MUSSOORIE UPCOMING TRIP    */}
        {/* ========================================================================= */}
        {!isMussoorie && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0F2942] via-[#1B1464] to-[#0F2942] text-white p-4 sm:p-5 shadow-lg border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#E11D48] text-white font-black text-[10px] uppercase px-2 py-0.5">
                  Official Upcoming Excursion
                </span>
                <span className="text-xs font-bold text-amber-300">
                  Trip Dates: 11 – 13 September (3 Days / 2 Nights)
                </span>
              </div>
              <h3 className="font-display font-black text-base sm:text-lg text-white">
                Mussoorie Trip · INR 3,700 per person
              </h3>
              <p className="text-xs text-slate-300">
                Queen of the Hills excursion with Tempo Traveller transfers, Paonta Sahib, DJ Party &amp; Kempty Falls. Strictly limited to 47 students!
              </p>
            </div>
            <Link
              to="/packages/mussoorie-trip"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 text-xs shadow-md transition-all uppercase tracking-wider"
            >
              View Mussoorie Details &rarr;
            </Link>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. DEDICATED OFFICIAL VIEW FOR MUSSOORIE TRIP                              */}
        {/* ========================================================================= */}
        {isMussoorie ? (
          <div className="space-y-8">
            
            {/* OFFICIAL PCTE HEADER FLYER CARD */}
            <div className="rounded-3xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Dark Navy Hero Header */}
              <div className="bg-[#10233B] text-white px-6 py-8 text-center space-y-1">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-wide uppercase text-white drop-shadow">
                  MUSSOORIE TRIP
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wider">
                  An Official Excursion by PCTE Travel Desk
                </p>
              </div>

              {/* Gold / Mustard Duration Strip */}
              <div className="bg-[#D99B26] text-slate-950 px-4 py-2.5 text-center font-black text-xs sm:text-sm tracking-wide uppercase shadow-inner">
                Trip Duration: 11 – 13 September | 3 Days / 2 Nights
              </div>

              {/* Gallery Strip with Active Selection */}
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img
                    src={galleryImages[activePhoto] || galleryImages[0]}
                    alt="Mussoorie Excursion"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">Queen of the Hills &amp; Kempty Falls</span>
                      <h3 className="font-display text-lg sm:text-xl font-black">Official PCTE Student Departure</h3>
                    </div>
                    <span className="bg-[#E11D48] text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                      11 Sep – 13 Sep
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePhoto(idx)}
                      className={`h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                        activePhoto === idx
                          ? 'border-[#0F2942] dark:border-amber-400 scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Body: Grid Layout */}
              <div className="p-6 sm:p-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                
                {/* Left Side: Itinerary, Inclusions & Important Notes */}
                <div className="space-y-8">
                  
                  {/* Itinerary Highlights */}
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                      Itinerary Highlights
                    </h2>

                    {/* Day 1 Card */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="bg-[#156B77] text-white px-5 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm">
                        <span className="font-black uppercase tracking-wider">DAY 1</span>
                        <span className="text-teal-100 text-xs">11 September</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-[#0F1D30] space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Departure from <b>PCTE College at 9:00 PM</b></span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Overnight journey by <b>Tempo Traveller</b> to Mussoorie</span>
                        </p>
                      </div>
                    </div>

                    {/* Day 2 Card */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="bg-[#156B77] text-white px-5 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm">
                        <span className="font-black uppercase tracking-wider">DAY 2</span>
                        <span className="text-teal-100 text-xs">12 September</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-[#0F1D30] space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>En-route visit to <b>Paonta Sahib</b></span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Arrival &amp; check-in at <b>Mussoorie hotel</b></span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Sightseeing at <b>Laal Tibba</b> and <b>Gun Hill Point</b></span>
                        </p>
                        <p className="flex items-start gap-2.5 text-purple-700 dark:text-purple-300 font-bold">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Evening <b>DJ Party</b> (Musical Evening) 🎵</span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Dinner and overnight stay at Mussoorie</span>
                        </p>
                      </div>
                    </div>

                    {/* Day 3 Card */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="bg-[#156B77] text-white px-5 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm">
                        <span className="font-black uppercase tracking-wider">DAY 3</span>
                        <span className="text-teal-100 text-xs">13 September</span>
                      </div>
                      <div className="p-5 bg-white dark:bg-[#0F1D30] space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Visit to <b>Kempty Waterfall</b></span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Local sightseeing at Mussoorie</span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-[#156B77] font-black">•</span>
                          <span>Departure from Mussoorie at <b>3:00 PM</b>, back to PCTE</span>
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Package Inclusions Box */}
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                      Package Inclusions
                    </h3>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                      <div className="py-2.5 flex items-center gap-3">
                        <FiCheck className="text-emerald-600 dark:text-emerald-400 text-base shrink-0" />
                        <span>1 Breakfast and 1 Dinner</span>
                      </div>
                      <div className="py-2.5 flex items-center gap-3">
                        <FiCheck className="text-emerald-600 dark:text-emerald-400 text-base shrink-0" />
                        <span>Quad Sharing Accommodation</span>
                      </div>
                      <div className="py-2.5 flex items-center gap-3">
                        <FiCheck className="text-emerald-600 dark:text-emerald-400 text-base shrink-0" />
                        <span>Transfers and Sightseeing by Tempo Traveller</span>
                      </div>
                      <div className="py-2.5 flex items-center gap-3">
                        <FiCheck className="text-emerald-600 dark:text-emerald-400 text-base shrink-0" />
                        <span>1 Night Stay with Musical Evening (DJ Party)</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Cost Gold Box */}
                  <div className="rounded-2xl bg-[#FFF8E7] dark:bg-amber-950/30 border border-[#F3E0B5] dark:border-amber-700/50 p-5 text-center shadow-sm">
                    <span className="text-xs uppercase font-bold text-amber-900 dark:text-amber-200 tracking-wider">
                      Package Cost
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F2942] dark:text-amber-300 mt-1">
                      INR 3,700 <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">per person</span>
                    </div>
                  </div>

                  {/* Important Notes Red Box */}
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-black text-red-700 dark:text-red-400 flex items-center gap-2">
                      <FiAlertTriangle /> Important Notes
                    </h3>
                    <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-5 space-y-3 text-xs sm:text-sm text-red-900 dark:text-red-200 font-medium">
                      <p className="flex items-start gap-2.5">
                        <span className="text-red-600 font-black">■</span>
                        <span><b>Seats are strictly limited to 47 students only</b> — no further seats will be extended.</span>
                      </p>
                      <p className="flex items-start gap-2.5">
                        <span className="text-red-600 font-black">■</span>
                        <span>Booking is on a <b>first-come, first-served basis</b>.</span>
                      </p>
                      <p className="flex items-start gap-2.5">
                        <span className="text-red-600 font-black">■</span>
                        <span><b>Seats can be booked by cash payment only, at the Accounts Section.</b></span>
                      </p>
                    </div>
                  </div>

                  {/* Official Help & Contact Strip */}
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 text-center text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>
                      For any queries, feel free to contact the <b>Tourism Department, HM Block</b>, or write to us at{' '}
                      <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-blue-600 dark:text-blue-400 font-bold underline">
                        {OFFICIAL_EMAIL}
                      </a>.
                    </p>
                    <p className="font-black text-red-600 dark:text-red-400 text-xs uppercase tracking-wider pt-1">
                      Hurry — seats are limited!
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Warm regards, <b>PCTE Travel Desk</b>
                    </p>
                  </div>

                </div>

                {/* Right Sticky Column: Registration & Direct Help */}
                <div className="lg:sticky lg:top-24 h-fit rounded-3xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
                  
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Excursion Fee</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        INR 3,700
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        3D / 2N All Inclusive
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/50">
                      ⚠️ 47 Seats Only · Cash Payment at Accounts Section
                    </div>
                  </div>

                  {/* Submit Student Registration */}
                  <button
                    onClick={() => setShowStudentModal(true)}
                    className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <FiSend size={16} /> Submit Student Registration
                  </button>

                  {/* Secondary Action: WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow transition-all duration-200"
                  >
                    <FaWhatsapp size={17} /> Query on WhatsApp
                  </a>

                  {/* Departure Points Strip */}
                  <div className="text-xs space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Departure Timing:</span>
                      <span className="text-slate-600 dark:text-slate-300">11 September at 9:00 PM sharp</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Reporting Point:</span>
                      <span className="text-slate-600 dark:text-slate-300">PCTE College Main Campus</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px]">Return Drop:</span>
                      <span className="text-slate-600 dark:text-slate-300">13 September (Depart Mussoorie 3:00 PM)</span>
                    </div>
                  </div>

                  {/* Contact Help */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-amber-500" />
                      <span>Direct Helpline: </span>
                      <a href={`tel:+91${PHONE_NUMBER}`} className="font-mono font-bold text-slate-900 dark:text-white hover:text-[#E11D48]">
                        {DISPLAY_PHONE}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMail className="text-amber-500" />
                      <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-[#E11D48] text-[11px] font-medium">
                        {OFFICIAL_EMAIL}
                      </a>
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* 2. ON-REQUEST VIEW FOR OTHER TOUR DESTINATIONS (NO FAKE BOOKINGS)         */
          /* ========================================================================= */
          <div className="space-y-8">
            
            {/* Gallery Preview Viewer */}
            <div className="space-y-3">
              <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden rounded-3xl shadow-md bg-slate-900">
                <img
                  src={galleryImages[activePhoto] || galleryImages[0]}
                  alt={pkg.title}
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied) return;
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="rounded-lg bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow border border-slate-700">
                      {pkg.tourType || pkg.category || 'Custom Tour'}
                    </span>
                    <span className="rounded-lg bg-amber-500/90 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase shadow">
                      Available On Request
                    </span>
                  </div>

                  <h1 className="font-display text-2xl md:text-4xl font-black text-white leading-tight">
                    {pkg.title}
                  </h1>
                </div>
              </div>

              {/* Thumbnail Selector Strip */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                      activePhoto === idx
                        ? 'border-[#0F2942] dark:border-amber-400 scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details & On-Request Layout */}
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Notice: Custom / On Request */}
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <FiClock /> Customized Group Tour (On Request Only)
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    This itinerary is organized exclusively on custom request for college departments, student batches, and private groups. Pricing and departure dates are tailored to group size.
                  </p>
                </div>

                {/* Quick Metrics Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <p className="flex items-center gap-1.5"><FiMapPin className="text-[#E11D48]" /> {pkg.destination}</p>
                  <p className="flex items-center gap-1.5"><FiCalendar className="text-[#E11D48]" /> {pkg.durationDays || 2} Days / {pkg.durationNights || 1} Nights</p>
                  <p className="flex items-center gap-1.5"><FaCar className="text-[#0F2942] dark:text-amber-400" /> Mode: <span className="font-semibold text-slate-900 dark:text-white">{pkg.travelMode || 'Tempo Traveller / Coach'}</span></p>
                  <p className="flex items-center gap-1.5"><FiClock className="text-amber-500" /> Availability: <span className="font-semibold text-blue-600 dark:text-blue-400">Custom Group Departures</span></p>
                </div>

                {/* Overview */}
                <div className="rounded-3xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Destination Overview</h2>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-xs md:text-sm">{pkg.description}</p>
                </div>

                {/* Highlights */}
                {pkg.facilities?.length > 0 && (
                  <div className="rounded-3xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                    <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">Key Package Highlights</h2>
                    <div className="flex flex-wrap gap-2">
                      {pkg.facilities.map((f) => (
                        <span key={f} className="flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <FiCheckCircle className="text-[#E11D48]" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions */}
                <div className="rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/20 p-5 border border-emerald-500/20 space-y-3">
                  <h3 className="font-display text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <FiCheck className="text-emerald-600" /> Typical Inclusions (Customizable)
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {(pkg.inclusions || ['Transfers from Punjab', 'Hotel / Resort Accommodation', 'Breakfast & Dinner', 'Local Sightseeing']).map((i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                        <FiCheck className="text-emerald-500 shrink-0 mt-0.5" /> <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Right Sticky Column: On Request Box */}
              <div className="lg:sticky lg:top-24 h-fit rounded-3xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
                
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Package Fare</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-black text-amber-500 uppercase tracking-wide">
                      On Request Only
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {pkg.durationDays || 2}D / {pkg.durationNights || 1}N
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Group quotes &amp; custom departure dates provided on request.
                  </p>
                </div>

                {/* Submit On Request Enquiry */}
                <button
                  onClick={() => setShowStudentModal(true)}
                  className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  <FiSend size={16} /> Request Custom Itinerary &amp; Quote
                </button>

                {/* WhatsApp Know More */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow transition-all duration-200"
                >
                  <FaWhatsapp size={17} /> Ask Details on WhatsApp
                </a>

                {/* Custom Group Plan Request */}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Custom Batch / Department Plan
                </button>

                {/* Promo Card to Mussoorie Scheduled Trip */}
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-3.5 border border-amber-300 dark:border-amber-700/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#E11D48] block">
                    ★ Next Confirmed Student Trip
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Mussoorie Trip (11 – 13 Sep)
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    INR 3,700 all-inclusive with Tempo Traveller &amp; DJ Party.
                  </p>
                  <Link
                    to="/packages/mussoorie-trip"
                    className="block text-center rounded-xl bg-[#0F2942] hover:bg-[#1B1464] text-white text-[11px] font-bold py-1.5 transition-colors"
                  >
                    View Mussoorie Itinerary &rarr;
                  </Link>
                </div>

                {/* Contact Helpline */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-amber-500" />
                    <span>Helpline: </span>
                    <a href={`tel:+91${PHONE_NUMBER}`} className="font-mono font-bold text-slate-900 dark:text-white hover:text-[#E11D48]">
                      {DISPLAY_PHONE}
                    </a>
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
      <StudentRegistrationModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        packageData={{
          title: isMussoorie ? 'Mussoorie Trip' : pkg.title,
          destination: isMussoorie ? 'Mussoorie, Uttarakhand' : pkg.destination,
          duration: isMussoorie ? '11 – 13 September (3 Days / 2 Nights)' : `${pkg.durationNights || 1} Night / ${pkg.durationDays || 2} Days`,
          price: isMussoorie ? 'INR 3,700 per person' : 'On Request',
        }}
        requestType={isMussoorie ? 'Booking Request' : 'On Request'}
      />
    </div>
  );
};

export default PackageDetails;
