import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMapPin, FiClock, FiDollarSign, FiUsers, FiCompass, FiArrowRight,
  FiTrendingUp, FiCheckCircle
} from 'react-icons/fi';
import { FaCar, FaBus, FaTrain } from 'react-icons/fa';
import api from '../api/axios.js';
import { mockNearbyGetaways } from '../data/mockData.js';

const tripCategories = [
  'All',
  'Weekend Trips',
  '1-Day Trips',
  '2-Day Trips',
  '3-Day Trips',
  'Budget Trips',
  'Adventure Getaways',
  'Couple Getaways',
  'Friends Trips'
];

const NearbyGetaways = () => {
  const [getaways, setGetaways] = useState(mockNearbyGetaways);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/getaways').then(({ data }) => {
      if (data?.data) setGetaways(data.data);
    }).catch(() => {});
  }, []);

  const filteredGetaways = getaways.filter((gw) => {
    const matchCategory =
      selectedCategory === 'All' ||
      gw.tripDurationType?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      gw.idealFor?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchQuery =
      !searchQuery ||
      gw.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gw.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gw.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchQuery;
  });

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block rounded-full bg-[#E11D48]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Weekend Escapes &amp; Road Trips
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Nearby Getaways from Punjab &amp; North India
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-300">
            Handcrafted quick escapes tailored for young professionals, college students, couples, and families departing from Ludhiana, Chandigarh, and Punjab.
          </p>
        </div>

        {/* Departure Banner */}
        <div className="mb-8 rounded-2xl bg-[#0F2942] text-white p-5 md:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 text-2xl shrink-0">
              <FiCompass />
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-bold">
                Origin Base: Ludhiana &amp; Tri-City (Punjab)
              </h3>
              <p className="text-xs text-slate-300">
                All distances, driving times, and AC Volvo / Coach schedules calculated directly from central Punjab.
              </p>
            </div>
          </div>

          <Link
            to="/packages?category=Group+Tours"
            className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow transition-colors whitespace-nowrap"
          >
            Every Friday Weekend Tours &rarr;
          </Link>
        </div>

        {/* Category Pills & Quick Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {tripCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0F2942]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GETAWAY CARDS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGetaways.map((gw) => (
            <div
              key={gw.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Distance Badge */}
              <div className="relative h-52 overflow-hidden bg-slate-900">
                <img
                  src={gw.image}
                  alt={gw.destination}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                  <span className="rounded bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm border border-slate-700">
                    {gw.tripDurationType}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <FiClock size={12} /> {gw.travelTime} from Ludhiana
                  </span>
                  <h3 className="font-display text-xl font-black text-white">
                    {gw.destination}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {gw.tagline}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin size={12} className="text-[#E11D48] shrink-0" /> Distance: <b className="text-slate-800 dark:text-slate-200">{gw.distanceFromLudhiana}</b>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FaCar size={12} className="text-slate-400 shrink-0" /> Best Mode: <span className="text-slate-800 dark:text-slate-200 font-medium">{gw.bestTravelMode}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiDollarSign size={12} className="text-emerald-500 shrink-0" /> Est. Budget: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{gw.budgetEstimate}</span>
                    </p>
                  </div>

                  {/* Highlights Bullet Tags */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Top Spots &amp; Vibes</span>
                    <div className="flex flex-wrap gap-1">
                      {gw.highlights.map((h, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {gw.idealFor.split('·')[0]}
                  </span>

                  <button
                    onClick={() => navigate(gw.packageLink || `/packages?q=${encodeURIComponent(gw.destination)}`)}
                    className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all duration-150 flex items-center gap-1"
                  >
                    Explore Packages &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NearbyGetaways;
