import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import api from '../api/axios.js';
import HotelCard from '../components/HotelCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';

const amenityOptions = ['Free WiFi', 'Swimming Pool', 'Gym', 'Parking', 'Spa', 'Restaurant'];

const Hotels = () => {
  const [params, setParams] = useSearchParams();
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
      setHotels(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setHotels([]);
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">
            {loading ? 'Searching…' : `${total} stays found`}
          </p>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">
            {filters.city ? `Hotels in ${filters.city}` : 'All hotels'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value)}
            className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-lg border border-ink/10 dark:border-paper/20 px-3 py-2 text-sm md:hidden"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div>
            <label className="mb-1.5 block text-sm font-medium">City</label>
            <input
              value={filters.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="e.g. Ludhiana"
              className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Price per night</label>
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
            <label className="mb-1.5 block text-sm font-medium">Star category</label>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => update('starRating', filters.starRating === String(s) ? '' : String(s))}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    filters.starRating === String(s)
                      ? 'border-lagoon-500 bg-lagoon-50 dark:bg-lagoon-700/20 text-lagoon-700 dark:text-lagoon-300'
                      : 'border-ink/10 dark:border-paper/20'
                  }`}
                >
                  {s}★+
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Facilities</label>
            <div className="space-y-1.5">
              {amenityOptions.map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.breakfastIncluded}
                onChange={(e) => update('breakfastIncluded', e.target.checked)}
              />
              Breakfast included
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.freeCancellation}
                onChange={(e) => update('freeCancellation', e.target.checked)}
              />
              Free cancellation
            </label>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-20 text-center">
              <p className="font-display text-lg font-semibold">No hotels match those filters</p>
              <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Try widening your price range or clearing a filter.</p>
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
