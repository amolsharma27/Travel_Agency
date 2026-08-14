import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const AdminListings = () => {
  const [tab, setTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, h] = await Promise.all([
        api.get('/packages/admin/pending').catch(() => ({ data: { data: [] } })),
        api.get('/hotels/admin/pending').catch(() => ({ data: { data: [] } }))
      ]);
      setPackages(Array.isArray(p?.data?.data) ? p.data.data : []);
      setHotels(Array.isArray(h?.data?.data) ? h.data.data : []);
    } catch (err) {
      console.error('Failed to load pending listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const moderatePackage = async (id, status) => {
    try {
      await api.put(`/packages/${id}/moderate`, { status });
      toast.success(`Package status updated to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update package');
    }
  };

  const moderateHotel = async (id, status) => {
    try {
      await api.put(`/hotels/${id}/moderate`, { status });
      toast.success(`Hotel status updated to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update hotel');
    }
  };

  const items = Array.isArray(tab === 'packages' ? packages : hotels) ? (tab === 'packages' ? packages : hotels) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Listing Approvals</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Review and moderate submitted tour packages and hotels.</p>
        </div>

        <div className="flex gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 p-1 text-xs">
          {['packages', 'hotels'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-xs text-slate-500">Loading pending listings...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-14 text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No pending {tab} for approval</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {tab === 'packages' ? item.title : item.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tab === 'packages' ? `${item.destination} · ₹${item.price?.toLocaleString('en-IN') || item.price}` : `${item.city}, ${item.state}`}
                  {' · by '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {tab === 'packages' ? (item.agency?.agencyName || item.agency?.name || 'Partner Agency') : (item.owner?.agencyName || item.owner?.name || 'Partner Hotel')}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (tab === 'packages' ? moderatePackage(item._id, 'approved') : moderateHotel(item._id, 'approved'))}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => (tab === 'packages' ? moderatePackage(item._id, 'rejected') : moderateHotel(item._id, 'rejected'))}
                  className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminListings;
