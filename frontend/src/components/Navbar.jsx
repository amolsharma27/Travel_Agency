import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiMoon, FiSun, FiUser, FiPhone, FiMail, FiSearch,
  FiCompass, FiChevronDown, FiShield, FiCalendar, FiMapPin,
  FiFileText, FiTruck, FiActivity, FiHome, FiHeart, FiLogOut, FiAward,
  FiArrowLeft, FiGrid
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook, FaSuitcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { getStoredPackages, getStoredHotels, getStoredActivities } from '../data/mockData.js';
import pcteLogo from '../assets/pcte-logo.png';

const dashboardPathFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'agency') return '/agency';
  return '/dashboard';
};

const roleBadgeName = {
  admin: 'Super Admin',
  agency: 'Agency Partner',
  customer: 'Explorer Member'
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [staysDropdownOpen, setStaysDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
    setUserDropdownOpen(false);
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
        ).map(h => ({ title: h.name, destination: h.city, discountPrice: h.startingPrice, images: h.images, _id: h._id, itemType: 'Stay', url: `/hotels/${h._id}` })),
        ...activities.filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.location.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(a => ({ title: a.title, destination: a.location, discountPrice: a.discountPrice, images: [a.image], _id: a._id, itemType: 'Activity', url: `/activities/${a._id}` }))
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/packages?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/agency') || 
                           location.pathname.startsWith('/admin');

  if (isDashboardRoute) {
    const portalBadge = location.pathname.startsWith('/agency')
      ? 'Agency Management Portal'
      : location.pathname.startsWith('/admin')
      ? 'Admin Operations Console'
      : 'Customer Account Portal';

    return (
      <header className="sticky top-0 z-50 transition-all duration-200 bg-white/95 dark:bg-[#0B1727]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 gap-4">
          
          {/* Brand & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={pcteLogo}
                alt="PCTE Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="leading-tight text-[#0F2942] dark:text-white font-black text-base md:text-lg tracking-tight">
                  PCTE <span className="text-[#E11D48]">TRAVEL AGENCY</span>
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {portalBadge}
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {roleBadgeName[user?.role] || 'Portal Active'}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* User Account / Profile Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0F2942] bg-white dark:bg-slate-800 shadow-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-xs font-black uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="leading-tight text-xs font-bold truncate max-w-[100px]">{user.name}</span>
                    <span className="text-[9px] text-[#E11D48] font-bold uppercase">{roleBadgeName[user.role] || 'Member'}</span>
                  </div>
                  <FiChevronDown size={13} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {roleBadgeName[user.role] || 'Member'}
                      </span>
                    </div>

                    <Link
                      to="/"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <FiHome size={14} className="text-[#E11D48]" /> Main Website / Storefront
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full text-left rounded-lg p-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <FiLogOut size={14} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 transition-all duration-200">
      {/* PCTE TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="bg-[#0F2942] px-4 py-1.5 text-white border-b border-slate-700/50 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          
          {/* Left: Contact Numbers & Email */}
          <div className="flex items-center gap-3.5 text-slate-300 font-medium text-[11px] md:text-xs">
            <span className="hidden lg:inline text-slate-400 font-bold">PCTE Travel Desk:</span>
            <a href="tel:9814519578" className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors font-mono">
              <FiPhone className="text-amber-400" /> +91 98145 19578
            </a>
            <span className="text-slate-600">/</span>
            <a href="tel:9988110021" className="hidden sm:flex items-center gap-1 text-slate-200 hover:text-white transition-colors font-mono">
              +91 99881 10021
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <a href="mailto:amolsharma2705@gmail.com" className="hidden md:flex items-center gap-1 text-slate-200 hover:text-white transition-colors">
              <FiMail className="text-amber-400" /> amolsharma2705@gmail.com
            </a>
          </div>

          {/* Right: Social Media, Passport & WhatsApp */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-300">
            <a
              href="https://instagram.com/amol_sharma_27"
              target="_blank"
              rel="noreferrer"
              title="Instagram @amol_sharma_27"
              className="hidden sm:flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <FaInstagram /> <span className="hidden xl:inline">@amol_sharma_27</span>
            </a>
            <a
              href="https://facebook.com/amol.sharma.27"
              target="_blank"
              rel="noreferrer"
              title="Facebook Amol Sharma"
              className="hidden sm:flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FaFacebook /> <span className="hidden xl:inline">Amol Sharma</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link to="/passport-services" className="hidden sm:flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-bold">
              <FiShield className="text-amber-400" /> Passport Help
            </Link>
            <a
              href="https://wa.me/919814519578?text=Hi%20PCTE%20Travel%20Agency%2C%20I%20need%20assistance%20with%20travel%20booking"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <FaWhatsapp /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <nav className={`transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B1727]/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-md py-2'
          : 'bg-white dark:bg-[#0B1727] border-slate-200 dark:border-slate-800 py-2.5'
      }`}>
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
              <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
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
                    <img src={item.images?.[0]} alt={item.title} className="h-10 w-10 rounded-lg object-cover bg-slate-900" />
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.itemType}
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{item.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-300">{item.destination} · ₹{item.discountPrice?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Category Menu Links (6 Core Categories) */}
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
                <div className="absolute top-full left-0 w-64 rounded-xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 space-y-1">
                  <Link
                    to="/packages?category=Group+Tours"
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>👥 Group Tour Packages</span>
                    <span className="text-[10px] text-amber-500 font-bold">Popular</span>
                  </Link>
                  <Link
                    to="/packages?category=Private+Tours"
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>🚗 Individual / Private Tours</span>
                    <span className="text-[10px] text-slate-400">Custom</span>
                  </Link>
                  <Link
                    to="/packages?category=Adventure+Tours"
                    className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>🏔️ Adventure &amp; Treks</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Spiti &amp; Rishikesh</span>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <Link
                      to="/packages"
                      className="block text-center rounded-lg p-2 text-xs font-bold text-[#E11D48] hover:bg-red-50 dark:hover:bg-red-950/30"
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
                <div className="absolute top-full left-0 w-60 rounded-xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 space-y-1">
                  <Link to="/hotels?category=Hotels" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🏨 Luxury &amp; Heritage Hotels
                  </Link>
                  <Link to="/hotels?category=Resorts" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🌴 Mountain &amp; Beach Resorts
                  </Link>
                  <Link to="/hotels?category=Homestays" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🏡 Traditional Wooden Homestays
                  </Link>
                  <Link to="/hotels?category=Hostels" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    🎒 Backpacker Hostels &amp; Dorms
                  </Link>
                  <Link to="/hotels?category=Camping" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    ⛺ Riverside Swiss Camps
                  </Link>
                  <Link to="/hotels?category=Villas" className="block rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
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

            {/* 5. Nearby Getaways */}
            <NavLink
              to="/nearby-getaways"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#E11D48] border-b-2 border-[#E11D48] pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-[#E11D48]'
                }`
              }
            >
              Nearby Getaways
            </NavLink>

            {/* 6. Passport Services */}
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

          {/* User Controls & Book CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Quick Portal Switcher Button for Logged-in Users */}
            {user && (
              <Link
                to={dashboardPathFor(user.role)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1E3A5F] text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:scale-105 border border-slate-700"
                title={`Open ${roleBadgeName[user.role] || 'Dashboard'}`}
              >
                {user.role === 'agency' ? (
                  <>
                    <FiGrid size={13} className="text-amber-400" />
                    <span>Agency Portal</span>
                  </>
                ) : user.role === 'admin' ? (
                  <>
                    <FiShield size={13} className="text-red-400" />
                    <span>Admin Console</span>
                  </>
                ) : (
                  <>
                    <FiUser size={13} className="text-emerald-400" />
                    <span>My Dashboard</span>
                  </>
                )}
              </Link>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* User Account Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0F2942] bg-slate-50 dark:bg-slate-800/80 shadow-sm"
                >
                  <div className="h-6 w-6 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="leading-tight truncate max-w-[90px]">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                    <span className="text-[9px] text-[#E11D48] font-bold uppercase">{roleBadgeName[user.role] || 'Member'}</span>
                  </div>
                  <FiChevronDown size={13} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {roleBadgeName[user.role] || 'Member'}
                      </span>
                    </div>

                    <Link
                      to={dashboardPathFor(user.role)}
                      className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <FiUser size={14} className="text-[#0F2942] dark:text-amber-400" /> 
                      {user.role === 'admin' ? 'Admin Analytics & Ops' : user.role === 'agency' ? 'Agency Portal' : 'My Profile & Account'}
                    </Link>

                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/dashboard/bookings"
                          className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <FiCalendar size={14} className="text-emerald-500" /> My Bookings &amp; Tickets
                        </Link>
                        <Link
                          to="/dashboard/wishlist"
                          className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <FiHeart size={14} className="text-rose-500" /> Saved Wishlist
                        </Link>
                      </>
                    )}

                    {user.role === 'agency' && (
                      <Link
                        to="/agency/packages"
                        className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <FiCompass size={14} className="text-amber-500" /> Manage Packages
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/listings"
                        className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <FiShield size={14} className="text-red-500" /> Moderate Listings
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full text-left rounded-lg p-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <FiLogOut size={14} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0F2942]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-[#E11D48] hover:bg-[#BE123C] text-white px-3.5 py-1.5 text-xs font-bold shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggle} className="p-2 text-slate-700 dark:text-slate-200">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-800 dark:text-white"
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
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
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
                <button onClick={() => setOpen(false)} className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-300">
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
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <FiSearch className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                </form>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-3 flex-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Link to="/" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiHome className="text-[#E11D48]" /> Home
                </Link>
                <Link to="/packages" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiCompass className="text-[#E11D48]" /> Tours &amp; Holiday Packages
                </Link>
                <Link to="/hotels" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiHome className="text-[#E11D48]" /> Stays, Hotels &amp; Resorts
                </Link>
                <Link to="/transportation" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiTruck className="text-[#E11D48]" /> Transportation (Flights/Trains/Buses/Cabs)
                </Link>
                <Link to="/activities" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiActivity className="text-[#E11D48]" /> Activities &amp; Adventures
                </Link>
                <Link to="/nearby-getaways" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiMapPin className="text-[#E11D48]" /> Nearby Getaways (From Punjab)
                </Link>
                <Link to="/passport-services" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800 text-amber-500">
                  <FiShield className="text-amber-400" /> Passport Application Assistance
                </Link>
                <Link to="/contact" className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800">
                  <FiPhone className="text-[#E11D48]" /> Contact &amp; Support
                </Link>
              </div>

              {/* User / Auth footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {user ? (
                  <>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <Link
                      to={dashboardPathFor(user.role)}
                      className="block w-full text-center rounded-md bg-[#0F2942] py-2 text-xs font-bold text-white shadow"
                    >
                      Go to Dashboard ({roleBadgeName[user.role]})
                    </Link>
                    <button
                      onClick={() => { logout(); setOpen(false); navigate('/'); }}
                      className="block w-full text-center py-1.5 text-xs font-bold text-red-500"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="flex-1 text-center rounded-md border border-slate-300 dark:border-slate-700 py-2 text-xs font-bold text-slate-800 dark:text-white"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center rounded-md bg-[#E11D48] py-2 text-xs font-bold text-white shadow"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
