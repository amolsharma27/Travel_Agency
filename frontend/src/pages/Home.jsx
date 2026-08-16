import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiCalendar, FiUsers, FiTag, FiCompass, FiShield, FiHeart, FiStar, FiChevronRight, FiCheckCircle, FiClock, FiDollarSign
} from 'react-icons/fi';
import { FaHotel, FaSuitcaseRolling, FaMountain, FaCampground, FaGraduationCap, FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import PcteLogo from '../components/PcteLogo.jsx';
import { getStoredHotels, getStoredPackages, domesticDestinations, mockPreviousTripGallery } from '../data/mockData.js';

const categories = ['All', 'Weekend Tours', 'Educational Journeys', 'Adventure', 'Cultural', 'Beach'];

const Home = () => {
  const [destination, setDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [durationDays, setDurationDays] = useState(8);
  const [budgetRange, setBudgetRange] = useState(25000);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [hotelsRes, packagesRes] = await Promise.all([
          api.get('/hotels', { params: { limit: 4, sort: 'rating_desc' } }),
          api.get('/packages', { params: { limit: 12, sort: 'popular' } }),
        ]);
        if (hotelsRes.data?.data?.length) {
          setFeaturedHotels(hotelsRes.data.data);
        } else {
          setFeaturedHotels(getStoredHotels().slice(0, 4));
        }

        if (packagesRes.data?.data?.length) {
          setPopularPackages(packagesRes.data.data);
        } else {
          setPopularPackages(getStoredPackages());
        }
      } catch {
        setFeaturedHotels(getStoredHotels().slice(0, 4));
        setPopularPackages(getStoredPackages());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (durationDays < 15) params.set('maxDays', durationDays.toString());
    if (budgetRange < 50000) params.set('maxPrice', budgetRange.toString());
    navigate(`/packages?${params.toString()}`);
  };

  const handleDestinationClick = (query) => {
    navigate(`/packages?q=${encodeURIComponent(query)}`);
  };

  const weekendPackages = popularPackages.filter(p => p.category === 'Weekend Tours');
  const filteredPackages = selectedCategory === 'All'
    ? popularPackages
    : popularPackages.filter(pkg => pkg.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FAFAF9] text-slate-900 dark:bg-[#0B0830] dark:text-slate-100 min-h-screen">
      
      {/* PCTE HERO BANNER WITH INTEGRATED SEARCH FORM */}
      <section className="relative overflow-hidden bg-[#110D44] pb-36 pt-20 text-white md:pb-44 md:pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0830]/90 via-[#110D44]/80 to-[#0B0830]/95 backdrop-blur-[1px]" />

        <div className="relative mx-auto max-w-6xl px-5 text-center md:px-8 flex flex-col items-center">
          
          {/* Hero Logo Emblem Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 border border-white/20 shadow-2xl"
          >
            <PcteLogo variant="white" className="h-8 w-auto" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              PCTE Travel Agency · Freedom To Evolve
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black leading-tight tracking-tight md:text-6xl text-white"
          >
            PCTE Travel Agency <br />
            <span className="text-[#F8B4B4] drop-shadow-md">Freedom To Evolve</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-3xl text-sm text-indigo-100/90 md:text-base leading-relaxed"
          >
            Official PCTE Travel Agency providing curated Friday weekend trips, educational journeys, Himalayan expeditions, and luxury resort stays with complete safety &amp; local expert guidance.
          </motion.p>
        </div>
      </section>

      {/* SEARCH MODULE (PCTE Theme) */}
      <section className="relative z-10 mx-auto -mt-20 max-w-5xl px-5 md:-mt-24 md:px-8">
        <div className="rounded-2xl bg-white dark:bg-[#110D44] p-6 shadow-2xl border border-slate-200 dark:border-indigo-900/80">
          <div className="grid gap-4 md:grid-cols-12 items-center">
            
            {/* Destination */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-[#1B1464] dark:text-indigo-200 flex items-center gap-1">
                <FiMapPin className="text-[#9B1C1C]" /> Destination
              </label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Pick a destination"
                className="w-full rounded-md border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#9B1C1C]"
              />
            </div>

            {/* Activities / Theme */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-[#1B1464] dark:text-indigo-200 flex items-center gap-1">
                <FiCompass className="text-[#9B1C1C]" /> Activity / Theme
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 p-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#9B1C1C]"
              >
                {categories.map(c => (
                  <option key={c} value={c} className="dark:bg-[#110D44]">{c === 'All' ? 'Choose an activity' : c}</option>
                ))}
              </select>
            </div>

            {/* Duration Slider */}
            <div className="md:col-span-3 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-[#1B1464] dark:text-indigo-200">
                <span className="flex items-center gap-1"><FiClock className="text-[#9B1C1C]" /> Duration:</span>
                <span className="text-[#9B1C1C] font-extrabold">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="accent-[#9B1C1C] cursor-pointer h-1.5 w-full bg-slate-200 dark:bg-indigo-900/60 rounded-lg"
              />
            </div>

            {/* Budget Range Slider */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-[#1B1464] dark:text-indigo-200">
                <span className="flex items-center gap-1"><FiDollarSign className="text-[#9B1C1C]" /> Budget:</span>
                <span className="text-[#9B1C1C] font-mono font-black">₹{budgetRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="4000"
                max="50000"
                step="1000"
                value={budgetRange}
                onChange={(e) => setBudgetRange(Number(e.target.value))}
                className="accent-[#9B1C1C] cursor-pointer h-1.5 w-full bg-slate-200 dark:bg-indigo-900/60 rounded-lg"
              />
            </div>

            {/* Search Submit */}
            <div className="md:col-span-12 pt-2">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-[#9B1C1C] hover:bg-[#1B1464] text-white py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <FiSearch /> Search PCTE Tours
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: EVERY FRIDAY TOURS (PCTE WEEKEND VIBES) */}
      <section className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#9B1C1C]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#9B1C1C] dark:text-red-400">
            Weekend Getaways
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            Every Friday Weekend Departures
          </h2>
          <div className="h-1 w-16 bg-[#9B1C1C] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {weekendPackages.slice(0, 3).map(pkg => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* SECTION 2: DESTINATION LISTS */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#1B1464]/10 dark:bg-indigo-900/50 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#1B1464] dark:text-amber-300">
            Explore Destinations
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            Featured Travel Destinations
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-indigo-200/70 max-w-xl mx-auto">
            Choose your dream region for weekend escapes, royal cultural heritage, or student educational journeys.
          </p>
          <div className="h-1 w-16 bg-[#9B1C1C] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {domesticDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => handleDestinationClick(dest.query)}
              className="group relative h-64 overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transition duration-500 border border-slate-200 dark:border-indigo-900/60"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0830]/90 via-[#0B0830]/30 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="rounded bg-[#9B1C1C] px-2 py-0.5 text-[9px] font-bold text-white uppercase shadow-sm">
                  {dest.badge}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display text-base font-bold">{dest.name}</h3>
                <p className="text-[10px] text-indigo-200/90 line-clamp-1 mt-0.5">{dest.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EDUCATIONAL JOURNEYS SPECIAL SPOTLIGHT */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="rounded-2xl bg-[#1B1464] p-8 md:p-12 text-white shadow-2xl border border-indigo-900 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9B1C1C] px-3.5 py-1 text-xs font-extrabold uppercase text-white shadow">
                <FaGraduationCap /> PCTE Educational Journeys
              </span>
              <h2 className="font-display text-3xl font-black md:text-4xl text-white leading-tight">
                School &amp; College Educational Trips
              </h2>
              <p className="text-sm text-indigo-100/90 leading-relaxed">
                Handcrafted educational tours combining heritage, CSIR science lab visits, agricultural tea plantation workshops, and team-building safety under PCTE Travel Agency supervision.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#9B1C1C]" /> Certified Facilitators</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#9B1C1C]" /> Science Lab &amp; Museum Passes</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#9B1C1C]" /> 24/7 Security Care</span>
              </div>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/packages/pkg_105"
                  className="rounded-md bg-[#9B1C1C] hover:bg-white text-white hover:text-[#1B1464] border border-[#9B1C1C] px-6 py-3 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all"
                >
                  View Educational Tour Details
                </Link>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="rounded-md border border-white/20 hover:bg-white/10 px-6 py-3 text-xs font-bold text-white transition-colors"
                >
                  Custom Plan Request
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80"
                  alt="Educational Journeys"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOUR PACKAGES GRID */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-block rounded-full bg-[#9B1C1C]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#9B1C1C] dark:text-red-400">
              Popular Choice
            </span>
            <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-1">
              Affordable Tour Packages
            </h2>
          </div>
          
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto border border-slate-200 dark:border-indigo-900/60 p-1.5 rounded-xl bg-white dark:bg-[#110D44]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition duration-150 ${
                  selectedCategory === cat
                    ? 'bg-[#9B1C1C] text-white shadow-md'
                    : 'text-slate-600 dark:text-indigo-200/80 hover:text-[#9B1C1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredPackages.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-indigo-900 p-16 text-center text-sm text-slate-500 dark:text-indigo-200/60">
              No packages found under this category.
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))
          )}
        </div>
      </section>

      {/* FEATURED HOTELS & HOMESTAYS */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-[#1B1464]/10 dark:bg-indigo-900/50 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#1B1464] dark:text-amber-300">
              Curated Stays
            </span>
            <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-1">
              Featured Hotels &amp; Homestays
            </h2>
          </div>
          <button
            onClick={() => navigate('/hotels')}
            className="text-xs font-bold text-[#9B1C1C] dark:text-red-400 hover:underline"
          >
            View All Stays &rarr;
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            featuredHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          )}
        </div>
      </section>

      {/* REVIEWS & VERIFIED TRAVELERS */}
      <section className="mx-auto my-24 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#9B1C1C]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#9B1C1C] dark:text-red-400">
            Verified Reviews
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            What PCTE Travelers Say
          </h2>
          <div className="h-1 w-16 bg-[#9B1C1C] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockPreviousTripGallery.map((spot) => (
            <div
              key={spot.id}
              className="overflow-hidden rounded-xl bg-white dark:bg-[#110D44] border border-slate-200 dark:border-indigo-900/60 shadow-sm hover:shadow-xl transition-all p-4 space-y-3"
            >
              <div className="flex items-center gap-1 text-amber-500">
                <FiStar className="fill-amber-400" />
                <FiStar className="fill-amber-400" />
                <FiStar className="fill-amber-400" />
                <FiStar className="fill-amber-400" />
                <FiStar className="fill-amber-400" />
                <span className="ml-1 text-xs font-bold text-slate-900 dark:text-white">{spot.rating}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-indigo-200/80 italic line-clamp-3">
                "{spot.quote}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-indigo-900/40 text-[11px] font-bold text-slate-900 dark:text-white">
                {spot.traveler}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
    </div>
  );
};

export default Home;
