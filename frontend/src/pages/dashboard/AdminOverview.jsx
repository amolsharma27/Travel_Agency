import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiClock, FiDollarSign, FiPackage, FiHome, FiBookOpen, FiLifeBuoy } from 'react-icons/fi';
import api from '../../api/axios.js';

const StatCard = ({ icon: Icon, label, value, badge, badgeColor }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      {Icon && (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
          <Icon size={18} />
        </div>
      )}
    </div>
    <div className="mt-3 flex items-baseline justify-between">
      <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {badge && (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeColor || 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}`}>
          {badge}
        </span>
      )}
    </div>
  </div>
);

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/admin')
      .then(({ data }) => setData(data.data || {}))
      .catch((err) => console.error('Failed to load admin analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span className="ml-3 text-sm text-slate-500">Loading metrics...</span>
      </div>
    );
  }

  const users = data?.users || {};
  const packages = data?.packages || {};
  const hotels = data?.hotels || {};
  const bookings = data?.bookings || {};
  const support = data?.support || {};
  const revenueVal = typeof data?.revenue === 'number' ? `₹${data.revenue.toLocaleString('en-IN')}` : `₹${data?.revenue || 0}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Overview</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time statistics across users, listings, revenue, and bookings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total Customers" value={users.totalCustomers ?? 0} />
        <StatCard icon={FiBriefcase} label="Total Agencies" value={users.totalAgencies ?? 0} />
        <StatCard 
          icon={FiClock} 
          label="Pending Agencies" 
          value={users.pendingAgencies ?? 0} 
          badge={users.pendingAgencies > 0 ? 'Requires Action' : 'Up to date'} 
          badgeColor={users.pendingAgencies > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}
        />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={revenueVal} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={FiPackage} 
          label="Tour Packages" 
          value={packages.total ?? 0} 
          badge={`${packages.pending ?? 0} pending`}
        />
        <StatCard 
          icon={FiHome} 
          label="Listed Hotels" 
          value={hotels.total ?? 0} 
          badge={`${hotels.pending ?? 0} pending`}
        />
        <StatCard icon={FiBookOpen} label="Package Bookings" value={bookings.totalPackageBookings ?? 0} />
        <StatCard icon={FiBookOpen} label="Hotel Bookings" value={bookings.totalHotelBookings ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={FiLifeBuoy} 
          label="Open Support Tickets" 
          value={support.openTickets ?? 0} 
          badge={support.openTickets > 0 ? 'Open' : 'All Clear'}
          badgeColor={support.openTickets > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
        />
      </div>
    </div>
  );
};

export default AdminOverview;
