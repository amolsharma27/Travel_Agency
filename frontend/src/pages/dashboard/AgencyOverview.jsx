import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
    <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
  </div>
);

const AgencyOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/agency').then(({ data }) => setData(data.data));
  }, []);

  if (!data) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Packages listed" value={data.listings.packages} />
        <StatCard label="Hotels listed" value={data.listings.hotels} />
        <StatCard label="Total revenue" value={`₹${data.revenue.total}`} />
        <StatCard label="Pending approvals" value={data.pendingApprovals.packageBookings + data.pendingApprovals.hotelBookings} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Package bookings" value={data.bookings.packageBookings} />
        <StatCard label="Hotel bookings" value={data.bookings.hotelBookings} />
      </div>
      <div className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
        <h3 className="mb-3 font-display text-base font-semibold">Revenue breakdown</h3>
        <div className="flex justify-between text-sm"><span>From packages</span><span className="font-mono">₹{data.revenue.fromPackages}</span></div>
        <div className="flex justify-between text-sm"><span>From hotels</span><span className="font-mono">₹{data.revenue.fromHotels}</span></div>
      </div>
    </div>
  );
};

export default AgencyOverview;
