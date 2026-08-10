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
    <div className="bg-[#FDF7F0] text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen">
      
      {/* CLIFFSEAS HERO BANNER WITH INTEGRATED SEARCH FORM */}
      <section className="relative overflow-hidden bg-slate-950 pb-36 pt-20 text-white md:pb-44 md:pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/95 backdrop-blur-[1px]" />

        <div className="relative mx-auto max-w-6xl px-5 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e0882e]/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300 border border-[#e0882e]/30 shadow-lg"
          >
            <FiShield className="text-[#e0882e]" /> TravelStay - Trusted Tour Operator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black leading-tight tracking-tight md:text-6xl text-white"
          >
            TravelStay - Best Travel Agency <br />
            <span className="text-[#e0882e]">For Your Dreams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-3xl text-sm text-slate-200 md:text-base leading-relaxed"
          >
            TravelStay is a trusted tour and travel agency offering affordable, well-planned trips with safe travel and memorable experiences.
          </motion.p>
        </div>
      </section>

      {/* SEARCH MODULE (Cliffseas Yatra Advanced Search Module Style) */}
      <section className="relative z-10 mx-auto -mt-20 max-w-5xl px-5 md:-mt-24 md:px-8">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="grid gap-4 md:grid-cols-12 items-center">
            
            {/* Destination */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FiMapPin className="text-[#e0882e]" /> Destination
              </label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Pick a destination"
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#e0882e]"
              />
            </div>

            {/* Activities / Theme */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FiCompass className="text-[#e0882e]" /> Activity / Theme
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#e0882e]"
              >
                {categories.map(c => (
                  <option key={c} value={c} className="dark:bg-slate-900">{c === 'All' ? 'Choose an activity' : c}</option>
                ))}
              </select>
            </div>

            {/* Duration Slider */}
            <div className="md:col-span-3 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1"><FiClock className="text-[#e0882e]" /> Duration:</span>
                <span className="text-[#e0882e]">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="accent-[#e0882e] cursor-pointer h-1.5 w-full bg-slate-200 rounded-lg"
              />
            </div>

            {/* Budget Range Slider & Submit Button */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1"><FiDollarSign className="text-[#e0882e]" /> Budget:</span>
                <span className="text-[#e0882e] font-mono">₹{budgetRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="4000"
                max="50000"
                step="1000"
                value={budgetRange}
                onChange={(e) => setBudgetRange(Number(e.target.value))}
                className="accent-[#e0882e] cursor-pointer h-1.5 w-full bg-slate-200 rounded-lg"
              />
            </div>

            {/* Search Submit */}
            <div className="md:col-span-12 pt-2">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-[#e0882e] hover:bg-white text-white hover:text-[#e0882e] border border-[#e0882e] py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <FiSearch /> Search Tours
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: EVERY FRIDAY TOURS (CLIFFSEAS WEEKEND VIBES) */}
      <section className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#e0882e]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#e0882e]">
            Weekend Vibes
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            Every Friday Tours
          </h2>
          <div className="h-1 w-16 bg-[#e0882e] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {weekendPackages.slice(0, 3).map(pkg => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* SECTION 2: DESTINATION LISTS - VISIT EXOTIC PLACE (CLIFFSEAS DESTINATION CARDS) */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#e0882e]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#e0882e]">
            Destination Lists
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            Visit Exotic Places
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Choose your dream region for weekend escapes, cultural heritage, or educational journeys.
          </p>
          <div className="h-1 w-16 bg-[#e0882e] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {domesticDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => handleDestinationClick(dest.query)}
              className="group relative h-64 overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transition duration-500 border border-slate-200 dark:border-slate-800"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="rounded bg-[#e0882e] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                  {dest.badge}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display text-base font-bold">{dest.name}</h3>
                <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5">{dest.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EDUCATIONAL JOURNEYS SPECIAL SPOTLIGHT */}
      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="rounded-2xl bg-[#1c385e] p-8 md:p-12 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0882e] px-3 py-1 text-xs font-extrabold uppercase text-white">
                <FaGraduationCap /> Educational Journeys
              </span>
              <h2 className="font-display text-3xl font-black md:text-4xl text-white leading-tight">
                School &amp; College Educational Journeys
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Handcrafted educational tours combining heritage, CSIR science lab visits, agricultural tea plantation workshops, and team-building safety.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-amber-200">
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#e0882e]" /> Certified Facilitators</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#e0882e]" /> Science Lab &amp; Museum Passes</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#e0882e]" /> 24/7 Security Care</span>
              </div>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/packages/pkg_105"
                  className="rounded-md bg-[#e0882e] hover:bg-white text-white hover:text-[#e0882e] border border-[#e0882e] px-6 py-3 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all"
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
            <span className="inline-block rounded-full bg-[#e0882e]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#e0882e]">
              Popular Choice
            </span>
            <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-1">
              Affordable Tour Packages
            </h2>
          </div>
          
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl bg-white dark:bg-slate-900">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition duration-150 ${
                  selectedCategory === cat
                    ? 'bg-[#e0882e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#e0882e]'
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
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center text-sm text-slate-500">
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
            <span className="inline-block rounded-full bg-[#e0882e]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#e0882e]">
              Curated Stays
            </span>
            <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-1">
              Featured Hotels &amp; Homestays
            </h2>
          </div>
          <button
            onClick={() => navigate('/hotels')}
            className="text-xs font-bold text-[#e0882e] hover:underline"
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

      {/* CLIFFSEAS STYLE CUSTOMER REVIEWS */}
      <section className="mx-auto my-24 max-w-7xl px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#e0882e]/10 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#e0882e]">
            Google 4.9★ Reviews
          </span>
          <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white mt-2">
            What Our Travelers Say
          </h2>
          <div className="h-1 w-16 bg-[#e0882e] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockPreviousTripGallery.map((spot) => (
            <div
              key={spot.id}
              className="overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-4 space-y-3"
            >
              <div className="flex items-center gap-1 text-[#e0882e]">
                <FiStar className="fill-[#e0882e]" />
                <FiStar className="fill-[#e0882e]" />
                <FiStar className="fill-[#e0882e]" />
                <FiStar className="fill-[#e0882e]" />
                <FiStar className="fill-[#e0882e]" />
                <span className="ml-1 text-xs font-bold text-slate-900 dark:text-white">{spot.rating}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3">
                "{spot.quote}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-900 dark:text-white">
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
