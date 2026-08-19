import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiDollarSign, FiPackage, FiHome, FiCheckCircle,
  FiTrendingUp, FiStar, FiCalendar, FiArrowUpRight, FiPlusCircle,
  FiAward, FiShield, FiPercent
} from 'react-icons/fi';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const agencyMonthlySales = [
  { month: 'Jan', gross: 42, net: 38.5 },
  { month: 'Feb', gross: 58, net: 53.0 },
  { month: 'Mar', gross: 72, net: 65.8 },
  { month: 'Apr', gross: 89, net: 81.4 },
  { month: 'May', gross: 110, net: 100.6 },
  { month: 'Jun', gross: 125, net: 114.3 },
  { month: 'Jul', gross: 142, net: 130.0 },
  { month: 'Aug', gross: 160, net: 146.4 },
];

const StatCard = ({ icon: Icon, label, value, subtext, badge }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-2">
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

  useEffect(() => {
    api.get('/dashboard/agency').then(({ data }) => setData(data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Agency Partner Status Banner */}
      <div className="rounded-2xl bg-[#0F2942] p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <FiShield /> Verified Licensed Tour Operator
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: PCTE-AG-2026-081</span>
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            {user?.agencyName || 'PCTE Partner Agency Operations'}
          </h2>
          <p className="text-xs text-slate-300">
            Certified partner on the PCTE Travel Agency platform. Payout settlements processed bi-weekly.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/agency/packages"
            className="flex items-center gap-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 text-xs font-bold shadow transition-colors"
          >
            <FiPlusCircle /> Add New Tour
          </Link>
          <Link
            to="/agency/hotels"
            className="flex items-center gap-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <FiHome /> Manage Stays
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiDollarSign}
          label="Total Gross Package Sales"
          value="₹6,40,000"
          badge="+18.4%"
          subtext="Net Payouts: ₹5,85,600"
        />
        <StatCard
          icon={FiPackage}
          label="Active Packages Listed"
          value="8 Tours"
          badge="Live"
          subtext="Himachal, Kashmir, Spiti & Amritsar"
        />
        <StatCard
          icon={FiStar}
          label="Average Guest Rating"
          value="4.92 ★"
          badge="Top Rated"
          subtext="Based on 280+ traveler reviews"
        />
        <StatCard
          icon={FiPercent}
          label="Seat Occupancy Rate"
          value="94.2%"
          badge="High Demand"
          subtext="Every Friday departures sold out"
        />
      </div>

      {/* Monthly Sales Performance Chart */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Monthly Earnings Performance (in Thousands ₹)
              </h3>
              <p className="text-xs text-slate-500">Gross sales vs Net payout settlements received</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              Commission Rate: 8.5%
            </span>
          </div>

          <div className="pt-4">
            <div className="h-56 w-full">
              <svg viewBox="0 0 650 200" className="w-full h-full overflow-visible">
                {/* Horizontal Grid */}
                <line x1="30" y1="20" x2="620" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="30" y1="90" x2="620" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <line x1="30" y1="160" x2="620" y2="160" stroke="#cbd5e1" className="dark:stroke-slate-700" />

                <text x="5" y="25" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹160k</text>
                <text x="5" y="95" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹80k</text>
                <text x="15" y="165" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

                {agencyMonthlySales.map((item, i) => {
                  const x = 60 + i * 72;
                  const grossH = (item.gross / 180) * 140;
                  const netH = (item.net / 180) * 140;
                  return (
                    <g key={item.month} className="group cursor-pointer">
                      {/* Gross Bar */}
                      <rect x={x - 14} y={160 - grossH} width="12" height={grossH} rx="3" fill="#0F2942" className="dark:fill-slate-600" />
                      {/* Net Bar */}
                      <rect x={x} y={160 - netH} width="12" height={netH} rx="3" fill="#E11D48" />
                      
                      <text x={x - 1} y="178" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                        {item.month}
                      </text>
                      <text x={x - 1} y={160 - grossH - 5} fontSize="9" textAnchor="middle" fill="#E11D48" fontWeight="bold" fontFamily="monospace">
                        ₹{item.gross}k
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
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
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Payout &amp; Settlement Account
          </h3>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">PCTE Travel Expeditions Pvt Ltd</span>
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
              <span className="text-slate-500">Next Payout Cycle:</span>
              <span className="font-bold text-emerald-600">25 August 2026</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <FiCheckCircle /> 100% On-Time Settlement Record
            </span>
            <p className="text-[11px] leading-relaxed">
              All client bookings are escrow-protected and paid directly into your verified bank account after tour departure.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AgencyOverview;
