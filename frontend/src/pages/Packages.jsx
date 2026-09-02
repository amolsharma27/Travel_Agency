import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiCompass, FiPhone, FiSend, FiMapPin,
  FiCalendar, FiClock, FiCheckCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios.js';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import StudentRegistrationModal from '../components/StudentRegistrationModal.jsx';
import { getStoredPackages, mockNearbyGetaways } from '../data/mockData.js';
import mussoorieBg from '../assets/mussoorie-kempty-tour.jpg';

const tourCategories = ['All', 'Group Tours', 'Nearby Getaways', 'Private Tours', 'Adventure Tours'];
const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const MUSSOORIE_WHATSAPP_URL = `https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent('Hello PCTE Travels, I am interested in the Mussoorie – Kempty Water Fall tour. Please provide me with more details.')}`;

const Packages = () => {
  const [params] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedEnquiryPkg, setSelectedEnquiryPkg] = useState(null);
  const [showMussoorieModal, setShowMussoorieModal] = useState(false);

  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    category: params.get('category') || '',
    sort: 'newest',
    page: 1,
  });

  const mussoorieTourData = {
    title: 'Mussoorie – Kempty Water Fall',
    destination: 'Mussoorie & Kempty Falls, Uttarakhand',
    duration: '1 Night / 2 Days',
    price: 'INR 3800 per person',
  };

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      let local = [];

      try {
        const cleanParams = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '' && v !== 'All')
        );
        const { data } = await api.get('/packages', { params: cleanParams });
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          local = data.data;
        } else {
          local = getStoredPackages();
        }
      } catch {
        local = getStoredPackages();
      }

      // Merge Nearby Getaways as packages if category is Nearby Getaways or All
      const getawayPkgs = mockNearbyGetaways.map((gw, idx) => ({
        _id: `pkg_gw_${gw.id || idx}`,
        slug: `getaway-${gw.destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title: `${gw.destination} Weekend Getaway: ${gw.tagline || 'Scenic North India Trip'}`,
        destination: `${gw.destination} (${gw.distanceFromLudhiana} from Ludhiana)`,
        tourType: 'Nearby Getaways',
        category: 'Nearby Getaways',
        theme: 'Weekend Trip',
        description: `Explore ${gw.destination}. ${gw.idealFor}. Best travel mode: ${gw.bestTravelMode}. Travel time: ${gw.travelTime}.`,
        images: [gw.image],
        durationDays: gw.tripDurationType?.includes('1-Day') ? 1 : gw.tripDurationType?.includes('3-Day') ? 3 : 2,
        durationNights: gw.tripDurationType?.includes('1-Day') ? 0 : gw.tripDurationType?.includes('3-Day') ? 2 : 1,
        travelMode: gw.bestTravelMode,
        inclusions: gw.highlights || ['Round-trip Transfers', 'Guided Highlights', 'Scenic Sightseeing'],
        exclusions: ['Personal Expenses'],
        facilities: ['Short Drive', 'Weekend Departure', 'Customizable'],
        status: 'approved'
      }));

      // Combine and eliminate duplicates by normalized title
      const combined = [...local, ...getawayPkgs];
      const seenTitles = new Set();
      const uniqueList = [];

      for (const p of combined) {
        const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 25);
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          uniqueList.push(p);
        }
      }

      let filtered = uniqueList;

      if (filters.q) {
        const query = filters.q.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.title?.toLowerCase().includes(query) ||
          p.destination?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      }

      if (filters.category && filters.category !== 'All') {
        const cat = filters.category.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.category?.toLowerCase() === cat ||
          p.tourType?.toLowerCase() === cat
        );
      }

      setPackages(filtered);
      setTotal(filtered.length);
      setPages(1);
      setLoading(false);
    };

    fetchPackages();
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* ========================================================================= */}
        {/* 1. DEDICATED UPCOMING TOUR SPOTLIGHT CARD: MUSSOORIE – KEMPTY WATER FALL   */}
        {/* ========================================================================= */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-[#0F2942] text-white shadow-2xl border border-white/10">
          
          {/* Background Image & Gradient Overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${mussoorieBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-slate-950/80 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="max-w-3xl space-y-4">
              
              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg border border-red-400/40">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                UPCOMING TOUR SPOTLIGHT
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                Mussoorie – Kempty Water Fall
              </h2>

              {/* Date Badge */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-black px-4 py-1 text-xs shadow-lg border border-amber-300">
                  <FiCalendar className="text-slate-950 text-sm" />
                  Trip Dates: 11 Sep to 13 September
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-medium drop-shadow max-w-2xl">
                Queen of the Hills · Scenic Himalayan Group Getaway departing on <b>11th September</b> with Kempty Waterfall excursion, Mall Road, mountain resort stay, evening bonfire, and round-trip transfers from Punjab.
              </p>

              {/* 4 Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl text-center">
                <div className="rounded-xl bg-black/65 backdrop-blur-md p-2.5 border border-amber-400/50">
                  <span className="block text-[9px] uppercase font-bold text-amber-300">Trip Dates</span>
                  <span className="text-xs font-black text-amber-300">11 – 13 Sep</span>
                </div>
                <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 border border-emerald-500/40">
                  <span className="block text-[9px] uppercase font-bold text-emerald-400">Tour Package Fare</span>
                  <span className="text-xs font-black text-amber-400">INR 3800 <span className="text-[9px] font-normal text-slate-300">/ person</span></span>
                </div>
                <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 border border-white/15">
                  <span className="block text-[9px] uppercase font-bold text-sky-300">Transportation</span>
                  <span className="text-xs font-bold text-white">AC Deluxe Coach</span>
                </div>
                <div className="rounded-xl bg-black/50 backdrop-blur-md p-2.5 border border-white/15">
                  <span className="block text-[9px] uppercase font-bold text-rose-300">Hospitality</span>
                  <span className="text-xs font-bold text-white">Stay + Meals + Guide</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* 1. Book Now -> Student Registration Modal */}
                <button
                  onClick={() => setShowMussoorieModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 border border-red-400/40 cursor-pointer"
                >
                  <FiSend className="text-sm" />
                  <span>Book Now</span>
                </button>

                {/* 2. WhatsApp 'Know More' */}
                <a
                  href={MUSSOORIE_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 border border-emerald-400/40"
                >
                  <FaWhatsapp className="text-base" />
                  <span>Know More</span>
                </a>

                {/* 3. Direct Phone Call */}
                <a
                  href={`tel:+91${PHONE_NUMBER}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white px-5 py-3 text-xs font-bold tracking-wider backdrop-blur-md transition-all"
                >
                  <FiPhone />
                  <span>Call Desk: {DISPLAY_PHONE}</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CATALOG HEADER & SEARCH BAR                                            */}
        {/* ========================================================================= */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#E11D48] font-bold">
              {loading ? 'Searching packages…' : `${total} Verified Tour Packages Available`}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              All Tour Packages &amp; Getaways
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <FiCompass /> Request Custom Plan
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
            <input
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Search destination, region (Mussoorie, Manali, Jibhi, Amritsar, Spiti, Rajasthan, Goa...)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tourCategories.map((c) => {
              const isSel = (filters.category === c) || (c === 'All' && !filters.category);
              return (
                <button
                  key={c}
                  onClick={() => update('category', c === 'All' ? '' : c)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSel
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-700 dark:text-slate-300 hover:border-[#0F2942]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Package Grid (No duplicates) */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-12 text-center shadow-sm">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No Packages Found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or tour category filter.
            </p>
            <button
              onClick={() => setFilters({ q: '', category: '', sort: 'newest', page: 1 })}
              className="mt-4 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2 text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                onRequestClick={(p) => setSelectedEnquiryPkg(p)}
              />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={filters.page}
              totalPages={pages}
              onPageChange={(p) => update('page', p)}
            />
          </div>
        )}
      </div>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
      
      {/* Student Registration Modal for General Packages */}
      <StudentRegistrationModal
        isOpen={Boolean(selectedEnquiryPkg)}
        onClose={() => setSelectedEnquiryPkg(null)}
        packageData={selectedEnquiryPkg ? {
          title: selectedEnquiryPkg.title,
          destination: selectedEnquiryPkg.destination,
          duration: `${selectedEnquiryPkg.durationNights || 1} Night / ${selectedEnquiryPkg.durationDays || 2} Days`,
          price: 'On Request',
        } : {}}
        requestType="On Request"
      />

      {/* Student Registration Modal for Mussoorie Upcoming Tour */}
      <StudentRegistrationModal
        isOpen={showMussoorieModal}
        onClose={() => setShowMussoorieModal(false)}
        packageData={mussoorieTourData}
        requestType="Booking Request"
      />
    </div>
  );
};

export default Packages;
