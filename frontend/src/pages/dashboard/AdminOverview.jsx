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

// Multi-month revenue telemetry
const monthlyRevenueData = [
  { month: 'Jan', gross: 620, profit: 52.7, bookings: 78, visitors: 1420 },
  { month: 'Feb', gross: 780, profit: 66.3, bookings: 94, visitors: 1680 },
  { month: 'Mar', gross: 950, profit: 80.7, bookings: 118, visitors: 1950 },
  { month: 'Apr', gross: 1120, profit: 95.2, bookings: 142, visitors: 2240 },
  { month: 'May', gross: 1350, profit: 114.7, bookings: 176, visitors: 2890 },
  { month: 'Jun', gross: 1540, profit: 130.9, bookings: 198, visitors: 3120 },
  { month: 'Jul', gross: 1680, profit: 142.8, bookings: 215, visitors: 3450 },
  { month: 'Aug', gross: 1845, profit: 156.8, bookings: 242, visitors: 3820 },
];

const weeklySpikesData = [
  { day: 'Mon', count: 18, share: '7%' },
  { day: 'Tue', count: 24, share: '10%' },
  { day: 'Wed', count: 32, share: '13%' },
  { day: 'Thu', count: 48, share: '20%' },
  { day: 'Fri', count: 68, share: '28%' }, // Peak Friday departure booking
  { day: 'Sat', count: 34, share: '14%' },
  { day: 'Sun', count: 18, share: '8%' },
];

const serviceDistribution = [
  { name: 'Tour Packages (Group & Private)', share: 42, color: '#0F2942', count: '102 Bookings', revenue: '₹7.74 Lakhs' },
  { name: 'Hotels, Resorts & Homestays', share: 28, color: '#E11D48', count: '68 Bookings', revenue: '₹5.16 Lakhs' },
  { name: 'Transportation (Flight/Train/Bus/Cab)', share: 16, color: '#D97706', count: '39 Bookings', revenue: '₹2.95 Lakhs' },
  { name: 'Adventure Thrills & Activities', share: 9, color: '#10B981', count: '22 Bookings', revenue: '₹1.66 Lakhs' },
  { name: 'Passport Assistance Dossiers', share: 5, color: '#6366F1', count: '12 Applications', revenue: '₹0.94 Lakhs' },
];

// Realistic recent platform bookings
const mockRecentBookings = [
  { id: 'BK-2026-8801', customer: 'Amol Sharma', email: 'amolsharma2705@gmail.com', phone: '+91 98145 19578', service: 'Himachal Group Tour (Jibhi & Jalori Pass)', destination: 'Jibhi & Tirthan Valley', travelDate: '28 Aug 2026', amount: 11998, status: 'Confirmed', payment: 'Paid (UPI)' },
  { id: 'BK-2026-8802', customer: 'Priya Verma', email: 'priya.verma@example.com', phone: '+91 98765 11998', service: 'Kashmir Paradise Group Tour (5D/4N)', destination: 'Srinagar & Gulmarg', travelDate: '02 Sep 2026', amount: 29998, status: 'Confirmed', payment: 'Paid (NetBanking)' },
  { id: 'BK-2026-8803', customer: 'Karanvir Singh', email: 'karanvir.s@example.com', phone: '+91 94683 99221', service: 'Snow Valley Himalayan Cedar Resort (2N)', destination: 'Manali, HP', travelDate: '05 Sep 2026', amount: 6998, status: 'Pending', payment: 'Escrow Pending' },
  { id: 'BK-2026-8804', customer: 'Harpreet Kaur', email: 'harpreet.k@example.com', phone: '+91 98881 22334', service: 'Rajasthan Royal Heritage Group Tour', destination: 'Jaipur & Jodhpur', travelDate: '15 Sep 2026', amount: 19600, status: 'Confirmed', payment: 'Paid (Credit Card)' },
  { id: 'BK-2026-8805', customer: 'Rahul Mehra', email: 'rahul.m@gmail.com', phone: '+91 98111 44556', service: 'Tatkaal Passport Assistance File', destination: 'PSK Ludhiana', travelDate: '29 Aug 2026', amount: 4399, status: 'Completed', payment: 'Settled' },
  { id: 'BK-2026-8806', customer: 'Sunita Goyal', email: 'sunita.g@yahoo.com', phone: '+91 98722 33441', service: 'Goa Coastal Villa & Cruise Gateway', destination: 'Candolim, Goa', travelDate: '20 Sep 2026', amount: 14500, status: 'Cancelled', payment: 'Refund Processed' }
];

// Pending Approvals Moderation Items
const initialPendingApprovals = [
  { id: 'mod_01', type: 'Agency Registration', title: 'Himalayan Wanderers Spiti & Manali', applicant: 'Rajesh Negi', date: '21 Aug 2026, 14:10', status: 'Pending Review', link: '/admin/users' },
  { id: 'mod_02', type: 'Tour Package', title: 'Kasol & Tosh Alpine Village Camping (3D/2N)', applicant: 'PCTE Himalayan Club', date: '21 Aug 2026, 11:30', status: 'Awaiting Approval', link: '/admin/listings' },
  { id: 'mod_03', type: 'Stay Listing', title: 'Cedar Pine Wooden Chalet (Jibhi)', applicant: 'Tirthan Valley Hosts', date: '20 Aug 2026, 18:45', status: 'Awaiting Approval', link: '/admin/listings' },
  { id: 'mod_04', type: 'Passport Request', title: 'Tatkaal Adult Passport Assistance (PSK Ludhiana)', applicant: 'Amol Sharma', date: '20 Aug 2026, 15:20', status: 'Under Review', link: '/admin/passport' },
  { id: 'mod_05', type: 'Fleet Route', title: 'Delhi to Manali AC Volvo Sleeper Route', applicant: 'Northern Express Fleet', date: '19 Aug 2026, 09:15', status: 'Pending Verification', link: '/admin/listings' }
];

// Recent Real-Time Activity Feed
const recentActivityFeed = [
  { id: 'act_1', event: 'New booking received', detail: 'Amol Sharma booked Himachal Group Tour (₹11,998)', time: '2 minutes ago', icon: FiBookOpen, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'act_2', event: 'Payment completed', detail: 'Priya Verma paid ₹29,998 via HDFC NetBanking for Kashmir Tour', time: '15 minutes ago', icon: FiDollarSign, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  { id: 'act_3', event: 'New customer registered', detail: 'Harmanpreet Singh joined from Amritsar, Punjab', time: '42 minutes ago', icon: FiUsers, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
  { id: 'act_4', event: 'Agency added a new tour', detail: 'PCTE Expeditions added "Spiti 4x4 Snow Leopard Trek"', time: '1 hour ago', icon: FiPackage, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'act_5', event: 'Package approved', detail: 'Jaipur & Udaipur Royal Forts tour listing was verified by Super Admin', time: '2 hours ago', icon: FiCheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'act_6', event: 'Passport request submitted', detail: 'New fresh passport dossier (MEA-LDH-2026-88192) under pre-screening', time: '3 hours ago', icon: FaPassport, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
  { id: 'act_7', event: 'Support ticket created', detail: 'Urgent PSK appointment rescheduling request by client', time: '4 hours ago', icon: FiLifeBuoy, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
];

const topDestinationsData = [
  { name: 'Kashmir (Srinagar & Gulmarg)', bookings: 94, share: 88, revenue: '₹14.1L', trend: '+32%' },
  { name: 'Manali & Solang Valley', bookings: 76, share: 72, revenue: '₹6.8L', trend: '+19%' },
  { name: 'Rajasthan (Jaipur & Jaisalmer)', bookings: 62, share: 58, revenue: '₹9.4L', trend: '+14%' },
  { name: 'Goa (Beaches & Water Sports)', bookings: 54, share: 50, revenue: '₹7.2L', trend: '+22%' },
  { name: 'Shimla & Jibhi Valley', bookings: 48, share: 44, revenue: '₹4.6L', trend: '+27%' },
];

const bookingStatusStats = [
  { label: 'Confirmed', count: 184, share: '76%', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Pending', count: 32, share: '13%', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'Completed', count: 18, share: '7%', color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Cancelled', count: 8, share: '4%', color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400' },
];

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
  const [activeRange, setActiveRange] = useState('8M');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pendingList, setPendingList] = useState(initialPendingApprovals);

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data }) => setData(data.data || {})).catch(() => {});
  }, []);

  const handleQuickApprove = (id) => {
    setPendingList(prev => prev.filter(item => item.id !== id));
    toast.success('Approval processed successfully');
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
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
              Live telemetry, operator moderation, booking passes, and gateway settlements.
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
              <FiUsers /> Users (1,840)
            </Link>
          </div>
        </div>

        {/* A. QUICK ACTIONS TILES */}
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
              to="/admin/listings"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                <FiShield size={13} />
              </div>
              <span className="truncate">Review Pending</span>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-[#E11D48] text-white">
                <FiBookOpen size={13} />
              </div>
              <span className="truncate">View Bookings</span>
            </Link>

            <Link
              to="/admin/support"
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <FiMessageSquare size={13} />
              </div>
              <span className="truncate">Support Tickets</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 6-KPI FINANCIAL & VOLUME STATS */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={FiDollarSign}
          label="Total Gross Sales"
          value="₹18,45,000"
          badge="+24.8%"
          subtext="Lifetime billing volume"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Platform Net Profit"
          value="₹1,56,800"
          badge="8.5% Take"
          subtext="Net commission retained"
        />
        <StatCard
          icon={FiBookOpen}
          label="Total Bookings"
          value="242"
          badge="100% Fulfilled"
          subtext="Tours, Stays & Mobility"
        />
        <StatCard
          icon={FiUsers}
          label="Active Travelers"
          value="48 Guests"
          badge="On Road"
          badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
          subtext="Friday weekend batches"
        />
        <StatCard
          icon={FaPassport}
          label="Passport Files"
          value="19 Active"
          badge="Pre-Screened"
          badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          subtext="Ludhiana & Chd PSK"
        />
        <StatCard
          icon={FiServer}
          label="System Gateway"
          value="99.98%"
          badge="Operational"
          subtext="Escrow & Webhooks Active"
        />
      </div>

      {/* 3. CORE VISUAL GRAPHS SECTION */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Gross Sales vs Net Platform Profit Area Trend (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Gross Volume vs Platform Profit Trajectory (2026)
              </h3>
              <p className="text-xs text-slate-500">Scale in Thousands (₹). Real-time monthly volume aggregation.</p>
            </div>
            
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {['7D', '30D', '90D', '8M', '1Y'].map((r) => (
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
                <defs>
                  <linearGradient id="grossVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F2942" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0F2942" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E11D48" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#E11D48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="45" y1="30" x2="680" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="80" x2="680" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="130" x2="680" y2="130" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="180" x2="680" y2="180" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="45" y1="210" x2="680" y2="210" stroke="#cbd5e1" className="dark:stroke-slate-700" />

                {/* Y-axis Labels */}
                <text x="5" y="34" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹18L</text>
                <text x="5" y="84" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹14L</text>
                <text x="5" y="134" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹10L</text>
                <text x="5" y="184" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹5L</text>
                <text x="15" y="214" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

                {/* Bars for Monthly Bookings */}
                {monthlyRevenueData.map((d, i) => {
                  const x = 75 + i * 78;
                  const barH = (d.bookings / 260) * 160;
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
                        fill="#D97706"
                        opacity="0.8"
                        className="transition-all hover:opacity-100"
                      />
                      <text x={x} y="228" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                        {d.month}
                      </text>
                      <text x={x} y={y - 6} fontSize="9" textAnchor="middle" fill="#D97706" fontWeight="bold" fontFamily="monospace">
                        {d.bookings} bk
                      </text>
                    </g>
                  );
                })}

                {/* Area Gradient Path for Gross Volume */}
                <path
                  d="M 75,170 Q 153,150 231,130 T 387,90 T 543,55 T 621,35 L 621,210 L 75,210 Z"
                  fill="url(#grossVolumeGrad)"
                />

                {/* Gross Volume Trend Line */}
                <path
                  d="M 75,170 Q 153,150 231,130 T 387,90 T 543,55 T 621,35"
                  fill="none"
                  stroke="#0F2942"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="dark:stroke-amber-400"
                />

                {/* Platform Net Profit Line */}
                <path
                  d="M 75,195 Q 153,185 231,175 T 387,155 T 543,135 T 621,118"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* Coordinate Nodes */}
                {[
                  { cx: 75, cy: 170, d: monthlyRevenueData[0] },
                  { cx: 153, cy: 150, d: monthlyRevenueData[1] },
                  { cx: 231, cy: 130, d: monthlyRevenueData[2] },
                  { cx: 309, cy: 110, d: monthlyRevenueData[3] },
                  { cx: 387, cy: 90, d: monthlyRevenueData[4] },
                  { cx: 465, cy: 72, d: monthlyRevenueData[5] },
                  { cx: 543, cy: 55, d: monthlyRevenueData[6] },
                  { cx: 621, cy: 35, d: monthlyRevenueData[7] },
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke="#0F2942"
                    strokeWidth="2.5"
                    className="dark:stroke-amber-400 cursor-pointer hover:r-7 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt.d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>
            </div>

            {/* Hover Tooltip display */}
            {hoveredPoint && (
              <div className="mt-2 rounded-xl bg-slate-900 text-white p-3 text-xs flex items-center justify-between border border-slate-700 shadow-xl animate-fade-in">
                <div>
                  <span className="font-bold text-amber-400">{hoveredPoint.month} 2026 Summary:</span>
                  <span className="ml-2">Gross Volume: <b>₹{hoveredPoint.gross}k</b></span>
                  <span className="ml-2">Platform Net Profit: <b className="text-emerald-400">₹{hoveredPoint.profit}k</b></span>
                  <span className="ml-2">Bookings: <b>{hoveredPoint.bookings}</b></span>
                </div>
                <span className="text-[10px] text-slate-400">{hoveredPoint.visitors} Monthly Inquiries</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="flex items-center gap-2 text-[#0F2942] dark:text-amber-400">
                <span className="h-3 w-3 rounded-full bg-[#0F2942] dark:bg-amber-400" /> Gross Volume (₹)
              </span>
              <span className="flex items-center gap-2 text-[#E11D48]">
                <span className="h-2.5 w-6 rounded bg-[#E11D48] border-dashed border-white" /> Net Profit Commission (₹)
              </span>
              <span className="flex items-center gap-2 text-amber-600">
                <span className="h-3 w-3 rounded-md bg-amber-500" /> Monthly Bookings
              </span>
            </div>
          </div>
        </div>

        {/* Service Distribution (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Service Stream Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution across 5 platform categories</p>
          </div>

          <div className="space-y-3.5">
            {serviceDistribution.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="font-mono">{cat.share}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{cat.count}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{cat.revenue}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Conversion Insight:</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Himachal group departures &amp; Kashmir luxury circuits drive 70% of gross margin.
            </p>
          </div>
        </div>
      </div>

      {/* 4. B. RECENT BOOKINGS TABLE & C. PENDING APPROVALS GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* B. RECENT BOOKINGS (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiBookOpen className="text-[#E11D48]" /> Recent Platform Bookings
              </h3>
              <p className="text-xs text-slate-500">Live reservations across all registered travelers</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-[#E11D48] hover:underline flex items-center gap-1"
            >
              View All <FiArrowUpRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-2.5">Booking ID</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Service</th>
                  <th className="pb-2.5">Travel Date</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockRecentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#0F2942] dark:text-amber-400">{b.id}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{b.customer}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 max-w-[130px] truncate">{b.service}</td>
                    <td className="py-3 text-slate-500 whitespace-nowrap">{b.travelDate}</td>
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* C. PENDING APPROVALS CARD (5 Cols) */}
        <div id="pending-approvals" className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiShield className="text-amber-500" /> Pending Approvals &amp; Moderation
              </h3>
              <p className="text-xs text-slate-500">Items requiring Super Admin compliance review</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {pendingList.length} Action Needed
            </span>
          </div>

          <div className="space-y-3">
            {pendingList.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    By: {item.applicant}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleQuickApprove(item.id)}
                    className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-200 transition"
                    title="Quick Approve"
                  >
                    <FiCheck size={13} />
                  </button>
                  <Link
                    to={item.link}
                    className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-2.5 py-1.5 text-[11px] font-bold transition shadow"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pendingList.length === 0 && (
            <div className="py-6 text-center text-xs text-emerald-600 font-bold">
              ✓ All moderation requests are currently cleared!
            </div>
          )}
        </div>
      </div>

      {/* 5. D. RECENT ACTIVITY, E. BOOKING STATUS, F. TOP DESTINATIONS */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* D. RECENT ACTIVITY (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Recent Platform Activity
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Stream</span>
          </div>

          <div className="space-y-3">
            {recentActivityFeed.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`p-1.5 rounded-lg ${act.color} shrink-0 mt-0.5`}>
                    <Icon size={12} />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{act.event}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{act.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* E. BOOKING STATUS OVERVIEW (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiCompass className="text-emerald-500" /> Booking Status Overview
              </h3>
              <span className="text-[10px] font-bold text-slate-500">242 Total</span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex my-4">
              <div style={{ width: '76%' }} className="bg-emerald-500 h-full" title="Confirmed 76%" />
              <div style={{ width: '13%' }} className="bg-amber-500 h-full" title="Pending 13%" />
              <div style={{ width: '7%' }} className="bg-blue-500 h-full" title="Completed 7%" />
              <div style={{ width: '4%' }} className="bg-rose-500 h-full" title="Cancelled 4%" />
            </div>

            <div className="space-y-3">
              {bookingStatusStats.map((st) => (
                <div key={st.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${st.color}`} />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{st.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{st.count}</span>
                    <span className={`text-[10px] font-bold ${st.textColor}`}>({st.share})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span>Average Confirmation Time</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">14 Minutes</span>
            </div>
          </div>
        </div>

        {/* F. TOP DESTINATIONS (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiMapPin className="text-[#E11D48]" /> Top Destinations
            </h3>
            <span className="text-[10px] text-slate-400">Demand Heatmap</span>
          </div>

          <div className="space-y-3.5">
            {topDestinationsData.map((dest) => (
              <div key={dest.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate pr-2">{dest.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono">{dest.bookings} bk</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{dest.trend}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0F2942] dark:bg-amber-400 transition-all duration-500"
                    style={{ width: `${dest.share}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Gross Volume: {dest.revenue}</span>
                  <span>PCTE Direct Operator</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. G. SYSTEM HEALTH & H. SUPPORT SUMMARY ROW */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* G. SYSTEM HEALTH (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiServer className="text-emerald-500" /> Platform Infrastructure &amp; System Health
              </h3>
              <p className="text-xs text-slate-500">Service uptime, microservice availability, and escrow gateways</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All Services Operational
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {[
              { service: 'API Gateway', status: 'Operational', latency: '42ms', uptime: '99.99%' },
              { service: 'Database Cluster', status: 'Operational', latency: '12ms', uptime: '99.98%' },
              { service: 'Payment Gateway (Escrow)', status: 'Operational', latency: '180ms', uptime: '99.95%' },
              { service: 'Booking & Inventory Service', status: 'Operational', latency: '35ms', uptime: '100%' },
              { service: 'Notification & SMS Service', status: 'Operational', latency: '95ms', uptime: '99.92%' },
              { service: 'Passport Seva Dossier Sync', status: 'Operational', latency: '110ms', uptime: '99.90%' }
            ].map((sys) => (
              <div key={sys.service} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{sys.service}</p>
                  <p className="text-[10px] text-slate-400">Uptime {sys.uptime} · Latency {sys.latency}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {sys.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* H. SUPPORT SUMMARY (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiLifeBuoy className="text-indigo-500" /> Customer Support Overview
                </h3>
                <p className="text-xs text-slate-500">Live ticket triage &amp; client assistance</p>
              </div>
              <Link
                to="/admin/support"
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-3 py-1.5 text-xs font-bold transition shadow"
              >
                View Support
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Open Tickets</span>
                <p className="font-mono text-xl font-black text-amber-500">3</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">High Priority</span>
                <p className="font-mono text-xl font-black text-rose-500">1 Urgent</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">In Progress</span>
                <p className="font-mono text-xl font-black text-blue-500">2 Active</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Resolved Today</span>
                <p className="font-mono text-xl font-black text-emerald-600">12 Closed</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 text-xs">
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Latest open ticket: <b>"PSK Slot Rescheduling for Tatkaal Application"</b> from Amol Sharma (submitted 25m ago).
            </p>
          </div>
        </div>
      </div>

      {/* BOOKING AUDIT MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Platform Booking Inspector</span>
                <h3 className="font-display text-lg font-black">{selectedBooking.id}</h3>
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
                <span className="font-bold">{selectedBooking.customer} ({selectedBooking.phone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono">{selectedBooking.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Reserved:</span>
                <span className="font-bold">{selectedBooking.service}</span>
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
                <span className="text-slate-500">Total Billed Amount:</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedBooking.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedBooking.payment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking State:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48] transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOverview;
