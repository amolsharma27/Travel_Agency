import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiTag, FiSearch, FiCompass } from 'react-icons/fi';
import api from '../api/axios.js';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import { getStoredPackages } from '../data/mockData.js';

const categories = ['All', 'Weekend Tours', 'Educational Journeys', 'Adventure', 'Beach', 'Honeymoon', 'Cultural', 'Pilgrimage'];

const budgetRanges = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹5,000 (Weekend Deals)', min: '', max: '5000' },
  { label: '₹5,000 - ₹15,000 (Popular Trips)', min: '5000', max: '15000' },
  { label: '₹15,000+ (Spiti & Luxury)', min: '15000', max: '' },
];

const Packages = () => {
  const [params] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);

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
        if (data?.data?.length) {
          setPackages(data.data);
          setTotal(data.total);
          setPages(data.pages || 1);
          setLoading(false);
          return;
        }
      } catch {
        // local fallback
      }

      let local = getStoredPackages();

      if (filters.q) {
        const query = filters.q.toLowerCase();
        local = local.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.destination.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      if (filters.category && filters.category !== 'All') {
        local = local.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
      }

      if (filters.minPrice) {
        local = local.filter(p => (p.discountPrice || p.price) >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        local = local.filter(p => (p.discountPrice || p.price) <= parseInt(filters.maxPrice));
      }

      if (filters.sort === 'price_asc') {
        local.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (filters.sort === 'price_desc') {
        local.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (filters.sort === 'rating_desc') {
        local.sort((a, b) => b.rating - a.rating);
      }

      setPackages(local);
      setTotal(local.length);
      setPages(1);
      setLoading(false);
    };

    fetchPackages();
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const handleBudgetSelect = (min, max) => {
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };

  return (
    <div className="bg-[#FAFAF9] dark:bg-[#0B0830] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-extrabold">
              {loading ? 'Searching PCTE tour packages…' : `${total} Verified Packages Found`}
            </span>
            <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Tours &amp; Holiday Packages
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#9B1C1C] hover:bg-[#1B1464] text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <FiCompass /> Request Custom Plan
            </button>

            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="rounded-md border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated (4.8+)</option>
            </select>
          </div>
        </div>

        {/* QUICK PRICE DEALS */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-[#9B1C1C] dark:text-red-400 mr-1">
            <FiTag /> Quick Deals:
          </span>
          {budgetRanges.map((b) => {
            const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
            return (
              <button
                key={b.label}
                onClick={() => handleBudgetSelect(b.min, b.max)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
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

        {/* SEARCH AND CATEGORY FILTER BAR */}
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-4 shadow-sm">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Search tour, destination (Jibhi, Spiti, Rajasthan, Goa...)"
              className="w-full rounded-md border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 pl-10 pr-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#9B1C1C]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const isSel = (filters.category === c) || (c === 'All' && !filters.category);
              return (
                <button
                  key={c}
                  onClick={() => update('category', c === 'All' ? '' : c)}
                  className={`rounded-md px-3.5 py-2 text-xs font-bold transition-all ${
                    isSel
                      ? 'bg-[#9B1C1C] text-white shadow-sm'
                      : 'border border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-indigo-900/60'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-indigo-900 p-16 text-center bg-white dark:bg-[#110D44] shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">No Tour Packages Match Your Search</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-indigo-200/70">
              Try resetting your destination query or budget filter.
            </p>
            <button
              onClick={() => setFilters({ q: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
              className="mt-4 rounded-md bg-[#9B1C1C] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B1464]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-10">
            <Pagination page={filters.page} pages={pages} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
          </div>
        )}

        <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
      </div>
    </div>
  );
};

export default Packages;
