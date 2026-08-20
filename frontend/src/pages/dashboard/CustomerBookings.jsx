import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiDownload, FiCheckCircle, FiXCircle, FiPrinter, FiCalendar,
  FiMapPin, FiUser, FiShield, FiTruck, FiActivity, FiHome, FiCompass
} from 'react-icons/fi';
import { FaPassport, FaPlane, FaBus, FaTrain } from 'react-icons/fa';
import api from '../../api/axios.js';
import { getStoredBookings, getStoredPassportRequests } from '../../data/mockData.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const statusColor = {
  confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  under_review: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400',
};

const CustomerBookings = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'package' | 'hotel' | 'activity' | 'transportation' | 'passport'
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketModalData, setTicketModalData] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.data?.length) {
        setAllBookings(res.data.data);
      } else {
        setAllBookings(getStoredBookings());
      }
    } catch {
      setAllBookings(getStoredBookings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setAllBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    toast.success('Booking cancellation request processed.');
  };

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'package') return b.bookingType === 'package' || b.package;
    if (activeTab === 'hotel') return b.bookingType === 'hotel' || b.hotel;
    if (activeTab === 'activity') return b.bookingType === 'activity' || b.activity;
    if (activeTab === 'transportation') return b.bookingType === 'transportation';
    if (activeTab === 'passport') return b.bookingType === 'passport';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">My Bookings &amp; Service Requests</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage all tour bookings, stays, activities, transit tickets, and passport assistance requests.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {[
          { id: 'all', label: 'All Bookings', count: allBookings.length },
          { id: 'package', label: 'Tours', icon: FiCompass },
          { id: 'hotel', label: 'Stays & Hotels', icon: FiHome },
          { id: 'activity', label: 'Activities', icon: FiActivity },
          { id: 'transportation', label: 'Transportation', icon: FiTruck },
          { id: 'passport', label: 'Passport Requests', icon: FiShield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#0F2942] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading your reservations…</div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-16 text-center bg-white dark:bg-[#0F1D30]">
          <p className="font-display text-base font-bold text-slate-900 dark:text-white">No {activeTab !== 'all' ? activeTab : ''} bookings found</p>
          <p className="text-xs text-slate-500 mt-1">Explore our services and book your next trip!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-4">
                  {(b.image || b.images?.[0] || b.package?.images?.[0] || b.hotel?.images?.[0] || b.activity?.image) && (
                    <img 
                      src={b.image || b.images?.[0] || b.package?.images?.[0] || b.hotel?.images?.[0] || b.activity?.image} 
                      alt="" 
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-16 w-20 rounded-xl object-cover shrink-0 bg-slate-900" 
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">
                        {b.bookingType || 'Booking'}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#E11D48]">
                        Ref: {b.applicationTrackingId || b.ticketReference || b.paymentId || b._id}
                      </span>
                    </div>

                    <h3 className="font-display text-sm md:text-base font-bold text-slate-900 dark:text-white">
                      {b.itemTitle || b.package?.title || b.hotel?.name || 'Travel Reservation'}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <FiMapPin className="text-[#E11D48] shrink-0" size={12} />
                      {b.destination || b.preferredPSK || b.location || 'India'}
                      {b.slotTime && <span>· Slot: <b>{b.slotTime}</b></span>}
                    </p>
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor[b.status] || statusColor.confirmed}`}>
                  ✓ {(b.status || 'confirmed').replace('_', ' ')}
                </span>
              </div>

              {/* Passport specific metadata */}
              {b.bookingType === 'passport' && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1 border border-slate-200 dark:border-slate-700">
                  <p><b>Applicant Name:</b> {b.applicantName || 'Primary Applicant'}</p>
                  <p><b>PSK Appointment Center:</b> {b.destination || b.preferredPSK}</p>
                  <p className="text-slate-500">Document pre-screening kit verified. Appointment assistance tracking active.</p>
                </div>
              )}

              {/* Actions & Price Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="text-xs text-slate-500">
                  <span>Total Amount Paid:</span>{' '}
                  <span className="font-mono text-base font-black text-slate-900 dark:text-white ml-1">
                    ₹{Number(b.totalAmount || 4999).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTicketModalData(b)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiDownload size={13} /> View Invoice &amp; Pass
                  </button>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => cancel(b._id)}
                      className="rounded-lg border border-red-200 dark:border-red-900/40 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TICKET / INVOICE MODAL */}
      {ticketModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#E11D48] tracking-wider">PCTE Travel Agency — Official Receipt</span>
                <h3 className="font-display text-lg font-black">{ticketModalData.itemTitle || 'Reservation Pass'}</h3>
              </div>
              <button
                onClick={() => setTicketModalData(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Reference Tracking ID:</span>
                <span className="font-mono font-bold text-[#0F2942] dark:text-amber-400">{ticketModalData.applicationTrackingId || ticketModalData.paymentId || 'PCTE-BK-9823'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Category:</span>
                <span className="font-bold uppercase">{ticketModalData.bookingType || 'Tour'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="font-bold">{ticketModalData.primaryGuest?.name || ticketModalData.applicantName || 'Amol Sharma'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-mono font-bold text-emerald-600">₹{Number(ticketModalData.totalAmount || 4999).toLocaleString('en-IN')} (Paid)</span>
              </div>

              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">Confirmed / Verified</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48] transition-all"
              >
                <FiPrinter /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
