import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiCalendar, FiUsers, FiCompass, FiShield,
  FiStar, FiChevronRight, FiCheckCircle, FiClock, FiDollarSign,
  FiArrowRight, FiPhoneCall, FiAward, FiTag
} from 'react-icons/fi';
import {
  FaPlane, FaHotel, FaBus, FaTrain, FaTaxi, FaSuitcase,
  FaMountain, FaPassport, FaHiking, FaWhatsapp
} from 'react-icons/fa';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import {
  getStoredHotels, getStoredPackages, getStoredActivities,
  domesticDestinations, mockPreviousTripGallery, mockNearbyGetaways
} from '../data/mockData.js';

import heroSunsetMountains from '../assets/hero-sunset-mountains.jpg';

const heroTabs = [
  { id: 'tours', label: 'Tours & Packages', icon: FaSuitcase, path: '/packages' },
  { id: 'stays', label: 'Stays & Resorts', icon: FaHotel, path: '/hotels' },
  { id: 'flights', label: 'Flights', icon: FaPlane, path: '/transportation' },
  { id: 'trains', label: 'Trains', icon: FaTrain, path: '/transportation' },
  { id: 'buses', label: 'Buses', icon: FaBus, path: '/transportation' },
  { id: 'activities', label: 'Activities', icon: FaHiking, path: '/activities' },
];

const tourCategories = ['All', 'Group Tours', 'Private Tours', 'Adventure Tours'];

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const Home = () => {
  const [activeHeroTab, setActiveHeroTab] = useState('tours');
  const [heroSearchDest, setHeroSearchDest] = useState('');
  const [heroDate, setHeroDate] = useState('');
  const [heroTravellers, setHeroTravellers] = useState('2');
  const [selectedTourCategory, setSelectedTourCategory] = useState('All');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [hotelsRes, packagesRes, activitiesRes] = await Promise.all([
          api.get('/hotels', { params: { limit: 4, sort: 'rating_desc' } }),
          api.get('/packages', { params: { limit: 12 } }),
          api.get('/activities')
        ]);
        setFeaturedHotels(hotelsRes.data?.data?.length ? hotelsRes.data.data : getStoredHotels().slice(0, 4));
        setPopularPackages(packagesRes.data?.data?.length ? packagesRes.data.data : getStoredPackages());
        setFeaturedActivities(activitiesRes.data?.data?.length ? activitiesRes.data.data.slice(0, 3) : getStoredActivities().slice(0, 3));
      } catch {
        setFeaturedHotels(getStoredHotels().slice(0, 4));
        setPopularPackages(getStoredPackages());
        setFeaturedActivities(getStoredActivities().slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const filteredPackages = selectedTourCategory === 'All'
    ? popularPackages
    : popularPackages.filter(p =>
        p.category?.toLowerCase() === selectedTourCategory.toLowerCase() ||
        p.tourType?.toLowerCase() === selectedTourCategory.toLowerCase()
      );

  return (
    <div className="bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1727] dark:text-slate-100 min-h-screen">
      
      {/* 1. FULL-SCREEN HERO SECTION WITH SEARCH BOX INSIDE */}
      <section className="relative min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden bg-[#0F2942] pt-10 pb-12 text-white">
        {/* Real Mountain / Valley Sunset Group Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url(${heroSunsetMountains})`,
          }}
        />
        {/* Atmosphere Balanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1727]/75 via-[#0F2942]/60 to-[#0B1727]/90 backdrop-blur-[0.5px]" />

        {/* Top Hero Headline & Tagline */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center md:px-8 flex flex-col items-center pt-2">
          {/* Subtle Tagline Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 border border-white/25 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-md">
            <FiCompass /> Trusted North India &amp; National Tour Operator
          </div>

          <h1 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
            Your Journey, Our Expertise
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-medium drop-shadow">
            Plan, book and experience your next journey with verified group departures, heritage stays, mobility logistics, and official passport assistance.
          </p>
        </div>

        {/* Search Box Sitting Fully Inside the Hero Image */}
        <div className="relative z-20 mx-auto w-full max-w-5xl px-4 md:px-8 mt-6">
          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0B1727]/60 scrollbar-none p-1.5 gap-1">
              {heroTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeHeroTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHeroTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                      isSelected
                        ? 'bg-white dark:bg-[#0F1D30] text-[#0F2942] dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={isSelected ? 'text-[#E11D48]' : 'text-slate-400'} size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Search Form */}
            <form onSubmit={handleHeroSearch} className="p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-12 items-end">
                
                {/* Destination Field */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <FiMapPin className="text-[#E11D48]" />
                    {activeHeroTab === 'stays' ? 'Where are you staying?' : activeHeroTab === 'flights' ? 'Where are you flying?' : 'Where do you want to go?'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Manali, Jibhi, Kashmir, Goa, Rajasthan…"
                    value={heroSearchDest}
                    onChange={(e) => setHeroSearchDest(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                  />
                </div>

                {/* Date Field */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <FiCalendar className="text-[#E11D48]" /> Travel Date
                  </label>
                  <input
                    type="date"
                    value={heroDate}
                    onChange={(e) => setHeroDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                  />
                </div>

                {/* Travellers Field */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <FiUsers className="text-[#E11D48]" /> Travellers / Rooms
                  </label>
                  <select
                    value={heroTravellers}
                    onChange={(e) => setHeroTravellers(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="1">1 Person (Solo)</option>
                    <option value="2">2 Persons (Couple / Friends)</option>
                    <option value="4">4 Persons (Family / Group)</option>
                    <option value="8">6+ Persons (Large Group)</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider shadow transition-all duration-150 flex items-center justify-center gap-1.5"
                  >
                    <FiSearch /> Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>


      {/* 3. EXPLORE 6 MAIN CATEGORIES BAR */}
      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'Tours', subtitle: 'Group & Private Trips', icon: FaSuitcase, link: '/packages', count: '12+ Packages' },
            { title: 'Stays', subtitle: 'Hotels, Resorts & Camps', icon: FaHotel, link: '/hotels', count: '30+ Properties' },
            { title: 'Transportation', subtitle: 'Flights, Trains & Cabs', icon: FaPlane, link: '/transportation', count: 'Daily Connect' },
            { title: 'Activities', subtitle: 'Rafting, Bungee & Treks', icon: FaHiking, link: '/activities', count: '10+ Adventures' },
            { title: 'Nearby Getaways', subtitle: 'Punjab & North India', icon: FiMapPin, link: '/nearby-getaways', count: 'Weekend Trips' },
            { title: 'Passport Services', subtitle: 'Application Assistance', icon: FaPassport, link: '/passport-services', count: 'MEA Guidance' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md hover:border-[#0F2942] dark:hover:border-amber-400 transition-all text-center flex flex-col items-center justify-between space-y-2"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0F2942] dark:text-amber-400 flex items-center justify-center group-hover:bg-[#0F2942] group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{cat.subtitle}</p>
                </div>
                <span className="text-[9px] font-bold text-[#E11D48] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS WITH AUTHENTIC PHOTOGRAPHY */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Featured Regions
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Popular Travel Destinations
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Handcrafted holiday circuits across Himachal peaks, royal Rajasthan forts, Kashmir valleys, Punjab heritage, and Goa beaches.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {domesticDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/packages?q=${encodeURIComponent(dest.query)}`)}
              className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
            >
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => {
                  if (e.currentTarget.dataset.fallbackApplied) return;
                  e.currentTarget.dataset.fallbackApplied = 'true';
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-2.5 left-2.5">
                <span className="rounded bg-[#0F2942]/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-white uppercase border border-slate-700">
                  {dest.badge}
                </span>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display text-sm font-bold">{dest.name}</h3>
                <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{dest.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEARBY WEEKEND GETAWAYS (FROM PUNJAB / NORTH INDIA) */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Short Weekend Breaks
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Weekend Getaways from Punjab &amp; North India
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Accessible in 2 to 8 hours driving from Ludhiana &amp; Chandigarh.
            </p>
          </div>

          <Link
            to="/nearby-getaways"
            className="text-xs font-bold text-[#0F2942] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            View All Getaways <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockNearbyGetaways.slice(0, 4).map((gw) => (
            <div
              key={gw.id}
              onClick={() => navigate(gw.packageLink || `/packages?q=${encodeURIComponent(gw.destination)}`)}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={gw.image}
                  alt={gw.destination}
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied) return;
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded bg-[#0F2942] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                    {gw.tripDurationType}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-slate-900/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-slate-200">
                  {gw.travelTime}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400">
                    {gw.destination}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{gw.tagline}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{gw.budgetEstimate.split('(')[0]}</span>
                  <span className="text-[11px] font-bold text-[#0F2942] dark:text-slate-300">Explore &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. POPULAR TOUR PACKAGES WITH CATEGORY TABS */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Curated Holidays
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Popular Tour Packages
            </h2>
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            {tourCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTourCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTourCategory === cat
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : (
            filteredPackages.slice(0, 6).map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))
          )}
        </div>
      </section>

      {/* 7. ADVENTURE EXPERIENCES (STANDALONE ACTIVITIES) */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Outdoor Thrills
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Adventure Experiences &amp; Activities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Book individual activities with certified instructors without full holiday packages.
            </p>
          </div>

          <Link
            to="/activities"
            className="text-xs font-bold text-[#0F2942] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            Browse All Activities <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredActivities.map((act) => (
            <div
              key={act._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={act.image}
                  alt={act.title}
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied) return;
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded bg-[#0F2942] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase border border-slate-700">
                    {act.category}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-slate-900/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-slate-200">
                  {act.duration}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 line-clamp-1">
                    {act.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <FiMapPin className="text-[#E11D48]" size={12} /> {act.location}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {act.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Per Person</span>
                    <span className="font-mono text-base font-black text-slate-900 dark:text-white">₹{act.discountPrice || act.price}</span>
                  </div>
                  <Link
                    to={`/activities/${act._id}`}
                    className="rounded-md bg-[#0F2942] hover:bg-[#E11D48] text-white px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    Book Activity &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FEATURED STAYS & RESORTS */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Quality Hospitality
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Featured Hotels, Resorts &amp; Homestays
            </h2>
          </div>

          <Link
            to="/hotels"
            className="text-xs font-bold text-[#0F2942] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            Explore All Stays <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          ) : (
            featuredHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          )}
        </div>
      </section>

      {/* 9. PASSPORT APPLICATION ASSISTANCE SPOTLIGHT BANNER */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="rounded-2xl bg-[#0F2942] p-8 md:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                <FaPassport /> Official Passport Guidance
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-black text-white leading-tight">
                Passport Application Assistance &amp; Pre-Screening
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Expert procedural guidance for Fresh Passports, Renewals, Tatkaal (urgent) slots, Minor Passports, and Police Clearance Certificates (PCC) across Ludhiana, Chandigarh, Jalandhar, and Delhi PSK centers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Document Audit</span>
                  <span className="font-semibold text-white">Pre-Screening Kit</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Fast Scheduling</span>
                  <span className="font-semibold text-white">PSK Appointment</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Transparent Fee</span>
                  <span className="font-semibold text-white">Govt + Service Fee</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/passport-services"
                  className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow transition-colors"
                >
                  Apply for Passport Assistance &rarr;
                </Link>
                <a
                  href="https://wa.me/919814519578?text=Hi%20PCTE%20Travel%20Agency%2C%20I%20need%20assistance%20with%20Passport%20Application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 hover:bg-white/10 px-5 py-3 text-xs font-bold text-white transition-colors"
                >
                  <FaWhatsapp className="text-emerald-400" /> WhatsApp Passport Desk
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md p-5 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-white/10 pb-2">
                  <FiShield size={18} /> Official Transparency Note
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Passports in India are processed exclusively by the Ministry of External Affairs through official Passport Seva Kendras (passportindia.gov.in). We provide authorized application preparation and appointment consultancy.
                </p>
                <div className="rounded-lg bg-black/20 p-2.5 text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between"><span>Normal Adult Govt Fee:</span><b>₹1,500</b></div>
                  <div className="flex justify-between"><span>Agency Assistance Fee:</span><b>₹499</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY CHOOSE US */}
      <section className="mx-auto my-20 max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Freedom To Evolve
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Why Choose PCTE Travel Agency
          </h2>
        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Personalized Travel Planning', desc: 'Every holiday package or private road tour is tailored to your group preferences with detailed day-wise itineraries.' },
            { title: 'Multiple Travel Options', desc: 'From luxury Volvo coaches and 4x4 Spiti tempo travellers to private chauffeur sedans and flight bookings.' },
            { title: 'Verified Hospitality Partners', desc: 'Every hotel, mountain resort, and riverside camp is personally inspected for cleanliness and comfort.' },
            { title: 'Easy & Transparent Booking', desc: 'Clear pricing with zero hidden charges. Instant e-invoices and booking confirmations delivered straight to your WhatsApp.' },
            { title: '24/7 Ground Customer Support', desc: 'Dedicated trip coordinators on ground during group departures and real-time helpline for any logistical questions.' },
            { title: 'Customized Tour Packages', desc: 'Modify dates, add custom hotel upgrades, or arrange special candlelight dinners with our travel designers.' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 text-base shrink-0" />
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. VERIFIED TRAVELER REVIEWS */}
      <section className="mx-auto mb-20 max-w-7xl px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Authentic Feedback
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            What Our Travelers Say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockPreviousTripGallery.map((spot) => (
            <div
              key={spot.id}
              className="overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <FiStar className="fill-amber-400" size={13} />
                  <FiStar className="fill-amber-400" size={13} />
                  <FiStar className="fill-amber-400" size={13} />
                  <FiStar className="fill-amber-400" size={13} />
                  <FiStar className="fill-amber-400" size={13} />
                  <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">{spot.rating}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{spot.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white">{spot.traveler}</span>
                <span className="text-slate-400">{spot.spot.split(',')[0]}</span>
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
