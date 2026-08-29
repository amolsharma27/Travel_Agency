import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUsers, FiBriefcase, FiClock, FiDollarSign, FiPackage, FiHome,
  FiBookOpen, FiLifeBuoy, FiTrendingUp, FiCheckCircle, FiShield,
  FiActivity, FiTruck, FiArrowUpRight, FiCalendar, FiFilter,
  FiDownload, FiPrinter, FiEye, FiServer, FiLayers, FiMapPin,
  FiPlusCircle, FiAlertCircle, FiMessageSquare, FiCompass, FiCheck, FiX
} from 'react-icons/fi';
import { FaPassport, FaSuitcase, FaHotel, FaPlane, FaBus, FaHiking } from 'react-icons/fa';
import api from '../../api/axios.js';

const StatCard = ({ icon: Icon, label, value, badge, badgeColor, subtext }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all space-y-2 flex flex-col justify-between">
    <div className="flex items-center justify-between gap-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{label}</p>
      {Icon && (
        <div className="p-1.5 rounded-lg bg-[#0F2942]/10 dark:bg-slate-800 text-[#0F2942] dark:text-amber-400 shrink-0">
          <Icon size={14} />
        </div>
      )}
    </div>
    <div className="flex items-baseline justify-between gap-1">
      <p className="font-mono text-xl font-black text-slate-900 dark:text-white truncate">{value}</p>
      {badge && (
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 ${badgeColor || 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'}`}>
          {badge}
        </span>
      )}
    </div>
    {subtext && <p className="text-[10px] text-slate-400 truncate">{subtext}</p>}
  </div>
);

const AdminOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRange, setActiveRange] = useState('8M');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pendingList, setPendingList] = useState([]);

  const fetchAdminAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data?.data) {
        setData(res.data.data);
        setPendingList(res.data.data.pendingApprovals || []);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
      setError('Could not load platform analytics. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const handleQuickApprove = async (item) => {
    try {
      if (item.category === 'agency') {
        await api.put(`/dashboard/admin/agencies/${item.id}/status`, { agencyStatus: 'approved' });
      } else if (item.category === 'package') {
        await api.put(`/dashboard/admin/listings/package/${item.id}/status`, { status: 'approved' });
      } else if (item.category === 'hotel') {
        await api.put(`/dashboard/admin/listings/hotel/${item.id}/status`, { status: 'approved' });
      }
      setPendingList(prev => prev.filter(p => p.id !== item.id));
      toast.success(`${item.title} approved successfully`);
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error('Could not process approval.');
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading platform telemetry &amp; live database records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-6 text-center space-y-3">
        <FiAlertCircle className="mx-auto text-red-500 text-2xl" />
        <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchAdminAnalytics}
          className="rounded-xl bg-[#0F2942] text-white text-xs font-bold px-4 py-2 hover:bg-[#E11D48] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const grossSales = data?.revenue?.grossSales ?? 0;
  const platformProfit = data?.revenue?.platformNetProfit ?? 0;
  const totalBookings = data?.bookings?.totalBookings ?? 0;
  const totalCustomers = data?.users?.totalCustomers ?? 0;
  const totalAgencies = data?.users?.totalAgencies ?? 0;
  const pendingAgencies = data?.users?.pendingAgencies ?? 0;
  const monthlyRevenueData = data?.monthlyRevenueData || [];
  const serviceDistribution = data?.serviceDistribution || [];
  const recentBookings = data?.recentBookings || [];
  const recentActivityFeed = data?.recentActivityFeed || [];
  const topDestinations = data?.topDestinations || [];
  const bookingStatusStats = data?.bookingStatusStats || [];

  const maxGross = Math.max(...monthlyRevenueData.map(m => m.gross || 0), 10);
  const chartScale = maxGross > 0 ? 140 / (maxGross * 1.25) : 1;

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & QUICK ACTIONS ROW */}
      <div className="bg-white dark:bg-[#0F1D30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-white">
                Platform Operations &amp; Financial Control Center
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live database telemetry, operator moderation, booking passes, and gateway settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#pending-approvals"
              className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-2 text-xs font-bold shadow transition-colors"
            >
              <FiCheckCircle /> Moderate ({pendingList.length} Pending)
            </a>
            <Link
              to="/admin/users"
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold transition-colors"
            >
              <FiUsers /> Users ({totalCustomers + totalAgencies})
            </Link>
          </div>
        </div>

        {/* Real-time System Error / Health Alert Banner */}
        {data?.systemHealth?.recentErrors?.length > 0 && (
          <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 space-y-2 text-rose-900 dark:text-rose-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <FiAlertCircle className="text-rose-600 text-base shrink-0" />
                <span>System Health Telemetry: Recent API Exception Logged</span>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                Memory: {data.systemHealth.memoryUsage || 'Normal'}
              </span>
            </div>
            <div className="space-y-1">
              {data.systemHealth.recentErrors.slice(0, 2).map((err, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] bg-white/70 dark:bg-black/30 p-2 rounded-lg font-mono">
                  <span>[{err.method}] {err.endpoint} ➔ {err.message}</span>
                  <span className="text-slate-400 text-[10px]">{new Date(err.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Admin Quick Actions
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <Link
              to="/admin/listings"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-[#0F2942] text-white">
                <FiPackage size={13} />
              </div>
              <span className="truncate">Add Tour</span>
            </Link>

            <Link
              to="/admin/listings"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <FiHome size={13} />
              </div>
              <span className="truncate">Add Stay</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <FiUsers size={13} />
              </div>
              <span className="truncate">Manage Users</span>
            </Link>

            <Link
              to="/admin/agencies"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                <FiShield size={13} />
              </div>
              <span className="truncate">Agencies ({totalAgencies})</span>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-[#E11D48] text-white">
                <FiBookOpen size={13} />
              </div>
              <span className="truncate">All Bookings</span>
            </Link>

            <Link
              to="/admin/support"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <FiMessageSquare size={13} />
              </div>
              <span className="truncate">Support Messages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 6-KPI FINANCIAL & VOLUME STATS */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={FiDollarSign}
          label="Total Gross Sales"
          value={`₹${grossSales.toLocaleString('en-IN')}`}
          badge={totalBookings > 0 ? `${totalBookings} Total` : 'Live'}
          subtext="Calculated from real bookings"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Platform Net Profit"
          value={`₹${platformProfit.toLocaleString('en-IN')}`}
          badge="8.5% Commission"
          subtext="Net platform revenue"
        />
        <StatCard
          icon={FiBookOpen}
          label="Total Bookings"
          value={totalBookings}
          badge="100% Fulfilled"
          subtext="Tours, Stays &amp; Mobility"
        />
        <StatCard
          icon={FiUsers}
          label="Registered Users"
          value={`${totalCustomers} Clients`}
          badge={`${totalAgencies} Agencies`}
          badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
          subtext="Verified Travelers"
        />
        <StatCard
          icon={FiPackage}
          label="Active Packages"
          value={`${data?.packages?.total ?? 0} Listed`}
          badge="Live"
          badgeColor="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
          subtext="Group &amp; Private Tours"
        />
        <StatCard
          icon={FiServer}
          label="System Gateway"
          value="99.98%"
          badge="Operational"
          subtext="Escrow &amp; Webhooks Active"
        />
      </div>

      {/* 3. CORE VISUAL GRAPHS SECTION */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Gross Sales vs Net Platform Profit Area Trend (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Gross Volume vs Platform Profit Trajectory
              </h3>
              <p className="text-xs text-slate-500">Real database monthly aggregation (Figures in Thousands ₹).</p>
            </div>
            
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {['8M', '1Y'].map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeRange === r
                      ? 'bg-[#0F2942] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Multi-Layer Chart */}
          <div className="pt-2">
            <div className="h-60 w-full relative">
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="45" y1="30" x2="680" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="80" x2="680" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="130" x2="680" y2="130" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="180" x2="680" y2="180" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="210" x2="680" y2="210" stroke="#cbd5e1" className="dark:stroke-slate-700" />

                {/* Y-axis Labels */}
                <text x="5" y="34" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxGross * 1.25)}k</text>
                <text x="5" y="114" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxGross * 0.6)}k</text>
                <text x="15" y="214" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

                {/* Bars for Monthly Bookings */}
                {monthlyRevenueData.map((d, i) => {
                  const x = 75 + i * 78;
                  const barH = Math.max((d.gross || 0) * chartScale, 4);
                  const y = 210 - barH;
                  return (
                    <g
                      key={d.month}
                      className="group cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(d)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <rect
                        x={x - 14}
                        y={y}
                        width="28"
                        height={barH}
                        rx="4"
                        fill="#0F2942"
                        className="dark:fill-slate-600 transition-all hover:opacity-100"
                      />
                      <text x={x} y="228" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                        {d.month}
                      </text>
                      {d.gross > 0 && (
                        <text x={x} y={y - 6} fontSize="9" textAnchor="middle" fill="#E11D48" fontWeight="bold" fontFamily="monospace">
                          ₹{d.gross}k
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip display */}
            {hoveredPoint && (
              <div className="mt-2 rounded-xl bg-slate-900 text-white p-3 text-xs flex items-center justify-between border border-slate-700 shadow-xl">
                <div>
                  <span className="font-bold text-amber-400">{hoveredPoint.month} Summary:</span>
                  <span className="ml-2">Gross Volume: <b>₹{hoveredPoint.gross}k</b></span>
                  <span className="ml-2">Platform Net Profit: <b className="text-emerald-400">₹{hoveredPoint.profit}k</b></span>
                  <span className="ml-2">Bookings: <b>{hoveredPoint.bookings}</b></span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="h-3 w-3 rounded bg-[#0F2942] dark:bg-slate-600" /> Gross Volume
              </span>
              <span className="flex items-center gap-2 text-[#E11D48]">
                <span className="h-3 w-3 rounded bg-[#E11D48]" /> Commission Retained (8.5%)
              </span>
            </div>
          </div>
        </div>

        {/* Service Stream Breakdown (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiLayers className="text-[#0F2942] dark:text-amber-400" /> Service Revenue Streams
              </h3>
              <p className="text-xs text-slate-500">Live share of gross billing by product category</p>
            </div>

            <div className="space-y-3 pt-1">
              {serviceDistribution.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{s.share}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.share}%`, backgroundColor: s.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{s.count}</span>
                    <span>{s.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/bookings"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0F2942] hover:text-white text-slate-700 dark:text-slate-200 py-2.5 text-xs font-bold transition"
            >
              Inspect Master Bookings Ledger →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. RECENT PLATFORM BOOKINGS & PENDING APPROVALS */}
      <div className="grid gap-6 lg:grid-cols-12" id="pending-approvals">
        {/* Left: Recent Bookings Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiBookOpen className="text-emerald-500" /> Recent Platform Bookings
              </h3>
              <p className="text-xs text-slate-500">Live booking stream across all customer reservations</p>
            </div>
            <Link to="/admin/bookings" className="text-xs font-bold text-[#E11D48] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono font-bold text-[#0F2942] dark:text-amber-400">{b.id || b._id}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{b.customer}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{b.service}</td>
                    <td className="py-3 font-mono font-bold">₹{(b.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}

                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-400">
                      No platform bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pending Approvals & Moderation Queue (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiShield className="text-amber-500" /> Pending Moderation Queue
                </h3>
                <p className="text-xs text-slate-500">{pendingList.length} items awaiting administrative approval</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              {pendingList.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-amber-600 block">{item.type}</span>
                    <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.applicant} · {item.date}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleQuickApprove(item)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      title="Quick Approve"
                    >
                      <FiCheck size={12} />
                    </button>
                    <Link
                      to={item.link}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                      title="View Details"
                    >
                      <FiEye size={12} />
                    </Link>
                  </div>
                </div>
              ))}

              {pendingList.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <FiCheckCircle className="mx-auto text-emerald-500 text-xl mb-1" />
                  All operator registrations and listings are up to date!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY FEED & TOP DESTINATIONS */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Activity Stream (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Platform Live Activity Feed
            </h3>
            <p className="text-xs text-slate-500">Real-time platform events and milestones</p>
          </div>

          <div className="space-y-3 text-xs">
            {recentActivityFeed.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                  <FiBookOpen size={14} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-white">{act.event}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations Heatmap (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiMapPin className="text-[#E11D48]" /> Top Destination Demand Circuits
            </h3>
            <p className="text-xs text-slate-500">Most booked travel destinations across North India</p>
          </div>

          <div className="space-y-3 text-xs">
            {topDestinations.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
                  <span className="font-mono font-bold text-emerald-600">{d.revenue}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F2942] dark:bg-amber-400 rounded-full" style={{ width: `${d.share}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{d.bookings} Group Bookings</span>
                  <span className="text-emerald-500">{d.trend} Demand</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSPECTION MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Platform Master Inspection</span>
                <h3 className="font-display text-base font-black">{selectedBooking.id || selectedBooking._id}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold">{selectedBooking.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-right max-w-[200px]">{selectedBooking.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Destination:</span>
                <span>{selectedBooking.destination}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-bold">{selectedBooking.travelDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Amount Billed:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(selectedBooking.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOverview;
