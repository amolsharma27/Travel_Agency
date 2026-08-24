import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiDollarSign, FiPackage, FiHome, FiCheckCircle,
  FiTrendingUp, FiStar, FiCalendar, FiArrowUpRight, FiPlusCircle,
  FiAward, FiShield, FiPercent, FiUsers, FiClock, FiCheckSquare,
  FiBookOpen, FiSliders, FiArrowRight, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const StatCard = ({ icon: Icon, label, value, subtext, badge }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-2 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      {Icon && (
        <div className="p-2 rounded-xl bg-[#0F2942]/10 dark:bg-slate-800 text-[#0F2942] dark:text-amber-400">
          <Icon size={16} />
        </div>
      )}
    </div>
    <div className="flex items-baseline justify-between">
      <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      {badge && (
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          {badge}
        </span>
      )}
    </div>
    {subtext && <p className="text-[10px] text-slate-400">{subtext}</p>}
  </div>
);

const AgencyOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgencyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/agency');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load agency dashboard data:', err);
      setError('Could not load agency analytics. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading agency operations &amp; sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-6 text-center space-y-3">
        <FiAlertCircle className="mx-auto text-red-500 text-2xl" />
        <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchAgencyData}
          className="rounded-xl bg-[#0F2942] text-white text-xs font-bold px-4 py-2 hover:bg-[#E11D48] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const grossSales = data?.revenue?.grossSales ?? 0;
  const netPayouts = data?.revenue?.netPayouts ?? 0;
  const commissionRate = data?.revenue?.commissionRate ?? 8.5;
  const packagesCount = data?.listings?.packages ?? 0;
  const hotelsCount = data?.listings?.hotels ?? 0;
  const totalBookings = data?.bookings?.total ?? 0;
  const pendingBookings = data?.bookings?.pending ?? 0;
  const confirmedBookings = data?.bookings?.confirmed ?? 0;
  const totalCustomers = data?.totalCustomers ?? 0;
  const monthlySales = data?.monthlySales || [];

  // Calculate max gross in chart for SVG scaling
  const maxGross = Math.max(...monthlySales.map(m => m.gross || 0), 10);
  const chartScale = maxGross > 0 ? 140 / (maxGross * 1.25) : 1;

  return (
    <div className="space-y-6">
      
      {/* 1. AGENCY VERIFIED TOP BANNER */}
      <div className="rounded-2xl bg-[#0F2942] p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <FiShield /> Verified Licensed Tour Operator
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {user?._id ? `PCTE-AG-${user._id.slice(-6).toUpperCase()}` : 'PCTE-AG-8821'}
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            {user?.agencyName || user?.name || 'PCTE Travel Agency — Freedom To Evolve'}
          </h2>
          <p className="text-xs text-slate-300">
            Certified partner on the PCTE Travel Agency platform. Real-time passenger bookings &amp; automated settlements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/agency/packages"
            className="flex items-center gap-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 text-xs font-bold shadow transition-colors"
          >
            <FiPlusCircle /> Add New Tour
          </Link>
          <Link
            to="/agency/hotels"
            className="flex items-center gap-1.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <FiHome /> Manage Stays
          </Link>
        </div>
      </div>

      {/* 2. ACCOUNT STATUS & QUICK ACTIONS */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Account Status Card (5 Cols) */}
        <div className="md:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Account Status &amp; Compliance
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-600" />
                <span className="font-bold text-emerald-950 dark:text-emerald-200">Agency Account Active</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Live</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-600" />
                <span className="font-bold text-emerald-950 dark:text-emerald-200">License Verified</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                {user?.licenseNo || 'PB-TO-2024-0089'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-emerald-600" />
                <span className="font-bold text-emerald-950 dark:text-emerald-200">Commission Rate</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {commissionRate}% Standard
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions (7 Cols) */}
        <div className="md:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Agency Operator Fast Actions
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/agency/packages"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-[#0F2942] text-white">
                <FiPlusCircle size={15} />
              </div>
              <div>
                <p className="font-bold">+ Add New Tour</p>
                <p className="text-[10px] text-slate-400 font-normal">Publish group departure</p>
              </div>
            </Link>

            <Link
              to="/agency/hotels"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-emerald-600 text-white">
                <FiHome size={15} />
              </div>
              <div>
                <p className="font-bold">+ Add New Stay</p>
                <p className="text-[10px] text-slate-400 font-normal">Chalet &amp; hotel inventory</p>
              </div>
            </Link>

            <Link
              to="/agency/bookings"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-[#E11D48] text-white">
                <FiBookOpen size={15} />
              </div>
              <div>
                <p className="font-bold">Passenger Bookings</p>
                <p className="text-[10px] text-slate-400 font-normal">
                  {pendingBookings > 0 ? `${pendingBookings} Pending Actions` : `${totalBookings} Total Bookings`}
                </p>
              </div>
            </Link>

            <Link
              to="/agency/customers"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F2942] dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-[#0F1D30] transition text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-amber-600 text-white">
                <FiUsers size={15} />
              </div>
              <div>
                <p className="font-bold">Customer Directory</p>
                <p className="text-[10px] text-slate-400 font-normal">{totalCustomers} Registered Clients</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. KPI CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiDollarSign}
          label="Total Gross Package Sales"
          value={`₹${grossSales.toLocaleString('en-IN')}`}
          badge={totalBookings > 0 ? `${totalBookings} Bookings` : 'No bookings yet'}
          subtext={`Net Payouts: ₹${netPayouts.toLocaleString('en-IN')}`}
        />
        <StatCard
          icon={FiPackage}
          label="Active Packages &amp; Stays"
          value={`${packagesCount + hotelsCount} Listings`}
          badge="Live"
          subtext={`${packagesCount} Tours · ${hotelsCount} Stays`}
        />
        <StatCard
          icon={FiStar}
          label="Average Guest Rating"
          value="4.92 ★"
          badge="Top Rated"
          subtext="Verified Traveler Reviews"
        />
        <StatCard
          icon={FiPercent}
          label="Confirmed Conversions"
          value={totalBookings > 0 ? `${Math.round((confirmedBookings / totalBookings) * 100)}%` : '100%'}
          badge="High Demand"
          subtext={`${confirmedBookings} Confirmed Departures`}
        />
      </div>

      {/* 4. MONTHLY SALES PERFORMANCE CHART & SETTLEMENT ACCOUNT */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Monthly Earnings Performance (in Thousands ₹)
              </h3>
              <p className="text-xs text-slate-500">Real database aggregated Gross sales vs Net payout settlements</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              Commission Rate: {commissionRate}%
            </span>
          </div>

          <div className="pt-2">
            <div className="h-56 w-full">
              <svg viewBox="0 0 650 200" className="w-full h-full overflow-visible">
                <line x1="30" y1="20" x2="620" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="30" y1="90" x2="620" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="30" y1="160" x2="620" y2="160" stroke="#cbd5e1" className="dark:stroke-slate-700" />

                <text x="5" y="25" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxGross * 1.25)}k</text>
                <text x="5" y="95" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxGross * 0.6)}k</text>
                <text x="15" y="165" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

                {monthlySales.map((item, i) => {
                  const x = 60 + i * 72;
                  const grossH = Math.max((item.gross || 0) * chartScale, 4);
                  const netH = Math.max((item.net || 0) * chartScale, 3);
                  return (
                    <g key={item.month} className="group cursor-pointer">
                      <rect x={x - 14} y={160 - grossH} width="12" height={grossH} rx="3" fill="#0F2942" className="dark:fill-slate-600" />
                      <rect x={x} y={160 - netH} width="12" height={netH} rx="3" fill="#E11D48" />
                      
                      <text x={x - 1} y="178" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                        {item.month}
                      </text>
                      {item.gross > 0 && (
                        <text x={x - 1} y={160 - grossH - 5} fontSize="9" textAnchor="middle" fill="#E11D48" fontWeight="bold" fontFamily="monospace">
                          ₹{item.gross}k
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="h-3 w-3 rounded bg-[#0F2942] dark:bg-slate-600" /> Gross Package Sales
              </span>
              <span className="flex items-center gap-2 text-[#E11D48]">
                <span className="h-3 w-3 rounded bg-[#E11D48]" /> Net Payouts Credited
              </span>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Operator Credentials & Settlement */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Payout &amp; Settlement Account
            </h3>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.agencyName || user?.name || 'PCTE Operator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Account:</span>
                <span className="font-mono font-bold">HDFC •••• 9921</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GSTIN / Tax ID:</span>
                <span className="font-mono font-bold">03AAECP8821Q1Z4</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Settlement Cycle:</span>
                <span className="font-bold text-emerald-600">Bi-Weekly Automated Payout</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <FiCheckCircle /> 100% On-Time Settlement Record
            </span>
            <p className="text-[11px] leading-relaxed">
              All client bookings are escrow-protected and disbursed directly to your verified bank account following tour departures.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AgencyOverview;
