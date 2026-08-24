import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiRefreshCw,
  FiSearch, FiDownload, FiShield, FiAlertTriangle, FiPrinter, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/admin/bookings');
      if (Array.isArray(res.data?.data)) {
        const mapped = res.data.data.map(b => ({
          id: `PAY-${b.id || b._id}`,
          ref: b.id || b._id,
          customer: b.customer,
          service: b.service,
          amount: b.amount,
          gateway: b.payment || 'UPI / NetBanking',
          date: b.bookingDate,
          escrowStatus: b.status === 'Cancelled' ? 'Refunded to Customer' : b.status === 'Completed' ? 'Settled to Operator' : 'Escrow Held',
          operator: b.operator,
          payoutDue: b.status === 'Completed' ? 'Completed' : 'Bi-Weekly Cycle',
        }));
        setPayments(mapped);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError('Could not load payment ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

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
          <FiPrinter /> Print Payment Ledger
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Transaction Volume</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">₹{totalVolume.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Escrow Held</span>
          <p className="font-mono text-xl font-black text-amber-500">
            ₹{payments.filter(p => p.escrowStatus.includes('Escrow')).reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Settled to Partners</span>
          <p className="font-mono text-xl font-black text-emerald-600">
            ₹{payments.filter(p => p.escrowStatus.includes('Settled')).reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Gateway Health</span>
          <p className="font-mono text-xl font-black text-blue-600">100% Online</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer, gateway..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>

        <div className="flex overflow-x-auto gap-1">
          {['all', 'Escrow Held', 'Settled', 'Refunded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                filter === f
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'All Transactions' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading payment ledger...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={fetchPayments} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Payments Table */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Service &amp; Operator</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Escrow Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{p.id}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{p.customer}</td>
                    <td className="py-3.5 max-w-[180px]">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.service}</p>
                      <p className="text-[10px] text-slate-400">By: {p.operator}</p>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{p.gateway}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.escrowStatus.includes('Settled')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : p.escrowStatus.includes('Refunded')
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}>
                        {p.escrowStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {p.escrowStatus.includes('Escrow') && (
                        <button
                          onClick={() => handleReleaseEscrow(p.id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[10px] font-bold transition shadow"
                        >
                          Release Payout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No payment transactions found.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminPayments;
