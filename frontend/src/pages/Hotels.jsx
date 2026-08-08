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
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600 font-semibold">
            {loading ? 'Searching stays…' : `${total} verified stays available`}
          </p>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {filters.city ? `Hotels & Stays in ${filters.city}` : 'All Hotels, Hostels & Resorts'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value)}
            className="rounded-lg border border-ink/10 dark:border-paper/20 bg-white dark:bg-ink-light px-3 py-2 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High (Budget First)</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated (4.8+)</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-lg border border-ink/10 dark:border-paper/20 px-3 py-2 text-sm md:hidden"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* QUICK BUDGET FILTER CHIPS */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-bold uppercase text-lagoon-600 mr-1">
          <FiTag /> Quick Budgets:
        </span>
        {budgetRanges.map((b) => {
          const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
          return (
            <button
              key={b.label}
              onClick={() => handleBudgetQuickSelect(b.min, b.max)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-lagoon-500 text-white shadow-sm'
                  : 'border border-ink/10 dark:border-paper/20 bg-white dark:bg-ink-light text-ink/70 dark:text-paper/70 hover:border-lagoon-500'
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-5 space-y-5 shadow-sm">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-paper/70">
                City / Location
              </label>
              <input
                value={filters.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="e.g. Manali, Goa, Jaipur"
                className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-paper/70">
                Price per night (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => update('minPrice', e.target.value)}
                  className="w-1/2 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => update('maxPrice', e.target.value)}
                  className="w-1/2 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-paper/70">
                Star Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['', '3', '4', '5'].map((s) => (
                  <button
                    key={s || 'all'}
                    onClick={() => update('starRating', s)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                      filters.starRating === s
                        ? 'border-lagoon-500 bg-lagoon-500 text-white'
                        : 'border-ink/10 dark:border-paper/20'
                    }`}
                  >
                    {s ? `${s}★+` : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-paper/70">
                Amenities
              </label>
              <div className="space-y-2">
                {amenityOptions.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded border-ink/20 accent-lagoon-500"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-ink/5 dark:border-paper/10">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.breakfastIncluded}
                  onChange={(e) => update('breakfastIncluded', e.target.checked)}
                  className="rounded accent-lagoon-500"
                />
                Breakfast included
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.freeCancellation}
                  onChange={(e) => update('freeCancellation', e.target.checked)}
                  className="rounded accent-lagoon-500"
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
            <div className="rounded-2xl border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center bg-white dark:bg-ink-light">
              <p className="font-display text-lg font-semibold">No hotels match those exact filters</p>
              <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Try clearing filters or setting price to All.</p>
              <button
                onClick={() => setFilters({ city: '', minPrice: '', maxPrice: '', minRating: '', starRating: '', breakfastIncluded: false, freeCancellation: false, amenities: [], sort: 'newest', page: 1 })}
                className="mt-4 rounded-xl bg-lagoon-500 px-4 py-2 text-xs font-semibold text-white"
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

