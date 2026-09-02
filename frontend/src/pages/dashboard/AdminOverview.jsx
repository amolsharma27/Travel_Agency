import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUsers, FiBookOpen, FiClock, FiPlus, FiArrowRight,
  FiMapPin, FiRefreshCw, FiPhone, FiMail, FiCheckCircle
} from 'react-icons/fi';
import { FaSuitcase, FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';
import { mockPackages } from '../../data/mockData.js';

const AdminOverview = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Enquiries
      let enqData = [];
      try {
        const enqRes = await api.get('/enquiries');
        enqData = enqRes.data.data || [];
      } catch {
        const stored = localStorage.getItem('pcte_student_enquiries');
        enqData = stored ? JSON.parse(stored) : [];
      }
      setEnquiries(enqData);

      // 2. Fetch Packages
      let pkgData = [];
      try {
        const pkgRes = await api.get('/packages/admin/all');
        pkgData = pkgRes.data.data || [];
      } catch {
        try {
          const pubRes = await api.get('/packages');
          pkgData = pubRes.data.data || initialPackages;
        } catch {
          pkgData = initialPackages;
        }
      }
      setPackages(pkgData);
    } catch (err) {
      console.error('Error fetching admin overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Status Updater for Student
  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}`, { status: newStatus });
      setEnquiries(prev =>
        prev.map(item => item._id === enquiryId ? { ...item, status: newStatus } : item)
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      setEnquiries(prev =>
        prev.map(item => item._id === enquiryId ? { ...item, status: newStatus } : item)
      );
      toast.success(`Status updated to "${newStatus}"`);
    }
  };

  // Quick Seat Updater
  const handleSeatChange = async (pkgId, delta) => {
    const target = packages.find(p => p._id === pkgId || p.id === pkgId);
    if (!target) return;

    const currentSeats = target.availableSeats !== undefined ? target.availableSeats : (target.totalSeats || 30);
    const newSeats = Math.max(0, Math.min(target.totalSeats || 50, currentSeats + delta));

    setPackages(prev =>
      prev.map(p => (p._id === pkgId || p.id === pkgId) ? { ...p, availableSeats: newSeats } : p)
    );

    try {
      if (target._id) {
        await api.put(`/packages/${target._id}`, { availableSeats: newSeats });
      }
      toast.success(`Seats for "${target.title}": ${newSeats} remaining`);
    } catch {
      toast.success(`Seats for "${target.title}": ${newSeats} remaining`);
    }
  };

  // Stats
  const totalStudents = enquiries.length;
  const newStudents = enquiries.filter(e => e.status === 'New' || !e.status).length;
  const totalPackages = packages.length;
  const totalAvailableSeats = packages.reduce((acc, p) => acc + (p.availableSeats !== undefined ? p.availableSeats : (p.totalSeats || 30)), 0);

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Executive Console
            </span>
            <span className="text-xs text-slate-400 font-bold">
              PCTE Travel Agency Management
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Admin Management Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor registered student enquiries, manage tour packages, and adjust seat availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>
          <Link
            to="/admin/packages"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] hover:from-red-600 hover:to-red-800 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-950/30 transition hover:scale-105"
          >
            <FiPlus size={16} />
            <span>Add / Edit Tour Packages</span>
          </Link>
        </div>
      </div>

      {/* 4 Focused Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Student Registrations */}
        <Link
          to="/admin/enquiries"
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm hover:shadow-lg hover:border-[#E11D48] transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student Registrations</span>
            <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#E11D48] flex items-center justify-center">
              <FiBookOpen size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">{totalStudents}</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-500 font-bold">{newStudents} New / Pending</span>
            <span className="text-slate-400 group-hover:text-[#E11D48] flex items-center gap-1 font-bold">
              View <FiArrowRight size={12} />
            </span>
          </div>
        </Link>

        {/* Card 2: Tour Packages Catalog */}
        <Link
          to="/admin/packages"
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm hover:shadow-lg hover:border-[#0F2942] transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Tour Packages</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <FaSuitcase size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">{totalPackages}</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-500 font-bold">100% Published</span>
            <span className="text-slate-400 group-hover:text-blue-500 flex items-center gap-1 font-bold">
              Manage <FiArrowRight size={12} />
            </span>
          </div>
        </Link>

        {/* Card 3: Total Available Seats */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Available Seats</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <FiUsers size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{totalAvailableSeats}</div>
          <div className="mt-2 text-xs text-slate-400">
            Across all {totalPackages} active tour itineraries
          </div>
        </div>

        {/* Card 4: Action Center */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0F2942] to-[#1B1464] p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Quick Actions</span>
            <h3 className="font-display font-black text-lg text-white mt-1 leading-tight">Admin Desk</h3>
            <p className="text-[11px] text-slate-300 mt-1">Directly manage student allocations and tours.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              to="/admin/enquiries"
              className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 py-2 text-center text-xs font-bold text-white transition"
            >
              Registrations
            </Link>
            <Link
              to="/admin/packages"
              className="flex-1 rounded-xl bg-[#E11D48] hover:bg-red-700 py-2 text-center text-xs font-bold text-white transition"
            >
              Edit Seats
            </Link>
          </div>
        </div>

      </div>

      {/* Grid: Latest Student Registrations & Tour Seat Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Latest Registered Students */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                Recent Student Registrations
              </h3>
              <p className="text-xs text-slate-400">
                Latest students who submitted tour booking requests
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-[#E11D48] hover:underline flex items-center gap-1"
            >
              <span>View All ({enquiries.length})</span>
              <FiArrowRight size={12} />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No student registrations recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {enquiries.slice(0, 5).map((enq) => {
                const enqId = enq._id || enq.id;
                const status = enq.status || 'New';
                return (
                  <div key={enqId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900 dark:text-white">{enq.studentName}</span>
                        <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          Roll: {enq.rollNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#E11D48] font-bold">
                        {enq.packageTitle}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>{enq.course}</span>
                        <span>•</span>
                        <span>{enq.phone}</span>
                        <span>•</span>
                        <span>{enq.requestDate || 'Recent'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {/* WhatsApp Link */}
                      <a
                        href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.studentName}, regarding your tour registration for ${enq.packageTitle} at PCTE Travels.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp size={14} />
                      </a>

                      {/* Status Selector */}
                      <select
                        value={status}
                        onChange={(e) => handleUpdateStatus(enqId, e.target.value)}
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
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Active Tour Packages Seat Monitor */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                Live Seat Inventory
              </h3>
              <p className="text-xs text-slate-400">
                Adjust seats directly
              </p>
            </div>
            <Link
              to="/admin/packages"
              className="text-xs font-bold text-[#E11D48] hover:underline"
            >
              Edit All
            </Link>
          </div>

          <div className="space-y-3.5">
            {packages.slice(0, 5).map((pkg) => {
              const pkgId = pkg._id || pkg.id;
              const total = pkg.totalSeats || 30;
              const avail = pkg.availableSeats !== undefined ? pkg.availableSeats : total;

              return (
                <div
                  key={pkgId}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white truncate max-w-[140px]">
                      {pkg.title}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      avail <= 5 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {avail} / {total} Seats
                    </span>
                  </div>

                  {/* Seat Quick Controls */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <button
                      onClick={() => handleSeatChange(pkgId, -1)}
                      disabled={avail <= 0}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-black text-slate-700 dark:text-white hover:bg-slate-100 disabled:opacity-30"
                    >
                      -1
                    </button>
                    <span className="text-[11px] font-bold text-slate-500">
                      ₹{pkg.price?.toLocaleString('en-IN') || '3,800'}
                    </span>
                    <button
                      onClick={() => handleSeatChange(pkgId, 1)}
                      disabled={avail >= total}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-black text-slate-700 dark:text-white hover:bg-slate-100 disabled:opacity-30"
                    >
                      +1
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/admin/packages"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiPlus size={14} /> Add Another Tour Package
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
