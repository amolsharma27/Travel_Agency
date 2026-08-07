import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
    <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
  </div>
);

const AdminOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data }) => setData(data.data));
  }, []);

  if (!data) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total customers" value={data.users.totalCustomers} />
        <StatCard label="Total agencies" value={data.users.totalAgencies} />
        <StatCard label="Agencies pending approval" value={data.users.pendingAgencies} />
        <StatCard label="Total platform revenue" value={`₹${data.revenue}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Packages" value={`${data.packages.total} (${data.packages.pending} pending)`} />
        <StatCard label="Hotels" value={`${data.hotels.total} (${data.hotels.pending} pending)`} />
        <StatCard label="Package bookings" value={data.bookings.totalPackageBookings} />
        <StatCard label="Hotel bookings" value={data.bookings.totalHotelBookings} />
      </div>
      <StatCard label="Open support tickets" value={data.support.openTickets} />
    </div>
  );
};

export default AdminOverview;
