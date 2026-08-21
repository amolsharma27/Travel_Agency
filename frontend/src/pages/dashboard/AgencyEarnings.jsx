import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiDollarSign, FiTrendingUp, FiDownload, FiCalendar, FiCreditCard,
  FiCheckCircle, FiClock, FiFileText, FiPrinter
} from 'react-icons/fi';

const agencyMonthlyEarnings = [
  { month: 'Jan', gross: 42, commission: 3.5, net: 38.5 },
  { month: 'Feb', gross: 58, commission: 5.0, net: 53.0 },
  { month: 'Mar', gross: 72, commission: 6.2, net: 65.8 },
  { month: 'Apr', gross: 89, commission: 7.6, net: 81.4 },
  { month: 'May', gross: 110, commission: 9.4, net: 100.6 },
  { month: 'Jun', gross: 125, commission: 10.7, net: 114.3 },
  { month: 'Jul', gross: 142, commission: 12.0, net: 130.0 },
  { month: 'Aug', gross: 160, commission: 13.6, net: 146.4 },
];

const mockPayoutTransactions = [
  { date: '21 Aug 2026', bookingId: 'PCTE-AG-8821', gross: 11998, commission: 1020, net: 10978, status: 'Escrow Held' },
  { date: '20 Aug 2026', bookingId: 'PCTE-AG-8829', gross: 10497, commission: 892, net: 9605, status: 'Escrow Held' },
  { date: '15 Aug 2026', bookingId: 'PCTE-AG-8712', gross: 29998, commission: 2550, net: 27448, status: 'Paid Out (HDFC Bank)' },
  { date: '10 Aug 2026', bookingId: 'PCTE-AG-8640', gross: 19600, commission: 1666, net: 17934, status: 'Paid Out (HDFC Bank)' },
  { date: '01 Aug 2026', bookingId: 'PCTE-AG-8519', gross: 35500, commission: 3017, net: 32483, status: 'Paid Out (HDFC Bank)' },
];

const AgencyEarnings = () => {
  const [transactions, setTransactions] = useState(mockPayoutTransactions);

  const handleDownloadStatement = () => {
    toast.success('Official bi-weekly payout statement downloaded as PDF');
  };

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
          <FiDownload /> Download Statement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Lifetime Earnings</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">₹6,40,000</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Payout (In Escrow)</span>
          <p className="font-mono text-xl font-black text-amber-500">₹20,583</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Paid Out</span>
          <p className="font-mono text-xl font-black text-emerald-600">₹5,85,600</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Platform Commission</span>
          <p className="font-mono text-xl font-black text-[#E11D48]">8.5% Base</p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" /> Monthly Net Payout Trend (2026)
            </h3>
            <p className="text-xs text-slate-500">Figures in Thousands (₹) credited to verified bank account</p>
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

              <text x="5" y="25" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹160k</text>
              <text x="5" y="85" fontSize="10" fill="#94a3b8" fontFamily="monospace">₹80k</text>
              <text x="15" y="145" fontSize="10" fill="#94a3b8" fontFamily="monospace">0</text>

              {agencyMonthlyEarnings.map((item, i) => {
                const x = 60 + i * 72;
                const netH = (item.net / 180) * 120;
                return (
                  <g key={item.month} className="group cursor-pointer">
                    <rect x={x - 12} y={140 - netH} width="24" height={netH} rx="4" fill="#0F2942" className="dark:fill-amber-400 hover:fill-[#E11D48] transition-colors" />
                    <text x={x} y="160" fontSize="11" textAnchor="middle" fill="#64748b" fontWeight="bold">
                      {item.month}
                    </text>
                    <text x={x} y={140 - netH - 6} fontSize="9" textAnchor="middle" fill="#E11D48" fontWeight="bold" fontFamily="monospace">
                      ₹{item.net}k
                    </text>
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
          Recent Settlement Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Booking Reference</th>
                <th className="pb-3">Gross Amount</th>
                <th className="pb-3">Commission (8.5%)</th>
                <th className="pb-3">Net Payout</th>
                <th className="pb-3 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.bookingId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 text-slate-500 font-semibold">{tx.date}</td>
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{tx.bookingId}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">₹{tx.gross.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 font-mono text-[#E11D48]">-₹{tx.commission.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600">₹{tx.net.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status.includes('Paid')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AgencyEarnings;
