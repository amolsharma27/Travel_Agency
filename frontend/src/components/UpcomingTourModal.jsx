import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiShield, FiUsers } from 'react-icons/fi';
import { FaWhatsapp, FaMountain, FaBus } from 'react-icons/fa';
import pcteLogo from '../assets/pcte-logo.png';
import mussoorieBg from '../assets/mussoorie-kempty-tour.jpg';

const WHATSAPP_NUMBER = '919988110021';
const PREFILLED_MESSAGE = encodeURIComponent(
  'Hello PCTE Travels, I am interested in the Mussoorie – Kempty Water Fall tour. Please provide me with more details.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MESSAGE}`;

const UpcomingTourModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show on mount after a subtle delay for smooth animation
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Lock and unlock body scroll smoothly
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={handleClose}
        >
          {/* Card Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#0B1727] text-white shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${mussoorieBg})` }}
            />

            {/* Gradient Overlays for Readability & Cinematic Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-[#0B1727]/80 to-[#0F2942]/65" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/90 via-[#0B1727]/60 to-transparent" />

            {/* Close Button (X) */}
            <button
              onClick={handleClose}
              aria-label="Close upcoming tour popup"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#E11D48] hover:scale-105 border border-white/20 transition-all duration-200 shadow-lg backdrop-blur-md"
            >
              <FiX className="text-xl sm:text-2xl" />
            </button>

            {/* Modal Body Content */}
            <div className="relative z-20 p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[500px] md:min-h-[540px]">
              
              {/* Top Header: PCTE Logo & Tour Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={pcteLogo}
                    alt="PCTE Logo"
                    className="h-9 sm:h-11 w-auto object-contain bg-white/95 rounded-lg p-1 shadow"
                  />
                  <div className="flex flex-col">
                    <span className="font-display font-black text-sm sm:text-base tracking-tight text-white leading-tight">
                      PCTE <span className="text-[#E11D48]">TRAVEL AGENCY</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                      Freedom To Evolve · Official Tour Desk
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg animate-pulse mr-12 sm:mr-0">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  UPCOMING TOUR
                </div>
              </div>

              {/* Center Hero Information */}
              <div className="my-6 max-w-2xl space-y-4">
                
                {/* Destination Tag */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-slate-200 border border-white/15">
                  <FiMapPin className="text-[#E11D48]" /> Mussoorie Hill Station & Kempty Waterfall, Uttarakhand
                </div>

                {/* Tour Title */}
                <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                  Mussoorie – Kempty Water Fall
                </h2>

                {/* Prominent Dates Tag */}
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-black px-4 py-1 text-xs shadow-lg border border-amber-300">
                    <FiCalendar className="text-slate-950 text-sm" />
                    Trip Dates: 11 Sep to 13 September
                  </span>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-xl drop-shadow">
                  Join fellow students and travelers on an unforgettable scenic getaway to Queen of the Hills departing on <b>11th September</b>. Experience the famous cascading Kempty Falls, Mall Road Mussoorie, mountain resort stay, bonfire night, and breathtaking Himalayan views.
                </p>

                {/* Key Package Highlights Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="rounded-xl bg-black/60 backdrop-blur-md p-2.5 border border-amber-400/50 text-center">
                    <span className="block text-[10px] text-amber-300 font-bold uppercase tracking-wider">Trip Dates</span>
                    <span className="font-display font-black text-xs sm:text-sm text-amber-300">11 – 13 Sep</span>
                  </div>

                  <div className="rounded-xl bg-black/40 backdrop-blur-md p-2.5 border border-white/10 text-center">
                    <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Special Fare</span>
                    <span className="font-display font-bold text-xs sm:text-sm text-white">INR 3800 <span className="text-[10px] font-normal text-slate-300">/ person</span></span>
                  </div>

                  <div className="rounded-xl bg-black/40 backdrop-blur-md p-2.5 border border-white/10 text-center">
                    <span className="block text-[10px] text-sky-300 font-bold uppercase tracking-wider">Travel Mode</span>
                    <span className="font-display font-bold text-xs sm:text-sm text-white">Deluxe AC Coach</span>
                  </div>

                  <div className="rounded-xl bg-black/40 backdrop-blur-md p-2.5 border border-white/10 text-center">
                    <span className="block text-[10px] text-rose-300 font-bold uppercase tracking-wider">Inclusions</span>
                    <span className="font-display font-bold text-xs sm:text-sm text-white">Stay + Meals + Guide</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-400" /> Kempty Waterfall Excursion
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-400" /> Mall Road & Gun Hill Visit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-400" /> Evening Bonfire & Music
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-400" /> Verified PCTE Tour Lead
                  </span>
                </div>
              </div>

              {/* Bottom Actions Area: Pricing and CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/15 bg-black/30 backdrop-blur-md rounded-2xl p-4 md:p-5">
                
                {/* Price Display */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300 border border-emerald-500/30">
                      All-Inclusive Student Package
                    </span>
                    <span className="text-xs text-slate-300 font-bold">1 Night / 2 Days</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400">
                      INR 3800
                    </span>
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">per person</span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3.5 text-sm font-black uppercase tracking-wider shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>Know More</span>
                  </a>

                  <button
                    onClick={handleClose}
                    className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-3.5 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    Browse Website
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpcomingTourModal;
