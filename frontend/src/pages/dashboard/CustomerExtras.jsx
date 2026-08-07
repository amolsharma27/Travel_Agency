import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setNotifications(data.data)).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((n) => n.map((x) => (x._id === id ? { ...x, isRead: true } : x)));
  };

  if (loading) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
        <p className="font-display text-lg font-semibold">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <button
          key={n._id}
          onClick={() => markRead(n._id)}
          className={`w-full rounded-xl2 border p-4 text-left transition ${
            n.isRead
              ? 'border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light'
              : 'border-lagoon-300 bg-lagoon-50 dark:bg-lagoon-700/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{n.title}</p>
            <span className="text-xs text-ink/40 dark:text-paper/40">{new Date(n.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{n.message}</p>
        </button>
      ))}
    </div>
  );
};

export const CustomerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my').then(({ data }) => setPayments(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;
  if (payments.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
        <p className="font-display text-lg font-semibold">No payments yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-ink/5 dark:border-paper/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink/5 dark:bg-paper/5">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-t border-ink/5 dark:border-paper/10">
              <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 capitalize">{p.bookingType}</td>
              <td className="px-4 py-3 font-mono">₹{p.amount}</td>
              <td className="px-4 py-3 capitalize">{p.status}{p.isMock && ' (sandbox)'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
