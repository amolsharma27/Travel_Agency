import { useEffect, useState } from 'react';
import {
  FiSearch, FiFilter, FiUser, FiPhone, FiMail, FiBookOpen,
  FiCalendar, FiClock, FiCheckCircle, FiRefreshCw, FiTrash2,
  FiDownload, FiPrinter, FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enquiries');
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setEnquiries(data.data);
      } else {
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
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
      toast.success(`Status updated to "${newStatus}"`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete registration for student "${name}"?`)) return;

    try {
      await api.delete(`/enquiries/${id}`);
    } catch {
      // Local fallback
    }

    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    const local = JSON.parse(localStorage.getItem('pcte_student_enquiries') || '[]');
    const updated = local.filter((e) => e._id !== id);
    localStorage.setItem('pcte_student_enquiries', JSON.stringify(updated));
    toast.success(`Registration for ${name} removed.`);
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      toast.error('No registrations to export.');
      return;
    }

    const headers = 'Student Name,Roll Number,Course,Phone,Email,Tour Package,Request Type,Date,Time,Status,Notes\n';
    const rows = enquiries
      .map((e) =>
        `"${e.studentName}","${e.rollNumber}","${e.course}","${e.phone}","${e.email}","${e.packageTitle}","${e.requestType || 'Booking Request'}","${e.requestDate || ''}","${e.requestTime || ''}","${e.status || 'New'}","${(e.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PCTE_Student_Registrations_${Date.now()}.csv`;
    link.click();
    toast.success('Registrations exported to CSV!');
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesType = filterType === 'All' || e.requestType === filterType;
    const matchesStatus = filterStatus === 'All' || (e.status || 'New') === filterStatus;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      e.studentName?.toLowerCase().includes(query) ||
      e.rollNumber?.toLowerCase().includes(query) ||
      e.course?.toLowerCase().includes(query) ||
      e.packageTitle?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.phone?.includes(query);
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => (e.status || 'New') === 'New').length;
  const confirmedCount = enquiries.filter((e) => e.status === 'Confirmed').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Student Interest Desk
            </span>
            <span className="text-xs text-slate-400 font-bold">
              {totalCount} Total Registrations
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Student Tour Registrations &amp; Requests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View all students who signed up for tours, contact them via WhatsApp/Call, and manage seat confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEnquiries}
            title="Refresh List"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <FiDownload size={14} className="text-[#E11D48]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Registered</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalCount}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <FiUser size={18} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Pending / New Requests</span>
            <div className="text-2xl font-black text-amber-500 font-mono">{newCount}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <FiClock size={18} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Confirmed Allocations</span>
            <div className="text-2xl font-black text-emerald-500 font-mono">{confirmedCount}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll no, course..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['All', 'New', 'Contacted', 'Confirmed', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-[#0F2942] text-white dark:bg-white dark:text-[#0F2942]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Registrations Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E11D48] border-t-transparent" />
            <p className="mt-3 text-xs text-slate-400 font-bold uppercase">Loading Registrations...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-16 text-center">
            <FiAlertCircle className="mx-auto text-4xl text-amber-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Student Registrations Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Roll No &amp; Course</th>
                  <th className="p-4">Direct Contact</th>
                  <th className="p-4">Tour Package</th>
                  <th className="p-4">Registered On</th>
                  <th className="p-4">Status Action</th>
                  <th className="p-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredEnquiries.map((enq) => {
                  const status = enq.status || 'New';
                  const waNumber = enq.phone ? enq.phone.replace(/[^0-9]/g, '') : '';
                  const waUrl = `https://wa.me/91${waNumber}?text=${encodeURIComponent(
                    `Hello ${enq.studentName}, regarding your tour registration for ${enq.packageTitle} at PCTE Travels.`
                  )}`;

                  return (
                    <tr key={enq._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Student Name */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {enq.studentName}
                        </div>
                        {enq.notes && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1 max-w-[180px]">
                            &quot;{enq.notes}&quot;
                          </div>
                        )}
                      </td>

                      {/* Roll & Course */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {enq.rollNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[140px] block">
                          {enq.course}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${enq.phone}`}
                            className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-[#E11D48]"
                          >
                            {enq.phone}
                          </a>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded bg-emerald-500/10 p-1 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                            title="Chat on WhatsApp"
                          >
                            <FaWhatsapp size={13} />
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {enq.email}
                        </div>
                      </td>

                      {/* Tour Package */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white block text-xs">
                          {enq.packageTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {enq.destination} {enq.tourPrice ? `• ${enq.tourPrice}` : ''}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400">
                        <div>{enq.requestDate || 'Recent'}</div>
                        <div className="text-[10px] text-slate-400">{enq.requestTime || ''}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className={`rounded-lg border text-[11px] font-bold px-2.5 py-1.5 outline-none ${
                            status === 'Confirmed'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : status === 'Contacted'
                              ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Delete */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(enq._id, enq.studentName)}
                          title="Delete Registration"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminEnquiries;
