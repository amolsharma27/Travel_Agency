import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiDownload, FiCheckCircle, FiXCircle, FiPrinter, FiCalendar,
  FiMapPin, FiUser, FiShield, FiTruck, FiActivity, FiHome, FiCompass,
  FiPhone, FiMail, FiMessageSquare, FiEye, FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';

const CustomerBookings = () => {
  const [tab, setTab] = useState('All'); // 'All' | 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled'
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);
  const [ticketModalData, setTicketModalData] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/customer/bookings');
      if (Array.isArray(res.data?.data)) {
        setAllBookings(res.data.data);
      } else {
        // Fallback to /bookings/my
        const fallbackRes = await api.get('/bookings/my');
        setAllBookings(fallbackRes.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Could not load your bookings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be processed as per cancellation policy.')) return;
    try {
      await api.put(`/bookings/${id}/cancel`, { reason: 'Cancelled by customer' });
      setAllBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      if (selectedBookingModal?._id === id) {
        setSelectedBookingModal(prev => ({ ...prev, status: 'cancelled' }));
      }
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  const filteredBookings = allBookings.filter((b) => {
    const status = b.status?.toLowerCase() || '';
    if (tab === 'All') return true;
    if (tab === 'Upcoming') return ['confirmed', 'pending_approval', 'pending'].includes(status) && new Date(b.travelDate) >= new Date(Date.now() - 86400000);
    if (tab === 'Pending') return ['pending', 'pending_approval', 'under_review'].includes(status);
    if (tab === 'Completed') return status === 'completed' || (status === 'confirmed' && new Date(b.travelDate) < new Date(Date.now() - 86400000));
    if (tab === 'Cancelled') return status === 'cancelled' || status === 'rejected';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'pending':
      case 'pending_approval':
      case 'under_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'cancelled':
      case 'rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            My Bookings &amp; Service Reservations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your confirmed tour departures, hotel stays, mobility ticket passes, and view boarding details.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              tab === t
                ? 'bg-[#0F2942] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t === 'All' ? 'All Bookings' : t}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={loadBookings} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0F2942] dark:text-amber-400">
                    {b.bookingRef || b._id}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-2">
                    Booked on {new Date(b.bookingDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Payment: <b className="text-emerald-600 font-mono capitalize">{b.paymentStatus || 'Paid'}</b>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(b.status)}`}>
                    {b.status || 'Confirmed'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={b.image || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80'}
                    alt={b.itemTitle}
                    className="h-16 w-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {b.itemTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{b.destination}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Travel Date: <b className="text-slate-700 dark:text-slate-300">{new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b> · Travellers: <b>{b.guestsCount || 1} Persons</b>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Paid</span>
                  <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                    ₹{(b.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingModal(b)}
                    className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-1.5 font-bold transition shadow"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => setTicketModalData(b)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                  >
                    <FiPrinter /> Download Ticket
                  </button>

                  <a
                    href={`https://wa.me/919814519578?text=Hello%20PCTE%20Travel%20Agency,%20I%20have%20an%20inquiry%20regarding%20my%20booking%20${encodeURIComponent(b.bookingRef || b._id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition"
                  >
                    <FaWhatsapp /> Contact Agency
                  </a>
                </div>

                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <button
                    onClick={() => cancel(b._id)}
                    className="text-slate-400 hover:text-rose-600 font-bold transition text-[11px]"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30]">
              No bookings found in the "{tab}" tab.
            </div>
          )}
        </div>
      )}

      {/* DETAILED BOOKING MODAL */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Booking Dossier</span>
                <h3 className="font-display text-lg font-black">{selectedBookingModal.bookingRef || selectedBookingModal._id}</h3>
              </div>
              <button onClick={() => setSelectedBookingModal(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Title:</span>
                <span className="font-bold text-right max-w-xs">{selectedBookingModal.itemTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Destination:</span>
                <span>{selectedBookingModal.destination}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-bold">{new Date(selectedBookingModal.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Number of Travellers:</span>
                <span className="font-bold">{selectedBookingModal.guestsCount || 1} Persons</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Billed Amount:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(selectedBookingModal.totalAmount || 0).toLocaleString('en-IN')} (Paid)</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedBookingModal.status)}`}>
                  {selectedBookingModal.status || 'Confirmed'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setTicketModalData(selectedBookingModal);
                  setSelectedBookingModal(null);
                }}
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow transition"
              >
                View / Print Ticket
              </button>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE TICKET MODAL */}
      {ticketModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Travel Agency Boarding Pass</span>
                <h3 className="font-display text-lg font-black">{ticketModalData.bookingRef || ticketModalData._id}</h3>
              </div>
              <button onClick={() => setTicketModalData(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0F2942] text-white flex justify-between items-center">
                <div>
                  <p className="font-bold">{ticketModalData.itemTitle}</p>
                  <p className="text-[11px] text-slate-300">{ticketModalData.destination}</p>
                </div>
                <span className="text-xs font-bold text-amber-300 capitalize">{ticketModalData.status} Pass</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Departure Date:</span>
                <span className="font-bold">{new Date(ticketModalData.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Travellers:</span>
                <span className="font-bold">{ticketModalData.guestsCount || 1} Persons</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(ticketModalData.totalAmount || 0).toLocaleString('en-IN')} (Paid)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                  setTicketModalData(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold transition shadow"
              >
                <FiPrinter /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerBookings;
