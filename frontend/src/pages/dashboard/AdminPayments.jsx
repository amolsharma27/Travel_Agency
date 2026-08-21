import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiRefreshCw,
  FiSearch, FiDownload, FiShield, FiAlertTriangle, FiPrinter
} from 'react-icons/fi';

const mockPaymentLedger = [
  { id: 'PAY-TX-9901', ref: 'PCTE-TX-9901', customer: 'Amol Sharma', service: 'Himachal Group Tour (Jibhi & Jalori Pass)', amount: 11998, gateway: 'UPI / PhonePe', date: '21 Aug 2026, 18:42', escrowStatus: 'Escrow Held', operator: 'PCTE Travel Agency', payoutDue: '01 Sep 2026' },
  { id: 'PAY-TX-9902', ref: 'PCTE-TX-9902', customer: 'Priya Verma', service: 'Kashmir Paradise Group Tour', amount: 29998, gateway: 'HDFC NetBanking', date: '21 Aug 2026, 16:15', escrowStatus: 'Escrow Held', operator: 'PCTE Travel Agency', payoutDue: '08 Sep 2026' },
  { id: 'PAY-TX-9903', ref: 'PCTE-TX-9903', customer: 'Karanvir Singh', service: 'Snow Valley Himalayan Cedar Resort (2N)', amount: 6998, gateway: 'Google Pay', date: '20 Aug 2026, 14:30', escrowStatus: 'Escrow Held', operator: 'Snow Valley Manali', payoutDue: '07 Sep 2026' },
  { id: 'PAY-TX-9904', ref: 'PCTE-TX-9904', customer: 'Harpreet Kaur', service: 'Rajasthan Royal Heritage Group Tour', amount: 19600, gateway: 'Visa Credit Card', date: '19 Aug 2026, 11:20', escrowStatus: 'Settled to Operator', operator: 'Rajputana Heritage', payoutDue: 'Completed' },
  { id: 'PAY-TX-9905', ref: 'PCTE-TX-9905', customer: 'Rahul Mehra', service: 'Tatkaal Passport Assistance Fee', amount: 4399, gateway: 'Paytm UPI', date: '18 Aug 2026, 20:05', escrowStatus: 'Settled to Desk', operator: 'PCTE Passport Desk', payoutDue: 'Completed' },
  { id: 'PAY-TX-9906', ref: 'PCTE-TX-9906', customer: 'Sunita Goyal', service: 'Goa Coastal Beach & Cruise Luxury Tour', amount: 14500, gateway: 'Axis NetBanking', date: '15 Aug 2026, 10:12', escrowStatus: 'Refunded to Customer', operator: 'Coastal Breeze Holidays', payoutDue: 'Cancelled' }
];

const AdminPayments = () => {
  const [payments, setPayments] = useState(mockPaymentLedger);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'all' || p.escrowStatus.toLowerCase().includes(filter.toLowerCase());
    const matchSearch = !search ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.gateway.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalVolume = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  const handleReleaseEscrow = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, escrowStatus: 'Settled to Operator', payoutDue: 'Completed' } : p));
    toast.success('Escrow payout released to operator partner');
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Payments Gateway &amp; Escrow Settlement Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit gateway transactions, manage buyer protection escrow vaults, and authorize bi-weekly operator payouts.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold transition shadow"
        >
          <FiPrinter /> Export Ledger
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Settled Sales</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">₹18.45 Lakhs</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Escrow Vault</span>
          <p className="font-mono text-xl font-black text-amber-500">₹48,994</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Platform Retained Net</span>
          <p className="font-mono text-xl font-black text-emerald-600">₹1,56,800</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Dispute / Chargeback</span>
          <p className="font-mono text-xl font-black text-blue-600">0.00% (Clean)</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-1 overflow-x-auto">
          {['all', 'Held', 'Settled', 'Refunded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                filter === f
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'All Transactions' : f === 'Held' ? 'Escrow Held' : f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref, customer, service..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Service Reserved</th>
                <th className="pb-3">Operator Partner</th>
                <th className="pb-3">Gateway</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Escrow Status</th>
                <th className="pb-3 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{p.id}</td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{p.customer}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{p.service}</td>
                  <td className="py-3.5 text-slate-500">{p.operator}</td>
                  <td className="py-3.5 text-slate-500">{p.gateway}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.escrowStatus.includes('Held')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : p.escrowStatus.includes('Refunded')
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      {p.escrowStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {p.escrowStatus.includes('Held') ? (
                      <button
                        onClick={() => handleReleaseEscrow(p.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold transition shadow"
                      >
                        Release Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">{p.payoutDue}</span>
                    )}
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

export default AdminPayments;
