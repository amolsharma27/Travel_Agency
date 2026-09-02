import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiCompass, FiSearch,
  FiMapPin, FiCalendar, FiUsers, FiSend, FiArrowRight
} from 'react-icons/fi';
import {
  FaWhatsapp, FaSuitcase, FaHotel, FaPlane, FaTrain,
  FaBus, FaHiking
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import mussoorieBg from '../assets/mussoorie-kempty-tour.jpg';
import heroSunsetMountains from '../assets/hero-sunset-mountains.jpg';
import StudentRegistrationModal from './StudentRegistrationModal.jsx';

const WHATSAPP_NUMBER = '919988110021';
const PREFILLED_MESSAGE = encodeURIComponent(
  'Hello PCTE Travels, I am interested in the Mussoorie – Kempty Water Fall tour. Please provide me with more details.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MESSAGE}`;
const SLIDE_DURATION = 6000; // 6 seconds (between 5 and 7 seconds)

const heroTabs = [
  { id: 'tours', label: 'Tours & Packages', icon: FaSuitcase, path: '/packages' },
  { id: 'stays', label: 'Stays & Resorts', icon: FaHotel, path: '/hotels' },
  { id: 'flights', label: 'Flights', icon: FaPlane, path: '/transportation' },
  { id: 'trains', label: 'Trains', icon: FaTrain, path: '/transportation' },
  { id: 'buses', label: 'Buses', icon: FaBus, path: '/transportation' },
  { id: 'activities', label: 'Activities', icon: FaHiking, path: '/activities' },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // 0 = Upcoming Tour, 1 = Main Search Portal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Search box state for Slide 2
  const [activeHeroTab, setActiveHeroTab] = useState('tours');
  const [heroSearchDest, setHeroSearchDest] = useState('');
  const [heroDate, setHeroDate] = useState('');
  const [heroTravellers, setHeroTravellers] = useState('2');
  const navigate = useNavigate();

  const totalSlides = 2;

  // 6-Second Automatic Slide Transition (5-7 seconds interval)
  useEffect(() => {
    if (showBookingModal || isTyping) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [showBookingModal, isTyping, totalSlides, currentSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (activeHeroTab === 'tours') {
      const params = new URLSearchParams();
      if (heroSearchDest) params.set('q', heroSearchDest);
      navigate(`/packages?${params.toString()}`);
    } else if (activeHeroTab === 'stays') {
      const params = new URLSearchParams();
      if (heroSearchDest) params.set('city', heroSearchDest);
      navigate(`/hotels?${params.toString()}`);
    } else if (activeHeroTab === 'activities') {
      const params = new URLSearchParams();
      if (heroSearchDest) params.set('q', heroSearchDest);
      navigate(`/activities?${params.toString()}`);
    } else {
      navigate('/transportation');
    }
  };

  const mussoorieTourData = {
    title: 'Mussoorie – Kempty Water Fall',
    destination: 'Mussoorie & Kempty Falls, Uttarakhand',
    duration: '1 Night / 2 Days',
    price: 'INR 3800 per person',
  };

  return (
    <div className="relative w-full h-[620px] sm:h-[650px] md:h-[680px] overflow-hidden bg-[#070D18] text-white select-none">

      <AnimatePresence mode="wait">
        {currentSlide === 0 ? (
          /* ========================================================================= */
          /* SLIDE 1: UPCOMING TOUR PROMOTION (MUSSOORIE & KEMPTY FALLS)               */
          /* ========================================================================= */
          <motion.div
            key="slide-upcoming"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8"
          >
            {/* Scenic Background */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.07 }}
              transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${mussoorieBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/50 to-black/90 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80 pointer-events-none" />

            {/* Slide Content */}
            <div className="relative z-10 mx-auto w-full max-w-4xl text-center flex flex-col items-center">
              
              {/* Upcoming Tour Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#E11D48] px-4 py-1 text-xs font-black uppercase tracking-widest text-white shadow-xl border border-red-400/40"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                UPCOMING TOUR
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] max-w-3xl"
              >
                Mussoorie – Kempty Water Fall
              </motion.h1>

              {/* Date & Location Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-black px-4 py-1 text-xs sm:text-sm shadow-xl border border-amber-300"
              >
                <FiCalendar className="text-slate-950 text-sm animate-pulse" />
                <span>Trip Dates: 11 Sep to 13 September</span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-medium drop-shadow"
              >
                Queen of the Hills · Scenic Himalayan Group Getaway departing on <b>11th September</b> with Kempty Waterfall excursion, Mall Road, mountain resort stay, evening bonfire, and round-trip transfers from Punjab.
              </motion.p>

              {/* 4 Feature Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-2xl"
              >
                <div className="rounded-xl bg-black/65 backdrop-blur-md p-2.5 sm:p-3 border border-amber-400/50 text-center shadow-lg">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                    Trip Dates
                  </span>
                  <span className="font-display font-black text-xs sm:text-sm text-amber-300">
                    11 Sep – 13 Sep
                  </span>
                </div>

                <div className="rounded-xl bg-black/55 backdrop-blur-md p-2.5 sm:p-3 border border-emerald-500/40 text-center shadow-lg">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                    Tour Package Fare
                  </span>
                  <span className="font-display font-black text-xs sm:text-sm text-amber-400">
                    INR 3800 <span className="text-[9px] sm:text-[10px] font-normal text-slate-300">/ person</span>
                  </span>
                </div>

                <div className="rounded-xl bg-black/55 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 text-center shadow-lg">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-0.5">
                    Transportation
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-white">
                    AC Deluxe Coach
                  </span>
                </div>

                <div className="rounded-xl bg-black/55 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 text-center shadow-lg">
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-0.5">
                    Hospitality
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-white">
                    Stay + Meals + Guide
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons: [ Book Now ] & [ Know More ] */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              >
                {/* 1. Book Now -> Student Registration Modal */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105 border border-red-400/40 cursor-pointer"
                >
                  <FiSend className="text-base" />
                  <span>Book Now</span>
                </button>

                {/* 2. Know More -> WhatsApp */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105 border border-emerald-400/40"
                >
                  <FaWhatsapp className="text-lg sm:text-xl" />
                  <span>Know More</span>
                </a>

                {/* 3. Switch to Main Search Portal */}
                <button
                  onClick={() => setCurrentSlide(1)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-3 text-xs font-bold tracking-wider backdrop-blur-md transition-all cursor-pointer"
                >
                  <span>Search Dashboard &rarr;</span>
                </button>
              </motion.div>

            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* SLIDE 2: MAIN PCTE TRAVEL PORTAL (SEARCH & DISCOVERY DASHBOARD)          */
          /* ========================================================================= */
          <motion.div
            key="slide-main-portal"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8"
          >
            {/* Mountain Sunset Background */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.07 }}
              transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${heroSunsetMountains})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1727]/80 via-[#0F2942]/65 to-[#0B1727]/90 pointer-events-none" />

            {/* Portal Content */}
            <div className="relative z-10 mx-auto w-full max-w-5xl text-center flex flex-col items-center">
              
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 border border-white/25 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-md"
              >
                <FiCompass /> Trusted North India &amp; National Tour Operator
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg max-w-4xl"
              >
                Your Journey, Our Expertise
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base text-slate-200 leading-relaxed font-medium drop-shadow"
              >
                Plan, book and experience your next journey with verified group departures, heritage stays, mobility logistics, and official passport assistance.
              </motion.p>

              {/* Interactive Search Dashboard Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 sm:mt-8 w-full max-w-4xl rounded-3xl bg-white/95 dark:bg-[#0F1D30]/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 sm:p-6 shadow-2xl text-slate-900 dark:text-white text-left"
              >
                {/* Search Tabs */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  {heroTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeHeroTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveHeroTab(tab.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#E11D48] text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="text-xs" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Form Inputs */}
                <form onSubmit={handleHeroSearch} className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  
                  {/* Destination Input */}
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Where do you want to go?
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-[#E11D48] text-xs" />
                      <input
                        type="text"
                        placeholder="e.g. Manali, Jibhi, Kashmir, Goa, Rajasthan..."
                        value={heroSearchDest}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                        onChange={(e) => setHeroSearchDest(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>
                  </div>

                  {/* Travel Date Input */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Travel Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3 text-[#E11D48] text-xs" />
                      <input
                        type="date"
                        value={heroDate}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                        onChange={(e) => setHeroDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>
                  </div>

                  {/* Travellers Select */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Travellers
                    </label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-3 text-[#E11D48] text-xs" />
                      <select
                        value={heroTravellers}
                        onChange={(e) => setHeroTravellers(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0F2942]"
                      >
                        <option value="1">1 Person (Solo)</option>
                        <option value="2">2 Persons (Couple/Friends)</option>
                        <option value="4">3-5 Persons (Group/Family)</option>
                        <option value="10">6+ Persons (College Group)</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="sm:col-span-2 sm:pt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white py-2.5 px-4 text-xs font-black uppercase tracking-wider shadow-lg transition-all"
                    >
                      <FiSearch />
                      <span>Search</span>
                    </button>
                  </div>

                </form>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* SLIDER NAVIGATION CONTROLS (ARROWS & PILL INDICATORS)                     */}
      {/* ========================================================================= */}

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg cursor-pointer"
      >
        <FiChevronLeft size={22} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg cursor-pointer"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Bottom Slider Pills & Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
        
        {/* Slide 1 Pill */}
        <button
          onClick={() => setCurrentSlide(0)}
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
            currentSlide === 0
              ? 'bg-[#E11D48] text-white border border-red-300/40 scale-105'
              : 'bg-black/50 hover:bg-black/70 text-slate-300 border border-white/15 backdrop-blur-md'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span>🔥 Mussoorie Tour (INR 3800)</span>
        </button>

        {/* Slide 2 Pill */}
        <button
          onClick={() => setCurrentSlide(1)}
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
            currentSlide === 1
              ? 'bg-[#0F2942] text-white border border-amber-400/40 scale-105'
              : 'bg-black/50 hover:bg-black/70 text-slate-300 border border-white/15 backdrop-blur-md'
          }`}
        >
          <span>🏔️ Search Tours &amp; Stays</span>
        </button>
      </div>

      {/* Student Registration Modal for Mussoorie Booking */}
      <StudentRegistrationModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        packageData={mussoorieTourData}
        requestType="Booking Request"
      />
    </div>
  );
};

export default HeroSlider;
