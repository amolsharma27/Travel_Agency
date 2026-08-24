import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiBookOpen, FiSearch, FiFilter, FiDownload, FiCheckCircle,
  FiXCircle, FiEye, FiCalendar, FiMapPin, FiUser, FiDollarSign,
  FiClock, FiPrinter, FiShield, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';

const AdminBookings = () => {
  const [tab, setTab] = useState('all'); // 'all' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchAdminBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/admin/bookings');
      if (Array.isArray(res.data?.data)) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
      setError('Could not load master bookings ledger. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchTab = tab === 'all' || b.status?.toLowerCase() === tab.toLowerCase();
    const matchSearch = !search ||
      b.id?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.toLowerCase().includes(search.toLowerCase()) ||
      b.destination?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalGross = filtered.reduce((acc, curr) => acc + (curr.status?.toLowerCase() !== 'cancelled' ? (curr.amount || 0) : 0), 0);

  const handleUpdateStatus = async (item, newStatus) => {
    const bookingDbId = item._id || item.id;
    try {
      await api.put(`/bookings/${bookingDbId}/status`, { status: newStatus.toLowerCase() });
      setBookings(prev => prev.map(b => (b._id === bookingDbId || b.id === bookingDbId) ? { ...b, status: newStatus } : b));
      if (selectedBooking && (selectedBooking._id === bookingDbId || selectedBooking.id === bookingDbId)) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update error:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Booking ID,Customer,Email,Phone,Type,Service,Destination,Date,Amount,Status,Payment\n';
    const rows = filtered.map(b => `"${b.id || b._id}","${b.customer}","${b.email || ''}","${b.phone || ''}","${b.type}","${b.service}","${b.destination}","${b.travelDate}",${b.amount},"${b.status}","${b.payment}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PCTE_Bookings_Report_${Date.now()}.csv`;
    a.click();
    toast.success('Bookings report downloaded as CSV');
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Master Bookings &amp; Service Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform-wide customer reservations, ticketing status, escrow verification, and operator settlements.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiDownload /> Export Bookings CSV
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">{bookings.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Filtered Gross Sales</span>
          <p className="font-mono text-xl font-black text-emerald-600">₹{totalGross.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Confirmations</span>
          <p className="font-mono text-xl font-black text-amber-500">{bookings.filter(b => b.status?.toLowerCase() === 'pending').length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Confirmed Ratio</span>
          <p className="font-mono text-xl font-black text-blue-600">
            {bookings.length > 0 ? `${Math.round((bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length / bookings.length) * 100)}%` : '100%'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 scrollbar-none">
          {['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                tab === t
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'All Bookings' : t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer, tour, destination..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading master bookings ledger...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={fetchAdminBookings} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
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
                  <th className="pb-3">Service &amp; Operator</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Travel Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{b.id || b._id}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{b.customer}</p>
                      <p className="text-[10px] text-slate-400">{b.phone}</p>
                    </td>
                    <td className="py-3.5 max-w-[200px]">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{b.service}</p>
                      <p className="text-[10px] text-slate-400">By: {b.operator}</p>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{b.destination}</td>
                    <td className="py-3.5 text-slate-500 whitespace-nowrap">{b.travelDate}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{(b.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No bookings found matching your search or active filter.
            </div>
          )}
        </div>
      )}

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Travel Booking Dossier</span>
                <h3 className="font-display text-lg font-black">{selectedBooking.id || selectedBooking._id}</h3>
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
                <span className="text-slate-500">Lead Customer:</span>
                <span className="font-bold">{selectedBooking.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Contact Details:</span>
                <span>{selectedBooking.email} · {selectedBooking.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Title:</span>
                <span className="font-bold text-right max-w-xs">{selectedBooking.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Operator Partner:</span>
                <span>{selectedBooking.operator}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Travel Dates:</span>
                <span className="font-bold">{selectedBooking.travelDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Billed Amount:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(selectedBooking.amount || 0).toLocaleString('en-IN')} ({selectedBooking.payment || 'Paid'})</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Current Status:</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateStatus(selectedBooking, e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold outline-none"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48] transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
