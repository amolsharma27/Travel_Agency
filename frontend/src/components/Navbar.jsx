import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiMoon, FiSun, FiPhone, FiMail, FiSearch,
  FiCompass, FiChevronDown, FiShield, FiMapPin, FiTruck,
  FiActivity, FiHome
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext.jsx';
import { getStoredPackages, getStoredHotels, getStoredActivities } from '../data/mockData.js';
import pcteLogo from '../assets/pcte-logo.png';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const OFFICIAL_EMAIL = 'amolsharma2705@gmail.com';
const WHATSAPP_NUMBER = '919988110021';
const DEFAULT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello PCTE Travels, I would like to enquire about travel packages.')}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [staysDropdownOpen, setStaysDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
    setToursDropdownOpen(false);
    setStaysDropdownOpen(false);
  }, [location.pathname]);

  const packages = getStoredPackages();
  const hotels = getStoredHotels();
  const activities = getStoredActivities();

  const filteredSearch = searchQuery.trim()
    ? [
        ...packages.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.destination.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(p => ({ ...p, itemType: 'Tour Package', url: `/packages/${p._id}` })),
        ...hotels.filter(h =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.city.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(h => ({ title: h.name, destination: h.city, images: h.images, _id: h._id, itemType: 'Stay', url: `/hotels/${h._id}` })),
        ...activities.filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.location.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(a => ({ title: a.title, destination: a.location, images: [a.image], _id: a._id, itemType: 'Activity', url: `/activities/${a._id}` }))
      ].slice(0, 6)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/packages?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* PCTE TOP CONTACT & HELPLINE BAR */}
      <div className="bg-[#0F2942] px-4 py-1.5 text-white border-b border-slate-700/50 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          
          {/* Left: Contact Numbers & Email */}
          <div className="flex items-center gap-3.5 text-slate-300 font-medium text-[11px] md:text-xs">
            <span className="hidden lg:inline text-slate-400 font-bold">PCTE Travel Desk:</span>
            <a
              href={`tel:+91${PHONE_NUMBER}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors font-mono font-bold"
            >
              <FiPhone className="text-amber-400" /> {DISPLAY_PHONE}
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="hidden sm:flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors"
            >
              <FiMail className="text-amber-400" /> {OFFICIAL_EMAIL}
            </a>
          </div>

          {/* Right: Social Media, Passport & WhatsApp */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-300">
            <a
              href="https://instagram.com/pctetravels"
              target="_blank"
              rel="noreferrer"
              title="Instagram @pctetravels"
              className="hidden md:flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <FaInstagram /> <span className="hidden xl:inline">@pctetravels</span>
            </a>
            <a
              href="https://facebook.com/pctetravels"
              target="_blank"
              rel="noreferrer"
              title="Facebook PCTE Travels"
              className="hidden md:flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FaFacebook /> <span className="hidden xl:inline">PCTE Travels</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link
              to="/passport-services"
              className="hidden sm:flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-bold"
            >
              <FiShield className="text-amber-400" /> Passport Help
            </Link>
            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <FaWhatsapp className="text-emerald-400" /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <nav
        className={`transition-all duration-200 border-b ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0B1727]/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-md py-2'
            : 'bg-white dark:bg-[#0B1727] border-slate-200 dark:border-slate-800 py-2.5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 gap-4">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={pcteLogo}
              alt="PCTE Logo"
              className="h-10 w-auto md:h-12 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="leading-none text-[#0F2942] dark:text-white font-black text-lg md:text-xl tracking-tight">
                  PCTE <span className="text-[#E11D48]">TRAVEL AGENCY</span>
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Freedom To Evolve · Tours · Stays · Passport
              </span>
            </div>
          </Link>

          {/* Quick Search Input (Desktop) */}
          <div className="relative hidden xl:block w-56">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search trips, stays, spots…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#0F2942] dark:focus:border-amber-400 focus:outline-none"
              />
              <FiSearch className="absolute left-2.5 top-2 text-slate-400 text-xs" />
            </form>

            {/* Quick Live Search Results Dropdown */}
            {showSearchResults && filteredSearch.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                  Search Matches
                </div>
                {filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                      navigate(item.url);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                  >
                    <img
                      src={item.images?.[0] || item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-10 w-10 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.itemType}
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{item.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-300">{item.destination}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Category Menu Links */}
          <div className="hidden items-center gap-5 lg:flex">
            
            {/* 1. Tours (with Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setToursDropdownOpen(true)}
              onMouseLeave={() => setToursDropdownOpen(false)}
            >
              <NavLink
                to="/packages"
                className={({ isActive }) =>
                  `flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1 transition-colors ${
                    isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                  }`
                }
              >
                Tours <FiChevronDown size={13} className="text-slate-400" />
              </NavLink>

              {toursDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-2xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 space-y-1">
                  <Link
                    to="/packages?category=Group+Tours"
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>👥 Group Tour Packages</span>
                    <span className="text-[10px] text-amber-500 font-bold">Popular</span>
                  </Link>
                  <Link
                    to="/packages?category=Nearby+Getaways"
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>🚗 Nearby Weekend Getaways</span>
                    <span className="text-[10px] text-amber-500 font-bold">1-3 Days</span>
                  </Link>
                  <Link
                    to="/packages?category=Private+Tours"
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>🚗 Individual / Private Tours</span>
                    <span className="text-[10px] text-slate-400">Custom</span>
                  </Link>
                  <Link
                    to="/packages?category=Adventure+Tours"
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>🏔️ Adventure &amp; Treks</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Spiti &amp; Rishikesh</span>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <Link
                      to="/packages"
                      className="block text-center rounded-xl p-2 text-xs font-bold text-[#E11D48] hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      View All Tour Packages &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Stays */}
            <div
              className="relative"
              onMouseEnter={() => setStaysDropdownOpen(true)}
              onMouseLeave={() => setStaysDropdownOpen(false)}
            >
              <NavLink
                to="/hotels"
                className={({ isActive }) =>
                  `flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1 transition-colors ${
                    isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                  }`
                }
              >
                Stays <FiChevronDown size={13} className="text-slate-400" />
              </NavLink>

              {staysDropdownOpen && (
                <div className="absolute top-full left-0 w-60 rounded-2xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 space-y-1">
                  <Link to="/hotels?category=Hotels" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🏨 Luxury &amp; Heritage Hotels
                  </Link>
                  <Link to="/hotels?category=Resorts" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🌴 Mountain &amp; Beach Resorts
                  </Link>
                  <Link to="/hotels?category=Homestays" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🏡 Traditional Wooden Homestays
                  </Link>
                  <Link to="/hotels?category=Hostels" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🎒 Backpacker Hostels &amp; Dorms
                  </Link>
                  <Link to="/hotels?category=Camping" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    ⛺ Riverside Swiss Camps
                  </Link>
                  <Link to="/hotels?category=Villas" className="block rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🏡 Private Villas &amp; Apartments
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Transportation */}
            <NavLink
              to="/transportation"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48] pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                }`
              }
            >
              Transportation
            </NavLink>

            {/* 4. Activities */}
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48] pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                }`
              }
            >
              Activities
            </NavLink>

            {/* 5. Passport Services */}
            <NavLink
              to="/passport-services"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48] pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                }`
              }
            >
              Passport Services
            </NavLink>
          </div>

          {/* Quick Enquire CTA & Theme Toggle (No Login / Sign In) */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Direct WhatsApp Enquiry Button */}
            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              <FaWhatsapp size={15} />
              <span>Enquire Now</span>
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:+91${PHONE_NUMBER}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-[#0F2942] px-3 py-2 text-xs font-bold shadow-sm transition-colors"
            >
              <FiPhone size={13} className="text-[#E11D48]" />
              <span className="font-mono">{DISPLAY_PHONE}</span>
            </a>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggle} className="p-2 text-slate-700 dark:text-slate-200">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-800 dark:text-white"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE RESPONSIVE DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#0F2942] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src={pcteLogo} alt="PCTE Logo" className="h-8 w-auto object-contain" />
                  <span className="font-display text-xs font-black text-[#0F2942] dark:text-white">
                    PCTE Travel Agency
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-300"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search trips, stays..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <FiSearch className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                </form>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2 flex-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Link to="/" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiHome className="text-[#E11D48]" /> Home
                </Link>
                <Link to="/packages" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiCompass className="text-[#E11D48]" /> Tours &amp; Holiday Packages
                </Link>
                <Link to="/hotels" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiHome className="text-[#E11D48]" /> Stays, Hotels &amp; Resorts
                </Link>
                <Link to="/transportation" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiTruck className="text-[#E11D48]" /> Transportation (Flights/Trains/Buses)
                </Link>
                <Link to="/activities" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiActivity className="text-[#E11D48]" /> Activities &amp; Adventures
                </Link>
                <Link to="/nearby-getaways" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiMapPin className="text-[#E11D48]" /> Nearby Getaways (From Punjab)
                </Link>
                <Link to="/passport-services" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800 text-amber-500">
                  <FiShield className="text-amber-400" /> Passport Application Assistance
                </Link>
                <Link to="/about" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiCompass className="text-[#E11D48]" /> About PCTE Travels
                </Link>
                <Link to="/contact" className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <FiPhone className="text-[#E11D48]" /> Contact &amp; Support Desk
                </Link>
              </div>

              {/* Direct Enquiry Footer (Replacing Login/Register) */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Travel Support</p>
                <a
                  href={DEFAULT_WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow"
                >
                  <FaWhatsapp size={16} /> WhatsApp Enquiry
                </a>
                <a
                  href={`tel:+91${PHONE_NUMBER}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 text-xs font-bold text-slate-800 dark:text-slate-100"
                >
                  <FiPhone className="text-[#E11D48]" /> Call {DISPLAY_PHONE}
                </a>
                <a
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  className="block text-center text-[11px] text-slate-500 dark:text-slate-400 hover:text-amber-400 pt-1"
                >
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
