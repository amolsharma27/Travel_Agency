import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';
import api from '../../api/axios.js';

const statusColor = {
  pending_payment: 'bg-ink/10 text-ink/60 dark:bg-paper/10 dark:text-paper/60',
  pending_approval: 'bg-sand-400/20 text-sand-600',
  confirmed: 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300',
  rejected: 'bg-red-50 text-red-600 dark:bg-red-900/20',
  cancelled: 'bg-ink/10 text-ink/50 dark:bg-paper/10 dark:text-paper/50',
  completed: 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300',
};

const CustomerBookings = () => {
  const [tab, setTab] = useState('hotel');
  const [hotelBookings, setHotelBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [h, p] = await Promise.all([
        api.get('/hotel-bookings/my'),
        api.get('/package-bookings/my'),
      ]);
      setHotelBookings(h.data.data);
      setPackageBookings(p.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (type, id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const endpoint = type === 'hotel' ? `/hotel-bookings/${id}/cancel` : `/package-bookings/${id}/cancel`;
      await api.put(endpoint, {});
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel');
    }
  };

  const downloadInvoice = async (type, id) => {
    const res = await api.get(`/invoices/${type}/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink/50 dark:text-paper/50">{b.bookingReference}</p>
                  <h3 className="font-display text-base font-semibold">
                    {tab === 'hotel' ? b.hotel?.name : b.package?.title}
                    {tab === 'hotel' && ` — ${b.room?.name}`}
                  </h3>
                  {tab === 'hotel' ? (
                    <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
                      {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.nights} nights · {b.roomsBooked} room(s)
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
                      Travel date: {new Date(b.travelDate).toLocaleDateString()} · {b.seatsBooked} traveller(s)
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[b.status]}`}>
                  {b.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-lg font-semibold">₹{b.totalAmount}</span>
                <div className="flex gap-2">
                  {['confirmed', 'completed'].includes(b.status) && (
                    <button onClick={() => downloadInvoice(tab, b._id)} className="flex items-center gap-1.5 rounded-lg border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-xs font-semibold">
                      <FiDownload size={13} /> Invoice
                    </button>
                  )}
                  {['pending_approval', 'confirmed'].includes(b.status) && (
                    <button onClick={() => cancel(tab, b._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                      Cancel
                    </button>
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

export default CustomerBookings;
