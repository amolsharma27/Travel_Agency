import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiTag, FiSearch, FiSliders } from 'react-icons/fi';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { getStoredHotels } from '../data/mockData.js';

const stayCategories = [
  'All',
  'Resorts',
  'Hotels',
  'Homestays',
  'Hostels',
  'Camping',
  'Villas / Apartments'
];

const amenityOptions = [
  'High-Speed WiFi',
  'Swimming Pool',
  'Mountain View Balcony',
  'Free Parking',
  'Fireplace & Bonfire',
  'Spa & Wellness',
  'Beach Access'
];

const budgetRanges = [
  { label: 'All Stays', min: '', max: '' },
  { label: 'Under ₹1,500 (Hostels & Camps)', min: '', max: '1500' },
  { label: '₹1,500 - ₹3,500 (Homestays & Deluxe)', min: '1500', max: '3500' },
  { label: '₹3,500+ (Luxury Resorts & Villas)', min: '3500', max: '' },
];

const Hotels = () => {
  const [params] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: params.get('city') || '',
    category: params.get('category') || '',
    minPrice: '',
    maxPrice: '',
    starRating: '',
    breakfastIncluded: false,
    freeCancellation: false,
    amenities: [],
    sort: 'newest',
    page: 1,
  });

  const fetchHotels = async (query) => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== '' && v !== false && !(Array.isArray(v) && v.length === 0))
      );
      if (query.amenities?.length) cleanParams.amenities = query.amenities.join(',');
      const { data } = await api.get('/hotels', { params: cleanParams });
      if (data?.data && data.data.length > 0) {
        setHotels(data.data);
        setTotal(data.total);
        setPages(data.pages || 1);
      } else {
        const fallback = getStoredHotels();
        setHotels(fallback);
        setTotal(fallback.length);
        setPages(1);
      }
    } catch {
      const fallback = getStoredHotels();
      setHotels(fallback);
      setTotal(fallback.length);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const toggleAmenity = (a) => {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
      page: 1,
    }));
  };

  const handleBudgetQuickSelect = (min, max) => {
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Title */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#E11D48] font-bold">
              {loading ? 'Searching verified stays…' : `${total} Verified Stays Available`}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {filters.city ? `Hotels & Stays in ${filters.city}` : 'Hotels, Resorts, Homestays & Camps'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F1D30] px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="newest">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated (4.8+)</option>
            </select>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold md:hidden text-slate-800 dark:text-slate-200"
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* Quick Budget Chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400 mr-1">
            <FiTag /> Budget:
          </span>
          {budgetRanges.map((b) => {
            const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
            return (
              <button
                key={b.label}
                onClick={() => handleBudgetQuickSelect(b.min, b.max)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-700 dark:text-slate-300 hover:border-[#0F2942]'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
          {stayCategories.map((cat) => {
            const isSel = (filters.category === cat) || (cat === 'All' && !filters.category);
            return (
              <button
                key={cat}
                onClick={() => update('category', cat === 'All' ? '' : cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Layout Grid: Sidebar Filters & Results */}
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          
          {/* Filters Sidebar */}
          <aside className={`space-y-5 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 space-y-5 shadow-sm">
              
              {/* City / Location */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Location / City
                </label>
                <div className="relative">
                  <input
                    value={filters.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="e.g. Manali, Goa, Jibhi, Jaipur"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nightly Rate (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => update('minPrice', e.target.value)}
                    className="w-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => update('maxPrice', e.target.value)}
                    className="w-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Star Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['', '3', '4', '5'].map((s) => (
                    <button
                      key={s || 'all'}
                      onClick={() => update('starRating', s)}
                      className={`rounded-lg border px-3 py-1 text-xs font-bold transition-colors ${
                        filters.starRating === s
                          ? 'border-[#0F2942] bg-[#0F2942] text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s ? `${s}★+` : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Amenities
                </label>
                <div className="space-y-2">
                  {amenityOptions.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="rounded accent-[#0F2942]"
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setFilters({ city: '', category: '', minPrice: '', maxPrice: '', starRating: '', breakfastIncluded: false, freeCancellation: false, amenities: [], sort: 'newest', page: 1 })}
                  className="w-full text-center rounded-lg border border-slate-200 dark:border-slate-700 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Stays Grid */}
          <div>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : hotels.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-16 text-center bg-white dark:bg-[#0F1D30]">
                <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">No properties match those exact filters</p>
                <p className="mt-1 text-xs text-slate-500">Try clearing location or resetting the budget range.</p>
                <button
                  onClick={() => setFilters({ city: '', category: '', minPrice: '', maxPrice: '', starRating: '', breakfastIncluded: false, freeCancellation: false, amenities: [], sort: 'newest', page: 1 })}
                  className="mt-4 rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
              </div>
            )}
            <Pagination page={filters.page} pages={pages} onChange={(p) => update('page', p)} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hotels;
