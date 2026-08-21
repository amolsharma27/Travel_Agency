import { useState } from 'react';
import {
  FiTrendingUp, FiEye, FiUsers, FiAward, FiCheckCircle,
  FiBarChart2, FiPieChart, FiArrowUpRight, FiActivity
} from 'react-icons/fi';

const topPerformingTours = [
  { name: 'Himachal Group Tour (Jibhi & Jalori Pass)', bookings: 102, views: 2420, conversion: '4.2%', revenue: '₹6.11 Lakhs', occupancy: '96%' },
  { name: 'Kashmir Paradise Group Tour', bookings: 68, views: 1890, conversion: '3.6%', revenue: '₹10.19 Lakhs', occupancy: '92%' },
  { name: 'Rajasthan Royal Heritage Tour', bookings: 44, views: 1450, conversion: '3.0%', revenue: '₹4.31 Lakhs', occupancy: '88%' },
  { name: 'Spiti Valley 4x4 Expedition', bookings: 28, views: 1120, conversion: '2.5%', revenue: '₹4.62 Lakhs', occupancy: '85%' }
];

const AgencyPerformance = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
          Agency Growth &amp; Tour Performance Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Measure conversion rates, package page views, occupancy trends, and top revenue drivers.
        </p>
      </div>

      {/* 6 Metric KPI Grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Monthly Sales</span>
          <p className="font-mono text-lg font-black text-slate-900 dark:text-white mt-0.5">₹1.60L</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4%</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Booking Growth</span>
          <p className="font-mono text-lg font-black text-emerald-600 mt-0.5">+24.2%</p>
          <span className="text-[10px] text-slate-400">MoM Index</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Package Views</span>
          <p className="font-mono text-lg font-black text-blue-600 mt-0.5">6,880</p>
          <span className="text-[10px] text-slate-400">Organic Inquiries</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Conversion Rate</span>
          <p className="font-mono text-lg font-black text-indigo-600 mt-0.5">3.51%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Industry High</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Customer Rating</span>
          <p className="font-mono text-lg font-black text-amber-500 mt-0.5">4.92 ★</p>
          <span className="text-[10px] text-slate-400">282 Reviews</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Cancellation Rate</span>
          <p className="font-mono text-lg font-black text-rose-500 mt-0.5">1.2%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Very Low</span>
        </div>
      </div>

      {/* Top Performing Tours Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiAward className="text-amber-500" /> Top Performing Tour Packages
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Tour Name</th>
                <th className="pb-3">Bookings</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Conversion</th>
                <th className="pb-3">Seat Occupancy</th>
                <th className="pb-3 text-right">Gross Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPerformingTours.map((tour) => (
                <tr key={tour.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{tour.name}</td>
                  <td className="py-3.5 font-mono">{tour.bookings} Departures</td>
                  <td className="py-3.5 text-slate-500 font-mono">{tour.views}</td>
                  <td className="py-3.5 text-emerald-600 font-bold">{tour.conversion}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                      {tour.occupancy}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600 text-right">
                    {tour.revenue}
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

export default AgencyPerformance;
