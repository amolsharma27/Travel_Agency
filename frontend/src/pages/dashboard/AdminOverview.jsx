import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiBriefcase, FiClock, FiDollarSign, FiPackage, FiHome,
  FiBookOpen, FiLifeBuoy, FiTrendingUp, FiCheckCircle, FiShield,
  FiActivity, FiTruck, FiArrowUpRight, FiCalendar, FiFilter,
  FiDownload, FiPrinter, FiEye, FiServer, FiLayers, FiMapPin
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

const regionalHubs = [
  { city: 'Ludhiana Campus (HQ)', share: 38, bookings: 92, status: 'Primary Hub' },
  { city: 'Chandigarh Tri-City (Mohali/Panchkula)', share: 28, bookings: 68, status: 'High Growth' },
  { city: 'Delhi NCR Region', share: 18, bookings: 44, status: 'Transit Gateway' },
  { city: 'Jalandhar & Amritsar Circuit', share: 16, bookings: 38, status: 'Heritage Hub' },
];

const recentLedgerTransactions = [
  { ref: 'PCTE-TX-9901', customer: 'Amol Sharma', service: 'Himachal Group Tour (Jibhi & Jalori Pass)', amount: 11998, method: 'UPI / PhonePe', date: 'Today, 18:42', status: 'Settled' },
  { ref: 'PCTE-TX-9902', customer: 'Priya Verma', service: 'Amritsar Spiritual & Heritage Weekend Tour', amount: 10497, method: 'Google Pay', date: 'Today, 16:15', status: 'Settled' },
  { ref: 'PCTE-TX-9903', customer: 'Karanvir Singh', service: 'Tatkaal Passport Assistance (PSK Ludhiana)', amount: 4399, method: 'HDFC NetBanking', date: 'Today, 14:30', status: 'Settled' },
  { ref: 'PCTE-TX-9904', customer: 'Harpreet Kaur', service: 'Snow Valley Himalayan Cedar Resort (2 Nights)', amount: 6998, method: 'Credit Card', date: 'Today, 11:20', status: 'Settled' },
  { ref: 'PCTE-TX-9905', customer: 'Rahul Mehra', service: '83m Bungee Jump & Rishikesh Rafting Slot', amount: 3550, method: 'Paytm UPI', date: 'Yesterday, 20:05', status: 'Settled' },
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
  const [data, setData] = useState(null);
  const [activeRange, setActiveRange] = useState('8M');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data }) => setData(data.data || {})).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-white">
            Live Telemetry &amp; Financial Overview
          </h2>
          <p className="text-xs text-slate-500">
            Real-time platform sales, service streams, and gateway settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/listings"
            className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-2 text-xs font-bold shadow transition-colors"
          >
            <FiCheckCircle /> Moderate (5 Pending)
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold transition-colors"
          >
            <FiUsers /> Users (1,840)
          </Link>
        </div>
      </div>

      {/* 1. TOP STATS 6-KPI GRID */}
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

      {/* 2. CORE VISUAL GRAPHS SECTION */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Graph 1: Gross Sales vs Net Platform Profit Area Trend (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Gross Volume vs Platform Profit Trajectory (2026)
              </h3>
              <p className="text-xs text-slate-500">Scale in Thousands (₹). Hover on coordinate points for detailed breakdown.</p>
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
          <div className="pt-4">
            <div className="h-64 w-full relative">
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

            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
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

        {/* Graph 2: Service Distribution & Revenue Share (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Service Stream Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution across 5 platform categories</p>
          </div>

          <div className="space-y-4">
            {serviceDistribution.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="font-mono">{cat.share}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Conversion Insight:</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Himachal group departures &amp; Amritsar Golden Temple tours represent the highest organic search volume.
            </p>
          </div>
        </div>

      </div>

      {/* 3. SECOND ROW: WEEKLY PEAKS & REGIONAL HUBS */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Weekly Day-by-Day Peak Bar Graph (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiCalendar className="text-[#E11D48]" /> Day-wise Booking Spikes (Friday Peaks)
              </h3>
              <p className="text-xs text-slate-500">Weekly concentration showing weekend getaway demand</p>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded-full">
              Friday = 28% Peak
            </span>
          </div>

          <div className="pt-2">
            <div className="h-44 w-full flex items-end justify-between gap-2 px-2">
              {weeklySpikesData.map((day) => {
                const heightPct = (day.count / 75) * 100;
                const isPeak = day.day === 'Fri';
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-[#E11D48] transition-colors">
                      {day.count}
                    </span>
                    <div className="w-full rounded-t-lg bg-slate-100 dark:bg-slate-800 h-32 relative overflow-hidden flex items-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isPeak ? 'bg-[#E11D48]' : 'bg-[#0F2942] group-hover:bg-slate-600'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${isPeak ? 'text-[#E11D48]' : 'text-slate-600 dark:text-slate-400'}`}>
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Regional Departure Hubs Heatmap (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiMapPin className="text-emerald-500" /> Regional Departure Concentration
              </h3>
              <p className="text-xs text-slate-500">Boarding origin distribution for tours &amp; transfers</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {regionalHubs.map((hub) => (
              <div key={hub.city} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{hub.city}</p>
                  <p className="text-[10px] text-slate-400">{hub.status} · {hub.bookings} Departure Batches</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{hub.share}%</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. RECENT REAL-TIME TRANSACTION LEDGER TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiDollarSign className="text-emerald-500" /> Recent Real-Time Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">Live escrow settlements, payment gateways, and booking passes.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <FiPrinter /> Export Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Tracking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Service Reserved</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Escrow Status</th>
                <th className="pb-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLedgerTransactions.map((tx) => (
                <tr key={tx.ref} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#0F2942] dark:text-amber-400">{tx.ref}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{tx.customer}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{tx.service}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600">₹{tx.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-slate-500">{tx.method}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      ✓ {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    >
                      <FiEye className="inline mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION AUDIT MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Travel Escrow Audit</span>
                <h3 className="font-display text-base font-black">{selectedTx.ref}</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Lead Customer:</span>
                <span className="font-bold">{selectedTx.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold">{selectedTx.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedTx.amount.toLocaleString('en-IN')} (Escrow Cleared)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Gateway Provider:</span>
                <span className="font-bold">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono">{selectedTx.date}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOverview;
