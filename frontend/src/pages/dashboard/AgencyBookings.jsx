import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const AgencyBookings = () => {
  const [tab, setTab] = useState('hotel');
  const [hotelBookings, setHotelBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [h, p] = await Promise.all([api.get('/hotel-bookings/owner'), api.get('/package-bookings/agency')]);
      setHotelBookings(h.data.data);
      setPackageBookings(p.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (type, id, action) => {
    try {
      const endpoint = type === 'hotel' ? `/hotel-bookings/${id}/respond` : `/package-bookings/${id}/respond`;
      await api.put(endpoint, { action });
      toast.success(`Booking ${action}d`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update booking');
    }
  };

  const bookings = tab === 'hotel' ? hotelBookings : packageBookings;

  return (
    <div>
      <div className="mb-5 flex gap-2 rounded-lg border border-ink/10 dark:border-paper/20 p-1 text-sm w-fit">
        {['hotel', 'package'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-1.5 font-medium capitalize ${tab === t ? 'bg-lagoon-500 text-paper' : 'text-ink/60 dark:text-paper/60'}`}>
            {t} bookings
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
          <p className="font-display text-lg font-semibold">No {tab} bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-ink/50 dark:text-paper/50">{b.bookingReference}</p>
                  <p className="font-medium">{tab === 'hotel' ? b.hotel?.name : b.package?.title}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">{b.customer?.name} · {b.customer?.email} · ₹{b.totalAmount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-ink/5 dark:bg-paper/10 px-3 py-1 text-xs font-semibold capitalize">{b.status.replace('_', ' ')}</span>
                  {b.status === 'pending_approval' && (
                    <>
                      <button onClick={() => respond(tab, b._id, 'approve')} className="rounded-lg bg-lagoon-500 px-3 py-1.5 text-xs font-semibold text-paper hover:bg-lagoon-600">Approve</button>
                      <button onClick={() => respond(tab, b._id, 'reject')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyBookings;
