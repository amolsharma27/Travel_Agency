import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiTrendingUp, FiDownload, FiCalendar, FiDollarSign, FiUsers,
  FiBookOpen, FiPrinter, FiPieChart, FiBarChart2, FiLayers
} from 'react-icons/fi';

const AdminReports = () => {
  const [reportType, setReportType] = useState('financial'); // 'financial' | 'destinations' | 'operators' | 'tax'
  const [selectedYear, setSelectedYear] = useState('2026');

  const handleDownload = (format) => {
    toast.success(`Generated and downloaded ${reportType.toUpperCase()} report in ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Platform Analytics, Audit &amp; Compliance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export monthly GST tax reports, operator gross settlements, customer acquisition funnels, and regional telemetry.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-2 text-xs font-bold transition shadow"
          >
            <FiDownload /> Download PDF
          </button>
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {[
          { id: 'financial', label: 'Financial & Revenue Ledger', icon: FiDollarSign },
          { id: 'destinations', label: 'Destination Demand & Growth', icon: FiBarChart2 },
          { id: 'operators', label: 'Agency Partner Performance', icon: FiUsers },
          { id: 'tax', label: 'GST & Compliance Invoices', icon: FiLayers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                reportType === tab.id
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content Panel */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-6">
        
        {reportType === 'financial' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  2026 Fiscal Financial Telemetry Summary
                </h3>
                <p className="text-xs text-slate-500">Gross billing, platform take rate, and net payouts across all streams</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Audited Status: Verified
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Gross Volume</span>
                <p className="font-mono text-xl font-black text-slate-900 dark:text-white mt-1">₹18,45,000</p>
                <span className="text-[10px] text-emerald-600 font-semibold">+24.8% Year-over-Year</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">Platform Commission Net</span>
                <p className="font-mono text-xl font-black text-[#E11D48] mt-1">₹1,56,800</p>
                <span className="text-[10px] text-slate-400">Average 8.5% take rate</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">Operator Payouts Settled</span>
                <p className="font-mono text-xl font-black text-emerald-600 mt-1">₹16,88,200</p>
                <span className="text-[10px] text-emerald-600 font-semibold">100% Escrow Cleared</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="pb-2.5">Month</th>
                    <th className="pb-2.5">Bookings</th>
                    <th className="pb-2.5">Gross Volume (₹)</th>
                    <th className="pb-2.5">Platform Net (₹)</th>
                    <th className="pb-2.5">Disbursed (₹)</th>
                    <th className="pb-2.5 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {[
                    { m: 'August 2026', b: 242, g: '₹18,45,000', p: '₹1,56,800', d: '₹16,88,200' },
                    { m: 'July 2026', b: 215, g: '₹16,80,000', p: '₹1,42,800', d: '₹15,37,200' },
                    { m: 'June 2026', b: 198, g: '₹15,40,000', p: '₹1,30,900', d: '₹14,09,100' },
                    { m: 'May 2026', b: 176, g: '₹13,50,000', p: '₹1,14,700', d: '₹12,35,300' },
                  ].map((row) => (
                    <tr key={row.m} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-sans font-bold text-slate-900 dark:text-white">{row.m}</td>
                      <td className="py-3 text-slate-700 dark:text-slate-300">{row.b}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{row.g}</td>
                      <td className="py-3 font-bold text-[#E11D48]">{row.p}</td>
                      <td className="py-3 text-emerald-600 font-bold">{row.d}</td>
                      <td className="py-3 text-right font-sans">
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                          ✓ Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'destinations' && (
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Regional Tourism &amp; Destination Trajectory
            </h3>
            <p className="text-xs text-slate-500">Breakdown of passenger traffic across Northern India &amp; domestic getaways</p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                { name: 'Kashmir Circuit (Srinagar/Gulmarg/Pahalgam)', share: '34%', volume: '₹14.1 Lakhs', growth: '+32%' },
                { name: 'Himachal Circuit (Jibhi/Tirthan/Manali/Spiti)', share: '28%', volume: '₹11.4 Lakhs', growth: '+25%' },
                { name: 'Rajasthan Circuit (Jaipur/Jodhpur/Jaisalmer)', share: '20%', volume: '₹9.4 Lakhs', growth: '+14%' },
                { name: 'Goa Coastal Circuit (Candolim/Baga/Fontainhas)', share: '18%', volume: '₹7.2 Lakhs', growth: '+22%' },
              ].map((c) => (
                <div key={c.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-slate-900 dark:text-white">{c.name}</span>
                    <span className="text-emerald-600">{c.growth}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Market Share: {c.share}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{c.volume}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'operators' && (
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Operator Compliance &amp; Payout Audit
            </h3>
            <p className="text-xs text-slate-500">Verified agencies, passenger ratings, and settlement ledger</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              All 28 verified agency partners maintain 100% on-time departure records and 4.8+ average guest ratings.
            </div>
          </div>
        )}

        {reportType === 'tax' && (
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              GSTIN Tax &amp; B2B Corporate Invoices
            </h3>
            <p className="text-xs text-slate-500">GST Registration: <b>03AAECP8821Q1Z4</b> (PCTE Travel Agency Platform)</p>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-300">
              ✓ All quarterly GSTR-1 and GSTR-3B filings are reconciled and in compliance with Indian taxation laws.
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminReports;
