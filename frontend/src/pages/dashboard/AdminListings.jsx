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
      const [p, h] = await Promise.all([api.get('/packages/admin/pending'), api.get('/hotels/admin/pending')]);
      setPackages(p.data.data);
      setHotels(h.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const moderatePackage = async (id, status) => {
    try {
      await api.put(`/packages/${id}/moderate`, { status });
      toast.success(`Package ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update package');
    }
  };

  const moderateHotel = async (id, status) => {
    try {
      await api.put(`/hotels/${id}/moderate`, { status });
      toast.success(`Hotel ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update hotel');
    }
  };

  const items = tab === 'packages' ? packages : hotels;

  return (
    <div>
      <div className="mb-5 flex gap-2 rounded-lg border border-ink/10 dark:border-paper/20 p-1 text-sm w-fit">
        {['packages', 'hotels'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-1.5 font-medium capitalize ${tab === t ? 'bg-lagoon-500 text-paper' : 'text-ink/60 dark:text-paper/60'}`}>
            Pending {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
          <p className="font-display text-lg font-semibold">Nothing pending approval</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
              <div>
                <p className="font-medium">{tab === 'packages' ? item.title : item.name}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">
                  {tab === 'packages' ? `${item.destination} · ₹${item.price}` : `${item.city}, ${item.state}`}
                  {' · by '}
                  {tab === 'packages' ? item.agency?.agencyName : item.owner?.agencyName}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (tab === 'packages' ? moderatePackage(item._id, 'approved') : moderateHotel(item._id, 'approved'))}
                  className="rounded-lg bg-lagoon-500 px-3 py-1.5 text-xs font-semibold text-paper hover:bg-lagoon-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => (tab === 'packages' ? moderatePackage(item._id, 'rejected') : moderateHotel(item._id, 'rejected'))}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500"
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
