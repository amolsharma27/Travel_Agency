import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiStar, FiSearch, FiCheckCircle, FiXCircle, FiTrash2,
  FiFilter, FiMessageSquare, FiUser, FiMapPin
} from 'react-icons/fi';

const mockAllReviews = [
  { id: 'rev_01', customer: 'Amol Sharma', rating: 5, target: 'Himachal Group Tour: Jibhi & Tirthan Valley', category: 'Tour Package', date: '15 Jan 2026', comment: 'Exceptional experience! The riverside wooden cottages and snowy trail to Serolsar lake were organized seamlessly. The tour lead was very courteous.', status: 'published', response: null },
  { id: 'rev_02', customer: 'Priya Verma', rating: 5, target: 'Kashmir Paradise Group Tour', category: 'Tour Package', date: '02 Feb 2026', comment: 'Dal Lake shikara ride at sunset was pure magic. Gulmarg gondola Phase 2 tickets were arranged beforehand so we had zero wait time.', status: 'published', response: 'Thank you Priya! Delighted you had a wonderful Kashmir holiday.' },
  { id: 'rev_03', customer: 'Karanvir Singh', rating: 4.8, target: 'Snow Valley Himalayan Cedar Resort', category: 'Hotel & Stay', date: '10 Feb 2026', comment: 'Pine forest view from the balcony room was breathtaking. Food in the restaurant was authentic and hygienic.', status: 'published', response: null },
  { id: 'rev_04', customer: 'Rohit Verma', rating: 5, target: 'Amritsar Spiritual & Heritage Weekend Tour', category: 'Tour Package', date: '20 Jan 2026', comment: 'Golden Temple midnight palki seva and Wagah Border VIP seats were phenomenal. Thank you PCTE travels!', status: 'published', response: null },
  { id: 'rev_05', customer: 'Suspicious Review Bot', rating: 1, target: 'General Platform', category: 'Platform', date: '18 Aug 2026', comment: 'Spam link visit promo website www.fake-deal.com for free tickets.', status: 'flagged', response: null }
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState(mockAllReviews);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = reviews.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = !search ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.target.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleModerate = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Review marked as ${newStatus}`);
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success('Review permanently removed');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Guest Reviews &amp; Platform Sentiment Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit traveler reviews across tours, hotel stays, and verified operator services.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Platform Rating</span>
          <p className="font-mono text-xl font-black text-amber-500">4.92 ★</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Reviews</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">284 Verified</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">5-Star Share</span>
          <p className="font-mono text-xl font-black text-emerald-600">92.4%</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Flagged For Spam</span>
          <p className="font-mono text-xl font-black text-rose-500">
            {reviews.filter(r => r.status === 'flagged').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-1 overflow-x-auto">
          {['all', 'published', 'flagged'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition ${
                filter === f
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'All Reviews' : f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, tour, keyword..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.customer}</span>
                <span className="text-[11px] text-amber-500 font-bold">
                  {'★'.repeat(Math.round(rev.rating))} ({rev.rating}★)
                </span>
                <span className="text-[10px] text-slate-400">· {rev.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  rev.status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {rev.status}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#0F2942] dark:text-amber-400">
              For: {rev.target} <span className="text-slate-400 font-normal">({rev.category})</span>
            </p>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
              "{rev.comment}"
            </div>

            {rev.response && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-2.5 text-xs text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                <b>Operator Response:</b> {rev.response}
              </div>
            )}

            <div className="flex justify-end items-center gap-2 pt-1">
              {rev.status === 'flagged' ? (
                <button
                  onClick={() => handleModerate(rev.id, 'published')}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                >
                  Unblock &amp; Publish
                </button>
              ) : (
                <button
                  onClick={() => handleModerate(rev.id, 'flagged')}
                  className="px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold transition"
                >
                  Flag as Spam
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                title="Delete"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminReviews;
