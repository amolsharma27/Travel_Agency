import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiTag, FiCompass, FiSliders, FiCheck } from 'react-icons/fi';
import api from '../api/axios.js';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import { getStoredPackages } from '../data/mockData.js';

const tourCategories = ['All', 'Group Tours', 'Private Tours', 'Adventure Tours'];

const budgetRanges = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹6,000 (Weekend Getaways)', min: '', max: '6000' },
  { label: '₹6,000 - ₹15,000 (Popular Trips)', min: '6000', max: '15000' },
  { label: '₹15,000+ (Spiti & Luxury Holidays)', min: '15000', max: '' },
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
        // fallback
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
        const cat = filters.category.toLowerCase();
        local = local.filter(p =>
          p.category?.toLowerCase() === cat ||
          p.tourType?.toLowerCase() === cat
        );
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
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Title & Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#E11D48] font-bold">
              {loading ? 'Searching packages…' : `${total} Verified Tour Packages Available`}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Tours &amp; Holiday Packages
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <FiCompass /> Request Custom Plan
            </button>

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
          </div>
        </div>

        {/* Quick Budget Chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400 mr-1">
            <FiTag /> Quick Filters:
          </span>
          {budgetRanges.map((b) => {
            const isSelected = filters.minPrice === b.min && filters.maxPrice === b.max;
            return (
              <button
                key={b.label}
                onClick={() => handleBudgetSelect(b.min, b.max)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
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

        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
            <input
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Search destination, region (Manali, Spiti, Rajasthan, Kashmir, Goa...)"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tourCategories.map((c) => {
              const isSel = (filters.category === c) || (c === 'All' && !filters.category);
              return (
                <button
                  key={c}
                  onClick={() => update('category', c === 'All' ? '' : c)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                    isSel
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center bg-white dark:bg-[#0F1D30] shadow-sm">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No Tour Packages Match Your Search</h3>
            <p className="mt-2 text-xs text-slate-500">
              Try clearing filters or changing your destination keyword.
            </p>
            <button
              onClick={() => setFilters({ q: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
              className="mt-4 rounded-lg bg-[#0F2942] px-6 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
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
