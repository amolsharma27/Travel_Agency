import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiBell, FiCreditCard, FiDownload, FiCheckCircle, FiClock,
  FiFileText, FiPrinter, FiDollarSign, FiTag, FiCompass, FiShield
} from 'react-icons/fi';
import api from '../../api/axios.js';

export const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([
    { _id: 'notif_1', category: 'Bookings', title: 'Tour Booking Confirmed!', message: 'Your trip to Himachal & Jibhi is confirmed. Boarding report time: 08:30 PM (Majnu Ka Tila / Tribune Chowk).', isRead: false, createdAt: new Date().toISOString() },
    { _id: 'notif_2', category: 'Payments', title: 'Payment Verified & Settled', message: '₹11,998 payment received successfully for Himachal Group Tour pass (Ref: PAY-TX-9901).', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'notif_3', category: 'Trips', title: 'Weather & Packing Advisory for Jibhi', message: 'Serolsar Lake temperature is 12°C. Carry warm fleece jackets and sturdy hiking shoes.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'notif_4', category: 'Offers', title: '15% Off Early Bird Monsoon Deal', points: '+100', message: 'Exclusive discount code "PCTE-HIMALAYA" unlocked for Kashmir and Rajasthan private tours.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { _id: 'notif_5', category: 'Trips', title: 'Passport Dossier Pre-Screened', message: 'MEA-LDH-2026-88192 verified by compliance desk. Appointment at PSK Ludhiana scheduled.', isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() }
  ]);
  const [activeCategory, setActiveCategory] = useState('All');

  const markRead = (id) => {
    setNotifications((n) => n.map((x) => (x._id === id ? { ...x, isRead: true } : x)));
  };

  const markAllRead = () => {
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const filtered = notifications.filter(n =>
    activeCategory === 'All' || n.category === activeCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FiBell className="text-[#E11D48]" /> Travel Alerts &amp; Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay updated with real-time booking confirmations, payment slips, trip reminders, and passport statuses.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-bold text-[#E11D48] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Categories Bar: Bookings, Payments, Trips, Offers */}
      <div className="flex overflow-x-auto gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {['All', 'Bookings', 'Payments', 'Trips', 'Offers'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-[#0F2942] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'All' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n._id}
            onClick={() => markRead(n._id)}
            className={`rounded-2xl border p-4 transition-all cursor-pointer space-y-1.5 ${
              n.isRead
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30]'
                : 'border-blue-300 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!n.isRead && <span className="h-2 w-2 rounded-full bg-[#E11D48]" />}
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {n.category}
                </span>
                <p className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
              {n.message}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30]">
            No notifications in the "{activeCategory}" category.
          </div>
        )}
      </div>

    </div>
  );
};

export const CustomerPayments = () => {
  const [payments, setPayments] = useState([
    { _id: 'INV-2026-8801', date: '21 Aug 2026', booking: 'Himachal Group Tour: Jibhi & Jalori Pass', category: 'Package Tour', amount: 11998, status: 'Paid', method: 'UPI (PhonePe)' },
    { _id: 'INV-2026-8712', date: '15 Jan 2026', booking: 'Amritsar Spiritual & Heritage Weekend Tour', category: 'Package Tour', amount: 10497, status: 'Paid', method: 'Google Pay' },
    { _id: 'INV-2026-8640', date: '10 Jan 2026', booking: 'Fresh Passport Assistance Dossier (Adult)', category: 'Passport Service', amount: 1999, status: 'Paid', method: 'HDFC NetBanking' },
    { _id: 'INV-2026-8519', date: '20 Nov 2025', booking: '83-Meter Bungee Jumping Slot', category: 'Activity', amount: 3550, status: 'Paid', method: 'Paytm UPI' }
  ]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const totalSpent = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDownloadInvoice = (inv) => {
    setSelectedInvoice(inv);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FiCreditCard className="text-[#0F2942] dark:text-amber-400" /> Invoices &amp; Payment History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download GST-compliant tax invoices, track payment receipts, and view settlement statuses.
          </p>
        </div>
      </div>

      {/* KPI Cards: Total Spent, Pending Payment, Refunds */}
      <div className="grid gap-3 grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Spent</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white mt-0.5">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">4 Successful Bookings</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Payments</span>
          <p className="font-mono text-xl font-black text-emerald-600 mt-0.5">₹0</p>
          <span className="text-[10px] text-slate-400">All Invoices Cleared</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Refunds Processed</span>
          <p className="font-mono text-xl font-black text-blue-600 mt-0.5">₹0</p>
          <span className="text-[10px] text-slate-400">Zero Disputes</span>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Payment Slips &amp; Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Invoice Number</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Service Reserved</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Invoice Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{p._id}</td>
                  <td className="py-3.5 text-slate-500 font-semibold">{p.date}</td>
                  <td className="py-3.5 max-w-[200px] font-semibold text-slate-900 dark:text-white truncate">
                    {p.booking}
                  </td>
                  <td className="py-3.5 text-slate-500">{p.method}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      ✓ {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                      >
                        View Invoice
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(p);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                        title="Download Invoice"
                      >
                        <FiDownload size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Travel Tax Invoice</span>
                <h3 className="font-display text-base font-black">{selectedInvoice._id}</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Billed To:</span>
                <span className="font-bold">Amol Sharma (Ludhiana, Punjab)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-right max-w-xs">{selectedInvoice.booking}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Date of Supply:</span>
                <span className="font-bold">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">GSTIN Platform:</span>
                <span className="font-mono font-bold">03AAECP8821Q1Z4</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Paid (Inclusive of GST):</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedInvoice.amount.toLocaleString('en-IN')} (Paid)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                  setSelectedInvoice(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow transition"
              >
                <FiPrinter /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
