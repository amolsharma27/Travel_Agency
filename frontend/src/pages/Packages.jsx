import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Pagination from '../components/Pagination.jsx';

const categories = ['Adventure', 'Historical', 'Beach', 'Nature', 'Cultural', 'Honeymoon', 'Family', 'Pilgrimage'];

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
        const cleanParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        const { data } = await api.get('/packages', { params: cleanParams });
        setPackages(data.data);
        setTotal(data.total);
        setPages(data.pages);
      } catch {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">{loading ? 'Searching…' : `${total} packages found`}</p>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">Tour packages</h1>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <input
          value={filters.q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="Search destination or title"
          className="w-64 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
        />
        <select value={filters.category} onChange={(e) => update('category', e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Min price" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} className="w-28 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        <input type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} className="w-28 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-20 text-center">
          <p className="font-display text-lg font-semibold">No packages match your search</p>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Try a different destination or clear a filter.</p>
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
