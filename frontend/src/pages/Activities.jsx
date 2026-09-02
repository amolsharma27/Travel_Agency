import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiClock, FiMapPin, FiShield, FiPhone, FiInfo } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios.js';
import { getStoredActivities } from '../data/mockData.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const activityCategories = [
  'All',
  'Adventure Sports',
  'Water Sports',
  'Trekking & Hiking',
  'Sightseeing & Culture',
  'Snow Activities'
];

const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const WHATSAPP_URL = `https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent('Hello PCTE Travels, I am interested in booking an adventure activity. Please provide details.')}`;

const Activities = () => {
  const [params] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/activities', {
          params: {
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            q: searchQuery || undefined,
          }
        });
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setActivities(data.data);
        } else {
          setActivities(getStoredActivities());
        }
      } catch {
        let list = getStoredActivities();
        if (selectedCategory !== 'All') {
          list = list.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(a => a.title.toLowerCase().includes(q) || a.location.toLowerCase().includes(q));
        }
        setActivities(list);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* TOP DIRECT CONTACT NOTICE BANNER */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0F2942] via-[#1E3A8A] to-[#0F2942] p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                <FiInfo /> Direct Activity Coordination
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                Want to book Rafting, Paragliding, Bungee, or Treks? Directly contact us!
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Book standalone activities with 100% certified instructors, safety gear, and priority slot scheduling without needing to purchase full tour packages. Connect with our adventure desk directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:+91${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:scale-105"
              >
                <FiPhone /> Call {DISPLAY_PHONE}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:scale-105"
              >
                <FaWhatsapp size={16} /> WhatsApp Desk
              </a>
            </div>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block rounded-full bg-[#E11D48]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Standalone Experiences
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Activities &amp; Outdoor Adventures
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-300">
              Book individual adventure sports and guided outdoor trails with certified equipment.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <FiShield className="text-emerald-500 text-sm" />
            <span>100% Certified Safety Gear &amp; Licensed Guides</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
          <div className="relative w-full">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search activity (e.g. Paragliding, Rafting, Bungee, Scuba, Triund Trek, Solang...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
            />
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {activityCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVITIES GRID */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 rounded-2xl skeleton" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-[#0F1D30] border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No activities match your filters</h3>
            <p className="mt-1 text-xs text-slate-500">Try resetting the category or search keyword.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 rounded-xl bg-[#0F2942] text-white px-5 py-2 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((act) => {
              const actWhatsAppMsg = encodeURIComponent(
                `Hello PCTE Travels, I would like to book/enquire about ${act.title} in ${act.location}. Please share slot availability.`
              );
              const actWhatsAppUrl = `https://wa.me/91${PHONE_NUMBER}?text=${actWhatsAppMsg}`;

              return (
                <div
                  key={act._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={act.image || FALLBACK_IMAGE}
                      alt={act.title}
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-lg bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm border border-slate-700">
                        {act.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-lg bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-slate-200 flex items-center gap-1 border border-slate-700 font-mono">
                      <FiClock size={11} className="text-amber-400" /> {act.duration}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {act.title}
                      </h3>
                      
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                        <FiMapPin size={12} className="text-[#E11D48]" /> {act.location}
                      </p>

                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {act.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Link
                        to={`/activities/${act._id}`}
                        className="flex-1 text-center rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white py-2 px-3 text-xs font-bold shadow-sm transition-all"
                      >
                        View Activity
                      </Link>
                      <a
                        href={actWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 text-xs font-bold shadow-sm transition-all"
                        title="Enquire on WhatsApp"
                      >
                        <FaWhatsapp size={14} />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
