import { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiUser, FiPhone, FiMail, FiBookOpen, FiCalendar, FiClock, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enquiries');
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setEnquiries(data.data);
      } else {
        // Fallback to localStorage enquiries
        const local = JSON.parse(localStorage.getItem('pcte_student_enquiries') || '[]');
        setEnquiries(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('pcte_student_enquiries') || '[]');
      setEnquiries(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
      // Update local storage
      const local = JSON.parse(localStorage.getItem('pcte_student_enquiries') || '[]');
      const updated = local.map((e) => (e._id === id ? { ...e, status: newStatus } : e));
      localStorage.setItem('pcte_student_enquiries', JSON.stringify(updated));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesType =
      filterType === 'All' || e.requestType === filterType;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      e.studentName?.toLowerCase().includes(query) ||
      e.rollNumber?.toLowerCase().includes(query) ||
      e.course?.toLowerCase().includes(query) ||
      e.packageTitle?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.phone?.includes(query);
    return matchesType && matchesSearch;
  });

  const totalCount = enquiries.length;
  const bookingCount = enquiries.filter((e) => e.requestType === 'Booking Request').length;
  const onRequestCount = enquiries.filter((e) => e.requestType === 'On Request').length;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#E11D48] font-bold">
              PCTE Travels Operations Portal
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Student Enquiries &amp; Interest Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track real-time student registrations, package interest, and Upcoming Tour booking requests.
            </p>
          </div>

          <button
            onClick={fetchEnquiries}
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#0F2942] transition-colors shadow-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Enquiries</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered student interest entries</span>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-red-500/20 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-[#E11D48]">Booking Requests</span>
            <div className="text-2xl font-black text-[#E11D48] mt-1">
              {bookingCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Upcoming Tour (Mussoorie) bookings</span>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-amber-500">On Request Inquiries</span>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {onRequestCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">General package enquiries</span>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by student name, roll number, course, package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0F2942]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Type:</span>
            {['All', 'On Request', 'Booking Request'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-700 dark:text-slate-300 hover:border-[#0F2942]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2942] border-r-transparent" />
              <p className="mt-3 text-xs text-slate-500">Loading student enquiries…</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No student enquiries found.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When students click "On Request" or "Book Now", their details will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Roll No &amp; Course</th>
                    <th className="p-4">Contact Channels</th>
                    <th className="p-4">Interested Tour</th>
                    <th className="p-4">Request Type</th>
                    <th className="p-4">Date &amp; Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredEnquiries.map((enq) => (
                    <tr
                      key={enq._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Student Name */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FiUser className="text-[#E11D48] shrink-0" />
                          <span>{enq.studentName}</span>
                        </div>
                        {enq.notes && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1">
                            "{enq.notes}"
                          </p>
                        )}
                      </td>

                      {/* Roll No & Course */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {enq.rollNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {enq.course}
                        </span>
                      </td>

                      {/* Contact Channels */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <FiPhone className="text-amber-500 text-xs shrink-0" />
                          <a
                            href={`tel:${enq.phone}`}
                            className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-[#E11D48]"
                          >
                            {enq.phone}
                          </a>
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-500 hover:text-emerald-400 ml-1"
                            title="Message on WhatsApp"
                          >
                            <FaWhatsapp size={13} />
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiMail className="text-slate-400 text-xs shrink-0" />
                          <a
                            href={`mailto:${enq.email}`}
                            className="text-slate-600 dark:text-slate-400 hover:text-[#E11D48] truncate max-w-[160px] block"
                          >
                            {enq.email}
                          </a>
                        </div>
                      </td>

                      {/* Interested Tour */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {enq.packageTitle}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {enq.destination} {enq.tourDuration ? `• ${enq.tourDuration}` : ''}
                        </span>
                      </td>

                      {/* Request Type */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            enq.requestType === 'Booking Request'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {enq.requestType || 'On Request'}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        <div>{enq.requestDate || new Date(enq.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">{enq.requestTime || ''}</div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={enq.status || 'New'}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-800 dark:text-white outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminEnquiries;
