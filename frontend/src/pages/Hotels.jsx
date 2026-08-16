import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiTag } from 'react-icons/fi';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { getStoredHotels } from '../data/mockData.js';

const amenityOptions = ['Free WiFi', 'Swimming Pool', 'Mountain View Cafe', 'Parking', 'Spa', 'Restaurant'];

const budgetRanges = [
  { label: 'All Stays', min: '', max: '' },
  { label: 'Under ₹1,000 (Budget Hostels)', min: '', max: '1000' },
  { label: '₹1,000 - ₹2,500 (Affordable Deluxe)', min: '1000', max: '2500' },
  { label: '₹2,500+ (Luxury Resorts)', min: '2500', max: '' },
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
    minPrice: '',
    maxPrice: '',
    minRating: '',
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
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 bg-[#FAFAF9] dark:bg-[#0B0830] min-h-screen">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-extrabold">
            {loading ? 'Searching stays…' : `${total} verified stays available`}
          </p>
          <h1 className="font-display text-2xl font-black md:text-3xl text-slate-900 dark:text-white">
            {filters.city ? `Hotels & Stays in ${filters.city}` : 'All Hotels, Hostels & Resorts'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High (Budget First)</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated (4.8+)</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-indigo-800 px-3 py-2 text-sm md:hidden text-slate-800 dark:text-slate-200"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* QUICK BUDGET FILTER CHIPS */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-bold uppercase text-[#9B1C1C] dark:text-red-400 mr-1">
          <FiTag /> Quick Budgets:
        </span>
        {budgetRanges.map((b) => {
          const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
          return (
            <button
              key={b.label}
              onClick={() => handleBudgetQuickSelect(b.min, b.max)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                isSelected
                  ? 'bg-[#9B1C1C] text-white shadow-sm'
                  : 'border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] text-slate-700 dark:text-indigo-200 hover:border-[#9B1C1C]'
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="rounded-2xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-5 space-y-5 shadow-sm">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-200">
                City / Location
              </label>
              <input
                value={filters.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="e.g. Manali, Goa, Jaipur"
                className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-3 py-2 text-sm outline-none focus:border-[#9B1C1C]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-200">
                Price per night (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => update('minPrice', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-3 py-2 text-sm outline-none focus:border-[#9B1C1C]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => update('maxPrice', e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-3 py-2 text-sm outline-none focus:border-[#9B1C1C]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-200">
                Star Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['', '3', '4', '5'].map((s) => (
                  <button
                    key={s || 'all'}
                    onClick={() => update('starRating', s)}
                    className={`rounded-lg border px-3 py-1 text-xs font-bold ${
                      filters.starRating === s
                        ? 'border-[#9B1C1C] bg-[#9B1C1C] text-white'
                        : 'border-slate-300 dark:border-indigo-800 text-slate-700 dark:text-indigo-200'
                    }`}
                  >
                    {s ? `${s}★+` : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-200">
                Amenities
              </label>
              <div className="space-y-2">
                {amenityOptions.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-700 dark:text-indigo-200">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded accent-[#9B1C1C]"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-indigo-900/40">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-700 dark:text-indigo-200">
                <input
                  type="checkbox"
                  checked={filters.breakfastIncluded}
                  onChange={(e) => update('breakfastIncluded', e.target.checked)}
                  className="rounded accent-[#9B1C1C]"
                />
                Breakfast included
              </label>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-700 dark:text-indigo-200">
                <input
                  type="checkbox"
                  checked={filters.freeCancellation}
                  onChange={(e) => update('freeCancellation', e.target.checked)}
                  className="rounded accent-[#9B1C1C]"
                />
                Free cancellation
              </label>
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-indigo-900 py-16 text-center bg-white dark:bg-[#110D44]">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">No hotels match those exact filters</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-indigo-200/70">Try clearing filters or setting price to All.</p>
              <button
                onClick={() => setFilters({ city: '', minPrice: '', maxPrice: '', minRating: '', starRating: '', breakfastIncluded: false, freeCancellation: false, amenities: [], sort: 'newest', page: 1 })}
                className="mt-4 rounded-xl bg-[#9B1C1C] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1B1464]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
            </div>
          )}
          <Pagination page={filters.page} pages={pages} onChange={(p) => update('page', p)} />
        </div>
      </div>
    </div>
  );
};

export default Hotels;

