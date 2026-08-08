import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiTag, FiSearch } from 'react-icons/fi';
import api from '../api/axios.js';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { getStoredPackages } from '../data/mockData.js';

const categories = ['All', 'Adventure', 'Beach', 'Honeymoon', 'Cultural', 'Historical', 'Pilgrimage'];

const budgetRanges = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹5,000 (Super Budget)', min: '', max: '5000' },
  { label: '₹5,000 - ₹10,000 (Affordable Escapes)', min: '5000', max: '10000' },
  { label: '₹10,000 - ₹20,000 (Complete Holidays)', min: '10000', max: '20000' },
];

const Packages = () => {
  const [params] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    category: params.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  });

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const cleanParams = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '' && v !== 'All')
        );
        const { data } = await api.get('/packages', { params: cleanParams });
        if (data?.data && data.data.length > 0) {
          setPackages(data.data);
          setTotal(data.total);
          setPages(data.pages || 1);
        } else {
          const fallback = getStoredPackages();
          setPackages(fallback);
          setTotal(fallback.length);
          setPages(1);
        }
      } catch {
        const fallback = getStoredPackages();
        setPackages(fallback);
        setTotal(fallback.length);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const handleBudgetSelect = (min, max) => {
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600 font-semibold">
            {loading ? 'Searching tour packages…' : `${total} verified itineraries found`}
          </p>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Tour Packages & Escapes</h1>
        </div>

        <select
          value={filters.sort}
          onChange={(e) => update('sort', e.target.value)}
          className="rounded-lg border border-ink/10 dark:border-paper/20 bg-white dark:bg-ink-light px-3 py-2 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High (Budget Friendly)</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated (4.8+)</option>
        </select>
      </div>

      {/* QUICK BUDGET FILTER BUTTONS */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-bold uppercase text-lagoon-600 mr-1">
          <FiTag /> Budget Deals:
        </span>
        {budgetRanges.map((b) => {
          const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
          return (
            <button
              key={b.label}
              onClick={() => handleBudgetSelect(b.min, b.max)}
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

      {/* SEARCH AND CATEGORY CONTROLS */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-3 text-ink/40" />
          <input
            value={filters.q}
            onChange={(e) => update('q', e.target.value)}
            placeholder="Search destination (Manali, Goa, Rishikesh...)"
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent pl-9 pr-3 py-2 text-sm outline-none focus:border-lagoon-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const isSel = (filters.category === c) || (c === 'All' && !filters.category);
            return (
              <button
                key={c}
                onClick={() => update('category', c === 'All' ? '' : c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSel
                    ? 'bg-lagoon-500 text-white shadow-sm'
                    : 'border border-ink/10 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:bg-ink/5'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center bg-white dark:bg-ink-light">
          <p className="font-display text-lg font-semibold">No packages match your search</p>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Try searching another destination or clear budget filters.</p>
          <button
            onClick={() => setFilters({ q: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
            className="mt-4 rounded-xl bg-lagoon-500 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
        </div>
      )}
      <Pagination page={filters.page} pages={pages} onChange={(p) => update('page', p)} />
    </div>
  );
};

export default Packages;

