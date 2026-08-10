import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiMoon, FiSun, FiUser, FiPhone, FiMail, FiSearch, FiCompass, FiChevronDown, FiShield, FiCalendar
} from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import CustomTourModal from './CustomTourModal.jsx';
import { getStoredPackages } from '../data/mockData.js';

const dashboardPathFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'agency') return '/agency';
  return '/dashboard';
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const packages = getStoredPackages();
  const filteredSearch = searchQuery.trim()
    ? packages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-300">
        {/* CLIFFSEAS TOP BAR STRIP */}
        <div className="bg-[#1c385e] px-4 py-2 text-white border-b border-slate-700/60 text-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            {/* Left Phone & Email */}
            <div className="flex flex-wrap items-center gap-4 text-slate-200 font-medium">
              <a href="tel:9996696928" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                <FiPhone className="text-amber-400" /> +91 99966 96928
              </a>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <a href="tel:9468312343" className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                <FiPhone className="text-amber-400" /> +91 94683 12343
              </a>
              <span className="hidden text-slate-600 md:inline">|</span>
              <a href="mailto:info@travelstay.com" className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                <FiMail className="text-amber-400" /> info@travelstay.com
              </a>
            </div>

            {/* Right Social & Search */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative hidden lg:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-48 rounded-full border border-slate-600 bg-slate-800/90 py-1 pl-7 pr-3 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                  <FiSearch className="absolute left-2.5 top-1.5 text-slate-400 text-xs" />
                </form>

                {showSearchResults && filteredSearch.length > 0 && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-50">
                    {filteredSearch.map(pkg => (
                      <div
                        key={pkg._id}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                          navigate(`/packages/${pkg._id}`);
                        }}
                        className="flex items-center gap-2.5 p-2.5 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50 last:border-0"
                      >
                        <img src={pkg.images[0]} alt={pkg.title} className="h-9 w-9 rounded-lg object-cover" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{pkg.title}</p>
                          <p className="text-[10px] text-amber-400">{pkg.destination} · ₹{pkg.discountPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <a href="https://wa.me/919996696928" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  <FaWhatsapp size={15} />
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <FaInstagram size={15} />
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <FaFacebook size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CLIFFSEAS STICKY NAVBAR */}
        <nav className={`transition-all duration-300 border-b border-slate-200 dark:border-slate-800 ${
          scrolled 
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-2.5' 
            : 'bg-white dark:bg-slate-900 py-3.5'
        }`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 font-display tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e0882e] to-amber-600 text-white font-black shadow-md text-lg">
                TS
              </div>
              <div className="flex flex-col">
                <span className="leading-none text-slate-900 dark:text-white font-black text-xl tracking-tight">
                  Travel<span className="text-[#e0882e]">Stay</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Expeditions &amp; Holiday Tours
                </span>
              </div>
            </Link>

            {/* Main Menu Links (Cliffseas Style) */}
            <div className="hidden items-center gap-7 lg:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                About Us
              </NavLink>

              <NavLink
                to="/packages?category=Educational+Journeys"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                Educational Journeys
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                Gallery
              </NavLink>

              {/* Tours Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setToursDropdownOpen(true)}
                onMouseLeave={() => setToursDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-[#e0882e] py-1">
                  Tours <FiChevronDown className="text-[#e0882e]" />
                </button>

                {toursDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                    <Link
                      to="/packages?category=Weekend+Tours"
                      className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-[#FDF7F0] dark:hover:bg-slate-800 text-xs font-bold text-[#e0882e]"
                    >
                      ⚡ Every Friday Weekend Tours
                    </Link>
                    <Link
                      to="/packages?q=Himachal"
                      className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800"
                    >
                      🏔️ Himachal Tours (Jibhi &amp; Spiti)
                    </Link>
                    <Link
                      to="/packages?q=Punjab"
                      className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800"
                    >
                      🕌 Punjab Tours (Amritsar)
                    </Link>
                    <Link
                      to="/packages?q=Rajasthan"
                      className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800"
                    >
                      🏰 Rajasthan Royal Tours
                    </Link>
                    <Link
                      to="/packages?q=Uttarakhand"
                      className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800"
                    >
                      🌊 Uttarakhand Rafting &amp; Treks
                    </Link>
                  </div>
                )}
              </div>

              <NavLink
                to="/hotels"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                Hotels
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#e0882e] ${
                    isActive ? 'text-[#e0882e] font-extrabold border-b-2 border-[#e0882e] pb-1' : 'text-slate-800 dark:text-slate-200'
                  }`
                }
              >
                Contact Us
              </NavLink>
            </div>

            {/* Cliffseas Style Orange Action Button & User Controls */}
            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
              </button>

              <Link
                to="/packages"
                className="rounded-md bg-[#e0882e] hover:bg-white text-white hover:text-[#e0882e] border border-[#e0882e] px-5 py-2 text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all duration-300"
              >
                Book Now
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={dashboardPathFor(user.role)}
                    className="flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#e0882e]"
                  >
                    <FiUser /> {user.name ? user.name.split(' ')[0] : 'Account'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-red-500"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#e0882e] px-2"
                >
                  Log In / Sign Up
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/packages"
                className="rounded-md bg-[#e0882e] px-3 py-1.5 text-xs font-bold text-white shadow"
              >
                Book Now
              </Link>
              <button onClick={toggle} className="p-2 text-slate-700 dark:text-slate-200">
                {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1 text-slate-800 dark:text-white">
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE SLIDE-OUT MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-0 z-50 bg-white dark:bg-slate-900 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  TravelStay Navigation
                </span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <Link
                  to="/packages"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-md bg-[#e0882e] py-3 text-center text-sm font-bold text-white shadow-lg"
                >
                  Book Now
                </Link>

                <div className="flex flex-col gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                  <Link to="/" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    Home
                  </Link>
                  <Link to="/about" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    About Us
                  </Link>
                  <Link to="/packages?category=Weekend+Tours" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5 text-[#e0882e]">
                    Every Friday Weekend Tours
                  </Link>
                  <Link to="/packages?category=Educational+Journeys" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    Educational Journeys
                  </Link>
                  <Link to="/packages" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    All Tours
                  </Link>
                  <Link to="/hotels" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    Hotels &amp; Stays
                  </Link>
                  <Link to="/contact" onClick={() => setOpen(false)} className="border-b border-slate-100 dark:border-slate-800 py-2.5">
                    Contact Us
                  </Link>
                </div>

                {user ? (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <Link to={dashboardPathFor(user.role)} onClick={() => setOpen(false)} className="block text-base font-bold text-slate-800 dark:text-slate-200">
                      Dashboard ({user.role})
                    </Link>
                    <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="text-base font-bold text-red-500">
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                    <Link to="/login" onClick={() => setOpen(false)} className="w-1/2 text-center rounded-md border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-bold text-slate-800 dark:text-white">
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="w-1/2 text-center rounded-md bg-[#e0882e] py-2.5 text-sm font-bold text-white shadow-md">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
    </>
  );
};

export default Navbar;
