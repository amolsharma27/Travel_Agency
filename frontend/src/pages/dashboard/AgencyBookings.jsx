import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage, FiHome, FiCheckCircle, FiClock, FiDollarSign,
  FiPhone, FiMail, FiCalendar, FiUsers, FiSearch, FiFilter,
  FiCheck, FiX, FiEye, FiDownload, FiMessageSquare, FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';

const AgencyBookings = () => {
  const [tab, setTab] = useState('All'); // 'All' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchAgencyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/agency/bookings');
      if (Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load agency bookings:', err);
      setError('Could not load agency reservations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus.toLowerCase() });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: newStatus } : b));
      if (selectedBooking?._id === id) {
        setSelectedBooking(prev => ({ ...prev, bookingStatus: newStatus }));
      }
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status change failed:', err);
      toast.error('Failed to update booking status.');
    }
  };

  const filtered = bookings.filter(b => {
    const matchTab = tab === 'All' || b.bookingStatus?.toLowerCase() === tab.toLowerCase();
    const matchSearch = !search ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.itemTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone?.includes(search);
    return matchTab && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Agency Bookings &amp; Passenger Manifest
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View real passenger reservations, verify seat allocations, contact guests, and manage departures.
          </p>
        </div>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Tabs: All, Confirmed, Pending, Completed, Cancelled */}
        <div className="flex overflow-x-auto gap-1 scrollbar-none">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                tab === t
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'All' ? 'All Reservations' : t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, booking ref, tour..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading agency bookings...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={fetchAgencyBookings} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Bookings Table */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Tour / Stay</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Travellers</th>
                  <th className="pb-3">Amount &amp; Net Payout</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{b.bookingRef}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</p>
                    </td>
                    <td className="py-3.5 max-w-[180px]">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{b.itemTitle}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{b.type}</span>
                    </td>
                    <td className="py-3.5 text-slate-500 whitespace-nowrap">{b.travelDate}</td>
                    <td className="py-3.5 font-mono font-bold">{b.travellersCount} Guests</td>
                    <td className="py-3.5">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">₹{(b.grossAmount || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold font-mono">Net: ₹{(b.netPayout || 0).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="py-3.5">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                        >
                          View
                        </button>

                        {b.bookingStatus === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'Confirmed')}
                            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-200 transition"
                            title="Confirm Booking"
                          >
                            <FiCheck size={12} />
                          </button>
                        )}

                        {b.bookingStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'Cancelled')}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                            title="Cancel Booking"
                          >
                            <FiX size={12} />
                          </button>
                        )}

                        {b.customerPhone && (
                          <a
                            href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(b.customerName)},%20this%20is%20your%20tour%20operator%20regarding%20booking%20${encodeURIComponent(b.bookingRef)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            title="WhatsApp Contact"
                          >
                            <FaWhatsapp size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-400">
                      No bookings found for the selected tab.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Agency Passenger File</span>
                <h3 className="font-display text-lg font-black">{selectedBooking.bookingRef}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Lead Passenger:</span>
                <span className="font-bold">{selectedBooking.customerName} ({selectedBooking.customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono">{selectedBooking.customerEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Tour / Stay Reserved:</span>
                <span className="font-bold text-right max-w-xs">{selectedBooking.itemTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Departure / Travel Date:</span>
                <span className="font-bold">{selectedBooking.travelDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Boarding &amp; Pickup Point:</span>
                <span className="font-semibold">{selectedBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Guest Special Request:</span>
                <span className="italic text-slate-700 dark:text-slate-300">{selectedBooking.specialNotes}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Billing &amp; Net Payout:</span>
                <span className="font-mono font-bold text-emerald-600">
                  ₹{(selectedBooking.grossAmount || 0).toLocaleString('en-IN')} (Gross) → ₹{(selectedBooking.netPayout || 0).toLocaleString('en-IN')} (Net Payout)
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Booking Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedBooking.bookingStatus)}`}>
                  {selectedBooking.bookingStatus}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`mailto:${selectedBooking.customerEmail}?subject=Regarding%20your%20PCTE%20Travel%20Booking%20${selectedBooking.bookingRef}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FiMail /> Email Customer
              </a>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48] transition"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyBookings;
