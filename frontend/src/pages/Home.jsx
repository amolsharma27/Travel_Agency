import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiCalendar, FiUsers, FiSend, FiTag, FiCompass, FiShield, FiHeart, FiGlobe, FiCamera, FiStar
} from 'react-icons/fi';
import { FaHotel, FaSuitcaseRolling, FaTrain, FaBus, FaTaxi, FaQuoteLeft } from 'react-icons/fa';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { getStoredHotels, getStoredPackages, mockPreviousTripGallery } from '../data/mockData.js';

const tabs = [
  { key: 'packages', label: 'Holiday Packages', icon: FaSuitcaseRolling, comingSoon: false },
  { key: 'hotels', label: 'Hotels & Stays', icon: FaHotel, comingSoon: false },
  { key: 'flights', label: 'Flights', icon: FiSend, comingSoon: true },
  { key: 'trains', label: 'Trains', icon: FaTrain, comingSoon: true },
  { key: 'bus', label: 'Bus', icon: FaBus, comingSoon: true },
  { key: 'cabs', label: 'Cabs', icon: FaTaxi, comingSoon: true },
];

const domesticDestinations = [
  { name: 'Kashmir', query: 'Srinagar', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80', subText: 'Shikara Rides & Snow Hills' },
  { name: 'Goa', query: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', subText: 'Sun, Sand & Nightlife' },
  { name: 'Kerala', query: 'Kerala', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80', subText: 'Houseboats & Tea Gardens' },
  { name: 'Rishikesh', query: 'Rishikesh', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80', subText: 'River Rafting & Aarti' },
  { name: 'Rajasthan', query: 'Jaipur', image: 'https://images.unsplash.com/photo-1477584322813-fc84eae5c3e7?auto=format&fit=crop&w=600&q=80', subText: 'Palace Heritage & Forts' },
  { name: 'Himachal', query: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', subText: 'Adventure & Pine Valleys' },
];

const whyChooseUs = [
  { title: 'Verified Stays & Tours', desc: 'Every hotel, camp, and agency is verified by travel experts before going live.', icon: FiShield },
  { title: 'Affordable Price Guarantee', desc: 'Zero hidden markup fees. Budget packages starting from ₹2,499 and stays from ₹699.', icon: FiTag },
  { title: 'Super Easy Booking', desc: 'Book verified stays, promo deals, and custom tour itineraries in minutes.', icon: FiCompass },
  { title: '24/7 Dedicated Care', desc: 'A dedicated tour coordinator manages your journey from pickup to departure.', icon: FiHeart },
];

const categories = ['All', 'Adventure', 'Beach', 'Honeymoon', 'Cultural', 'Pilgrimage', 'Historical'];

const Home = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [city, setCity] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [hotelsRes, packagesRes] = await Promise.all([
          api.get('/hotels', { params: { limit: 4, sort: 'rating_desc' } }),
          api.get('/packages', { params: { limit: 12, sort: 'popular' } }),
        ]);
        if (hotelsRes.data?.data && hotelsRes.data.data.length > 0) {
          setFeaturedHotels(hotelsRes.data.data);
        } else {
          setFeaturedHotels(getStoredHotels().slice(0, 4));
        }

        if (packagesRes.data?.data && packagesRes.data.data.length > 0) {
          setPopularPackages(packagesRes.data.data);
        } else {
          setPopularPackages(getStoredPackages());
        }
      } catch (err) {
        setFeaturedHotels(getStoredHotels().slice(0, 4));
        setPopularPackages(getStoredPackages());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = () => {
    if (activeTab === 'hotels') {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      if (checkIn) params.set('checkIn', checkIn);
      if (checkOut) params.set('checkOut', checkOut);
      if (guests) params.set('guests', guests);
      navigate(`/hotels?${params.toString()}`);
    } else if (activeTab === 'packages') {
      const params = new URLSearchParams();
      if (destination) params.set('q', destination);
      navigate(`/packages?${params.toString()}`);
    }
  };

  const handleDestinationClick = (query) => {
    navigate(`/packages?q=${encodeURIComponent(query)}`);
  };

  // Filter packages based on category tab selection
  const filteredPackages = activeCategory === 'All'
    ? popularPackages.slice(0, 4)
    : popularPackages.filter(pkg => pkg.category?.toLowerCase() === activeCategory.toLowerCase()).slice(0, 4);

  return (
    <div className="bg-paper text-ink dark:bg-ink dark:text-paper min-h-screen">
      
      {/* HERO SECTION WITH ULTRA-PREMIUM BACKGROUND IMAGE */}
      <section className="relative overflow-hidden bg-slate-950 pb-40 pt-24 text-white md:pb-48 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Cinematic Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90 backdrop-blur-[1px]" />

        <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md border border-emerald-400/30 shadow-lg"
          >
            <FiGlobe className="text-emerald-400" /> Direct Local Prices · Zero Hidden Fees
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-white drop-shadow-md"
          >
            Explore India’s Beauty, <br />
            <span className="bg-gradient-to-r from-amber-300 via-sand-300 to-emerald-300 bg-clip-text text-transparent">
              Affordable & Memorable.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-200 md:text-lg leading-relaxed drop-shadow"
          >
            Curated tour itineraries, boutique mountain stays, and backwater houseboats.
            Book verified travel escapes from <span className="font-bold text-amber-300">₹2,499</span> and pocket-friendly stays from <span className="font-bold text-emerald-300">₹699</span>.
          </motion.p>

          {/* Quick Value Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-white/90">
            <span className="rounded-full bg-black/40 px-3.5 py-1 backdrop-blur-md border border-white/10">
              ⚡ Instant 1-Click Booking
            </span>
            <span className="rounded-full bg-black/40 px-3.5 py-1 backdrop-blur-md border border-white/10">
              🛡️ 100% Hand-Inspected Stays
            </span>
            <span className="rounded-full bg-black/40 px-3.5 py-1 backdrop-blur-md border border-white/10">
              ⭐ 4.9★ Rated by 18,500+ Travelers
            </span>
          </div>
        </div>
      </section>

      {/* SEARCH WIDGET — Overlaps hero */}
      <section className="relative z-10 mx-auto -mt-24 max-w-5xl px-5 md:-mt-28 md:px-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-2xl border border-ink/10 dark:border-paper/10 backdrop-blur-lg">
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-ink/5 dark:border-paper/10 px-2 pb-2.5 pt-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => !tab.comingSoon && setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-md'
                    : tab.comingSoon
                    ? 'cursor-not-allowed text-ink/30 dark:text-paper/30'
                    : 'text-ink/60 hover:text-emerald-600 dark:text-paper/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
                {tab.comingSoon && <span className="ml-1 rounded-full bg-ink/5 dark:bg-paper/10 px-1.5 py-0.5 text-[9px] font-bold">Soon</span>}
              </button>
            ))}
          </div>

          <div className="grid gap-3 p-3 mt-2 md:grid-cols-[2fr_1.2fr_1.2fr_1fr_auto]">
            {activeTab === 'hotels' && (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-ink/10 dark:border-paper/20 px-3 py-3 bg-slate-50 dark:bg-slate-800/50">
                  <FiMapPin className="text-emerald-500 shrink-0" />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Where are you staying? (e.g., Manali, Goa...)"
                    className="w-full bg-transparent text-sm outline-none text-ink dark:text-paper"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-ink/10 dark:border-paper/20 px-3 py-3 bg-slate-50 dark:bg-slate-800/50">
                  <FiCalendar className="text-emerald-500 shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <span className="text-[9px] text-ink/50 dark:text-paper/50 -mb-0.5">Check In</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs outline-none text-ink dark:text-paper font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-ink/10 dark:border-paper/20 px-3 py-3 bg-slate-50 dark:bg-slate-800/50">
                  <FiCalendar className="text-emerald-500 shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <span className="text-[9px] text-ink/50 dark:text-paper/50 -mb-0.5">Check Out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs outline-none text-ink dark:text-paper font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-ink/10 dark:border-paper/20 px-3 py-3 bg-slate-50 dark:bg-slate-800/50">
                  <FiUsers className="text-emerald-500 shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <span className="text-[9px] text-ink/50 dark:text-paper/50 -mb-0.5">Guests</span>
                    <input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent text-xs outline-none text-ink dark:text-paper font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'packages' && (
              <div className="flex items-center gap-2 rounded-xl border border-ink/10 dark:border-paper/20 px-3 py-3 md:col-span-4 bg-slate-50 dark:bg-slate-800/50">
                <FiSearch className="text-emerald-500 shrink-0" />
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search popular packages or destinations (e.g. Kashmir, Kerala, Goa, Manali...)"
                  className="w-full bg-transparent text-sm outline-none text-ink dark:text-paper font-medium"
                />
              </div>
            )}

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-3 text-sm font-bold text-slate-950 transition shadow-lg hover:shadow-xl duration-150"
            >
              <FiSearch size={16} /> Search Tours
            </button>
          </div>

          {/* Quick Popular Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink/5 dark:border-paper/10 pt-3 px-2">
            <span className="text-[11px] font-semibold text-ink/50 dark:text-paper/50">Popular:</span>
            {['Manali', 'Goa', 'Rishikesh', 'Kashmir', 'Kerala', 'Jaipur', 'Varanasi', 'Hampi'].map((dest) => (
              <button
                key={dest}
                onClick={() => handleDestinationClick(dest)}
                className="rounded-full bg-ink/5 dark:bg-paper/5 hover:bg-emerald-500/15 hover:text-emerald-600 px-3 py-0.5 text-xs font-medium transition"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING DOMESTIC DESTINATIONS - Replicating SOTC Campaign */}
      <section className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Trending Destinations</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl text-ink dark:text-paper mt-1">Explore Incredible India</h2>
          <div className="h-1 w-12 bg-amber-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {domesticDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => handleDestinationClick(dest.query)}
              className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'; }}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display text-lg font-bold">{dest.name}</h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">{dest.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMOTIONAL CAMPAIGN BANNER */}
      <section className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-r from-lagoon-600 via-lagoon-700 to-ink p-8 text-paper md:p-12 shadow-pop flex flex-col md:flex-row items-center justify-between gap-6 border border-lagoon-500/20">
          {/* Subtle Background Pattern */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-paper-dim/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="z-10 text-center md:text-left">
            <span className="rounded-full bg-sand-500/20 text-sand-400 border border-sand-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              Special Monsoon Bonanza
            </span>
            <h3 className="font-display text-2xl font-bold md:text-4xl mt-3 text-white leading-tight">
              FLAT 15% OFF on Kerala & Goa Stays!
            </h3>
            <p className="mt-2 text-sm text-paper/85 max-w-xl leading-relaxed">
              Book any scenic backwater houseboat tour or a beachside resort package today. Enter coupon code <strong className="text-sand-400 font-mono text-base">TRAVELSTAY15</strong> at checkout. Valid till end of the month!
            </p>
          </div>

          <button
            onClick={() => handleDestinationClick('Kerala')}
            className="z-10 rounded-lg bg-sand-500 hover:bg-sand-600 text-ink px-8 py-3 text-sm font-bold shadow-md transition duration-150 hover:scale-103 shrink-0"
          >
            Claim Discount Now
          </button>
        </div>
      </section>

      {/* POPULAR HOLIDAY PACKAGES WITH INTERACTIVE TABS */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-lagoon-500 font-bold">Best Selling Holidays</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl text-ink dark:text-paper">Popular Holiday Packages</h2>
          </div>
          
          {/* Category Tabs */}
          <div className="scrollbar-none flex gap-1 overflow-x-auto border border-ink/5 dark:border-paper/10 p-1 rounded-lg bg-paper-dim/40 dark:bg-ink-light">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition duration-150 ${
                  activeCategory === cat
                    ? 'bg-lagoon-500 text-paper shadow-sm'
                    : 'text-ink/60 dark:text-paper/60 hover:text-lagoon-600 dark:hover:text-lagoon-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic packages list */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredPackages.length === 0 ? (
            <div className="col-span-full rounded-xl2 border border-dashed border-ink/10 dark:border-paper/20 p-16 text-center text-sm text-ink/50 dark:text-paper/50 bg-paper-dim/10">
              No packages found under this category.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((pkg) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={pkg._id}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/packages')}
            className="rounded-lg border border-lagoon-500/30 text-lagoon-600 dark:text-lagoon-300 hover:bg-lagoon-50 dark:hover:bg-lagoon-700/10 px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition"
          >
            Explore All Packages →
          </button>
        </div>
      </section>

      {/* FEATURED HOTELS & RESORTS */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-lagoon-500 font-bold">Pocket Friendly & Luxury</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl text-ink dark:text-paper">Featured Hotels & Stays</h2>
          </div>
          <button
            onClick={() => navigate('/hotels')}
            className="text-sm font-semibold text-lagoon-600 dark:text-lagoon-300 hover:underline flex items-center gap-1"
          >
            View All Stays →
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredHotels.slice(0, 4).map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
        </div>
      </section>

      {/* PREVIOUS TRIP SPOT HIGHLIGHTS & MEMORIES */}
      <section className="mx-auto mt-28 max-w-7xl px-5 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon-500/15 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-lagoon-700 dark:text-lagoon-300">
              <FiCamera /> Real Traveler Memories
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-paper">
              Previous Trips & Visited Spot Moments
            </h2>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">
              Snapshots and authentic reviews from travelers who explored India on a budget.
            </p>
          </div>
          <Link
            to="/about"
            className="text-sm font-semibold text-lagoon-600 dark:text-lagoon-300 hover:underline flex items-center gap-1"
          >
            Explore Full Memory Gallery →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockPreviousTripGallery.slice(0, 4).map((spot) => (
            <div
              key={spot.id}
              className="group overflow-hidden rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  {spot.category}
                </span>
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                  <FiStar className="fill-white text-[10px]" /> {spot.rating}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-medium text-paper/80 flex items-center gap-1">
                    <FiMapPin className="text-lagoon-400 shrink-0" /> {spot.spot}
                  </p>
                  <p className="font-display font-semibold text-sm line-clamp-1">{spot.title}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs italic text-ink/70 dark:text-paper/70 line-clamp-2">
                  "{spot.quote}"
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-ink/5 dark:border-paper/10 pt-2.5 text-[11px] text-ink/50 dark:text-paper/50">
                  <span className="font-medium text-ink/80 dark:text-paper/80">{spot.traveler.split('(')[0]}</span>
                  <span>{spot.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto mt-28 max-w-7xl px-5 md:px-8">
        <div className="rounded-xl2 bg-ink px-6 py-16 text-paper md:px-14 shadow-pop relative overflow-hidden border border-paper/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lagoon-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white">The Travel & Stay Difference</h2>
            <p className="text-sm text-paper/60 mt-2 max-w-md mx-auto">Why we are trusted by over 50,000+ happy travellers in India.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {whyChooseUs.map((item, idx) => (
              <div key={item.title} className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3.5 border-l-2 border-lagoon-500 pl-5">
                <div className="text-sand-400">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-paper/65">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-28 max-w-7xl px-5 pb-16 md:px-8">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-lagoon-500 font-bold">Traveller Diaries</p>
          <h2 className="font-display text-3xl font-bold text-ink dark:text-paper mt-1">What Our Customers Say</h2>
          <div className="h-1 w-12 bg-sand-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Ananya Roy',
              location: 'Delhi',
              quote: 'Booking the Munnar & Alleppey package took ten minutes and the agency actually called to explain details. The luxury houseboat stay was spectacular!',
              image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
              rating: 5,
            },
            {
              name: 'Karan Sharma',
              location: 'Mumbai',
              quote: 'Best Leh-Ladakh bike trip organizers. They provided Royal Enfields in perfect condition, and a backup mechanic with oxygen cylinders. Extremely safe.',
              image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
              rating: 5,
            },
            {
              name: 'Meera Deshmukh',
              location: 'Pune',
              quote: 'Float in luxury! Taj Lake Palace in Udaipur is worth every rupee. The local driver cum guide provided by Wanderlust was exceptionally professional.',
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
              rating: 5,
            },
          ].map((t) => (
            <div key={t.name} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-card hover:shadow-pop transition duration-300 relative flex flex-col justify-between">
              <div>
                <div className="text-lagoon-500/25 mb-4">
                  <FaQuoteLeft size={28} />
                </div>
                <p className="font-display text-sm italic leading-relaxed text-ink/80 dark:text-paper/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-ink/5 dark:border-paper/5 pt-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover border border-lagoon-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-ink dark:text-paper">{t.name}</p>
                  <p className="text-[10px] text-ink/50 dark:text-paper/50 font-medium font-mono">{t.location} · Verified Guest</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
