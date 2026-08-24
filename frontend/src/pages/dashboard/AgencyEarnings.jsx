import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiDollarSign, FiTrendingUp, FiDownload, FiCalendar, FiCreditCard,
  FiCheckCircle, FiClock, FiFileText, FiPrinter, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';

const AgencyEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarningsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/agency');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load agency earnings:', err);
      setError('Could not load earnings records. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleDownloadStatement = () => {
    window.print();
    toast.success('Official payout settlement statement generated for print/PDF');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading settlement &amp; earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-6 text-center space-y-3">
        <FiAlertCircle className="mx-auto text-red-500 text-2xl" />
        <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchEarningsData}
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
  const commissionDeducted = Math.round(grossSales * (commissionRate / 100));
  const recentBookings = data?.recentBookings || [];
  const monthlySales = data?.monthlySales || [];

  const maxNet = Math.max(...monthlySales.map(m => m.net || 0), 10);
  const chartScale = maxNet > 0 ? 120 / (maxNet * 1.25) : 1;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Earnings &amp; Payout Settlements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track gross tour revenues, platform commission deductions, and direct bank settlement transfers.
          </p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiPrinter /> Print / Export Statement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Lifetime Gross</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">₹{grossSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Net Operator Earnings</span>
          <p className="font-mono text-xl font-black text-emerald-600">₹{netPayouts.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Platform Commission</span>
          <p className="font-mono text-xl font-black text-[#E11D48]">₹{commissionDeducted.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Commission Rate</span>
          <p className="font-mono text-xl font-black text-[#0F2942] dark:text-amber-400">{commissionRate}%</p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" /> Monthly Net Payout Trend (in Thousands ₹)
            </h3>
            <p className="text-xs text-slate-500">Real database figures credited to verified settlement account</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            Bank: HDFC Bank •••• 9921
          </span>
        </div>

        <div className="pt-2">
          <div className="h-52 w-full">
            <svg viewBox="0 0 650 180" className="w-full h-full overflow-visible">
              <line x1="30" y1="20" x2="620" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="30" y1="80" x2="620" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="30" y1="140" x2="620" y2="140" stroke="#cbd5e1" className="dark:stroke-slate-700" />

              <text x="5" y="25" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxNet * 1.25)}k</text>
              <text x="5" y="85" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹{Math.round(maxNet * 0.6)}k</text>
              <text x="15" y="145" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

              {monthlySales.map((item, i) => {
                const x = 60 + i * 72;
                const netH = Math.max((item.net || 0) * chartScale, 4);
                return (
                  <g key={item.month} className="group cursor-pointer">
                    <rect x={x - 12} y={140 - netH} width="24" height={netH} rx="4" fill="#0F2942" className="dark:fill-amber-400 hover:fill-[#E11D48] transition-colors" />
                    <text x={x} y="160" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {item.month}
                    </text>
                    {item.net > 0 && (
                      <text x={x} y={140 - netH - 6} fontSize="9" textAnchor="middle" fill="#E11D48" fontWeight="bold" fontFamily="monospace">
                        ₹{item.net}k
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Payout Transaction Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Recent Settlement Bookings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Travel Date</th>
                <th className="pb-3">Booking Reference</th>
                <th className="pb-3">Gross Amount</th>
                <th className="pb-3">Commission ({commissionRate}%)</th>
                <th className="pb-3">Net Payout</th>
                <th className="pb-3 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentBookings.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 text-slate-500 font-semibold">{new Date(tx.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{tx.bookingRef || tx._id}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">₹{(tx.grossAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 font-mono text-[#E11D48]">-₹{Math.round((tx.grossAmount || 0) * (commissionRate / 100)).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600">₹{(tx.netPayout || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {tx.bookingStatus || 'Confirmed'}
                    </span>
                  </td>
                </tr>
              ))}

              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No payout transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AgencyEarnings;
