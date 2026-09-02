import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiPhone, FiCheck, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import pcteLogo from '../assets/pcte-logo.png';
import mussoorieBg from '../assets/mussoorie-kempty-tour.jpg';
import StudentRegistrationModal from './StudentRegistrationModal.jsx';

const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const WHATSAPP_NUMBER = '919988110021';
const PREFILLED_MESSAGE = encodeURIComponent(
  'Hello PCTE Travels, I am interested in the Mussoorie – Kempty Water Fall tour. Please provide me with more details.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MESSAGE}`;

const UpcomingTourHero = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const scrollToMainWebsite = () => {
    const el = document.getElementById('main-website');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const tourData = {
    title: 'Mussoorie – Kempty Water Fall',
    destination: 'Mussoorie & Kempty Falls, Uttarakhand',
    duration: '1 Night / 2 Days',
    price: 'INR 3800 per person',
  };

  return (
    <section className="relative h-screen min-h-[100dvh] w-full overflow-hidden bg-[#070D18] text-white flex flex-col justify-between select-none">
      
      {/* 1. CINEMATIC BACKGROUND WITH SLOW ZOOM EFFECT */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.07 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${mussoorieBg})` }}
      />

      {/* Atmospheric Multi-Layer Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/45 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80 pointer-events-none" />

      {/* 2. TOP HEADER BAR */}
      <header className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 px-4 sm:px-5 py-2 sm:py-2.5 shadow-xl">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src={pcteLogo}
              alt="PCTE Logo"
              className="h-7 sm:h-9 w-auto object-contain bg-white/95 rounded-lg p-1 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-xs sm:text-sm md:text-base tracking-tight text-white leading-tight">
                PCTE <span className="text-[#E11D48]">TRAVEL AGENCY</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                Freedom To Evolve · Tour Desk
              </span>
            </div>
          </div>

          {/* Right Actions: Phone Hotline & Skip/Explore Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:+91${PHONE_NUMBER}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1 text-xs font-mono font-bold text-slate-200 hover:text-amber-300 transition-colors"
            >
              <FiPhone className="text-amber-400 text-xs" />
              <span>{DISPLAY_PHONE}</span>
            </a>

            <button
              onClick={scrollToMainWebsite}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-1 text-xs font-bold text-slate-200 hover:text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <span>Explore Website</span>
              <FiChevronDown className="animate-bounce text-xs" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. CENTER HERO CONTENT */}
      <div className="relative z-20 mx-auto w-full max-w-4xl px-4 sm:px-6 my-auto text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#E11D48] px-3.5 py-1 text-[11px] sm:text-xs font-black uppercase tracking-widest text-white shadow-xl border border-red-400/40"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          UPCOMING TOUR
        </motion.div>

        {/* Tour Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] max-w-3xl"
        >
          Mussoorie – Kempty Water Fall
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-medium drop-shadow"
        >
          Queen of the Hills · Scenic Himalayan Group Getaway with Kempty Waterfall excursion, Mall Road, mountain resort stay, evening bonfire, and round-trip transfers from Punjab.
        </motion.p>

        {/* Tour Highlights Badges Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-2xl"
        >
          {/* Duration Card */}
          <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 text-center shadow-lg">
            <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5">
              Duration
            </span>
            <span className="font-display font-black text-xs sm:text-sm text-white">
              1 Night / 2 Days
            </span>
          </div>

          {/* Price Card */}
          <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 sm:p-3 border border-emerald-500/40 text-center shadow-lg">
            <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
              Tour Package Fare
            </span>
            <span className="font-display font-black text-xs sm:text-sm text-amber-400">
              INR 3800 <span className="text-[9px] sm:text-[10px] font-normal text-slate-300">/ person</span>
            </span>
          </div>

          {/* Travel Mode Card */}
          <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 text-center shadow-lg">
            <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-0.5">
              Transportation
            </span>
            <span className="font-display font-bold text-xs sm:text-sm text-white">
              AC Deluxe Coach
            </span>
          </div>

          {/* Hospitality Card */}
          <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 text-center shadow-lg">
            <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-0.5">
              Hospitality
            </span>
            <span className="font-display font-bold text-xs sm:text-sm text-white">
              Stay + Meals + Guide
            </span>
          </div>
        </motion.div>

        {/* 14. Action Buttons: [ Book Now ] and [ Know More ] */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* 1. Book Now Button -> Opens Student Registration & Booking Request */}
          <button
            onClick={() => setShowBookingModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105 border border-red-400/40 cursor-pointer"
          >
            <FiSend className="text-base sm:text-lg" />
            <span>Book Now</span>
          </button>

          {/* 2. Know More Button -> Opens WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105 border border-emerald-400/40"
          >
            <FaWhatsapp className="text-lg sm:text-xl" />
            <span>Know More</span>
          </a>

          {/* 3. Explore Website */}
          <button
            onClick={scrollToMainWebsite}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 text-xs font-bold tracking-wider backdrop-blur-md transition-all cursor-pointer"
          >
            <span>Explore Website</span>
            <FiChevronDown />
          </button>
        </motion.div>

      </div>

      {/* 4. BOTTOM BAR: ANIMATED "SCROLL TO EXPLORE" INDICATOR */}
      <footer className="relative z-20 pb-4 sm:pb-5 text-center flex flex-col items-center">
        <button
          onClick={scrollToMainWebsite}
          className="group inline-flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-amber-300 transition-colors">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white group-hover:border-amber-400 shadow-md"
          >
            <FiChevronDown className="text-sm text-amber-400" />
          </motion.div>
        </button>
      </footer>

      {/* Student Registration & Booking Request Modal */}
      <StudentRegistrationModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        packageData={tourData}
        requestType="Booking Request"
      />

    </section>
  );
};

export default UpcomingTourHero;
