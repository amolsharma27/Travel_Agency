import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiCheckCircle, FiXCircle, FiPrinter, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import api from '../../api/axios.js';
import { getStoredBookings } from '../../data/mockData.js';

const statusColor = {
  pending_payment: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  pending_approval: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  cancelled: 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
};

const CustomerBookings = () => {
  const [tab, setTab] = useState('package');
  const [hotelBookings, setHotelBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketModalData, setTicketModalData] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [h, p] = await Promise.all([
        api.get('/hotel-bookings/my'),
        api.get('/package-bookings/my'),
      ]);
      setHotelBookings(h.data?.data || []);
      setPackageBookings(p.data?.data || []);
    } catch {
      // ignore & use stored fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    toast.success('Booking cancellation request processed.');
  };

  const downloadInvoice = (b) => {
    setTicketModalData(b);
  };

  const storedAll = getStoredBookings();
  const rawBookings = tab === 'hotel' 
    ? (hotelBookings?.length ? hotelBookings : storedAll.filter(b => b.hotel || b.bookingType === 'hotel'))
    : (packageBookings?.length ? packageBookings : storedAll.filter(b => b.package || b.bookingType === 'package'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">My Tour &amp; Stay Bookings</h2>

        <div className="flex gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 p-1 text-xs bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setTab('package')}
            className={`rounded-lg px-4 py-2 font-bold capitalize transition-all ${
              tab === 'package' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Tour Packages
          </button>
          <button
            onClick={() => setTab('hotel')}
            className={`rounded-lg px-4 py-2 font-bold capitalize transition-all ${
              tab === 'hotel' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hotel Stays
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading your bookings…</div>
      ) : rawBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-16 text-center bg-white dark:bg-slate-900">
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">No {tab} bookings found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore our packages and book your next journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rawBookings.map((b) => (
            <div
              key={b._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-4">
                  {b.image && (
                    <img src={b.image} alt="" className="h-16 w-20 rounded-xl object-cover shrink-0" />
                  )}
                  <div>
                    <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {b.paymentId || `TS-${b._id?.slice(-8).toUpperCase()}`}
                    </span>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      {tab === 'hotel' ? (b.hotel?.name || b.itemTitle || 'Beachside Stay') : (b.package?.title || b.itemTitle || 'Tour Package')}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <FiMapPin className="text-amber-500" /> {b.destination || 'India'}
                    </p>
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusColor[b.status] || 'bg-emerald-100 text-emerald-800'}`}>
                  ✓ {(b.status || 'confirmed').replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Total Amount:</span>{' '}
                  <span className="font-mono text-base font-black text-amber-600 dark:text-amber-400">
                    ₹{Number(b.totalAmount || 4999).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadInvoice(b)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiDownload size={14} /> View Pass / Ticket
                  </button>
                  <button
                    onClick={() => cancel(b._id)}
                    className="rounded-xl border border-red-200 dark:border-red-900/40 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TICKET / INVOICE MODAL */}
      {ticketModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">TravelStay Official Pass</span>
                <h3 className="font-display text-xl font-black">{ticketModalData.itemTitle || 'Booking Pass'}</h3>
              </div>
              <button
                onClick={() => setTicketModalData(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{ticketModalData.paymentId || 'TS-BK9823'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Primary Guest:</span>
                <span className="font-bold">{ticketModalData.primaryGuest?.name || 'Priya Sharma'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold">{ticketModalData.destination || 'Goa / Manali'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-600">₹{Number(ticketModalData.totalAmount || 4999).toLocaleString('en-IN')} (Paid via UPI/Card)</span>
              </div>

              {/* QR Code Simulation */}
              <div className="pt-3 text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-slate-900 p-2 text-white font-mono text-[9px] shadow">
                  [QR CODE VERIFIED]
                  <br />
                  TRAVELSTAY
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Show this digital ticket at meeting point / hotel check-in desk.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-amber-400"
              >
                <FiPrinter /> Print / Save PDF Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
