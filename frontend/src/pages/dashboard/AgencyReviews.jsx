import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiStar, FiMessageSquare, FiCornerDownRight, FiSend, FiUser,
  FiCalendar, FiCheckCircle
} from 'react-icons/fi';

const mockAgencyGuestReviews = [
  {
    id: 'ag_rev_1',
    customer: 'Amol Sharma',
    rating: 5,
    tour: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    date: '15 Jan 2026',
    comment: 'Exceptional trip! The riverside cottages in Jibhi and the Serolsar lake hike were very well coordinated. Bus was comfortable with timely stops.',
    response: 'Thank you Amol! We are thrilled you enjoyed the Jibhi winter departure with our team.'
  },
  {
    id: 'ag_rev_2',
    customer: 'Priya Verma',
    rating: 5,
    tour: 'Kashmir Paradise Group Tour',
    date: '02 Feb 2026',
    comment: 'Dal Lake shikara ride and Gulmarg gondola arrangements were top notch. Houseboat dinner was delicious and authentic Kashmiri cuisine.',
    response: null
  },
  {
    id: 'ag_rev_3',
    customer: 'Karanvir Singh',
    rating: 4.8,
    tour: 'Snow Valley Himalayan Cedar Resort',
    date: '10 Feb 2026',
    comment: 'Great hospitality and clean mountain view rooms. Highly recommend booking the cedar balcony suite.',
    response: null
  },
  {
    id: 'ag_rev_4',
    customer: 'Rohit Verma',
    rating: 5,
    tour: 'Amritsar Spiritual & Heritage Weekend Tour',
    date: '20 Jan 2026',
    comment: 'Golden Temple midnight palki seva and Wagah border VIP retreat tickets were organized smoothly without any hassles.',
    response: 'Thank you Rohit! Looking forward to welcoming you on another North India departure soon.'
  }
];

const ratingDistribution = [
  { stars: 5, percent: 86, count: 242 },
  { stars: 4, percent: 11, count: 32 },
  { stars: 3, percent: 2, count: 6 },
  { stars: 2, percent: 1, count: 2 },
  { stars: 1, percent: 0, count: 0 },
];

const AgencyReviews = () => {
  const [reviews, setReviews] = useState(mockAgencyGuestReviews);
  const [replyDrafts, setReplyDrafts] = useState({});

  const handleSendReply = (id) => {
    const text = replyDrafts[id];
    if (!text || !text.trim()) {
      toast.error('Please write a reply before submitting');
      return;
    }

    setReviews(prev => prev.map(r => r.id === id ? { ...r, response: text } : r));
    setReplyDrafts(prev => ({ ...prev, [id]: '' }));
    toast.success('Response posted and emailed to guest');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
          Guest Reviews &amp; Ratings Feedback
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Read traveler feedback on your group departures, respond to guests, and monitor rating distributions.
        </p>
      </div>

      {/* Rating Overview & Distribution Card */}
      <div className="grid gap-6 md:grid-cols-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6 text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Operator Rating</span>
          <p className="font-display text-4xl font-black text-slate-900 dark:text-white">4.92</p>
          <div className="flex text-amber-400 text-base">★★★★★</div>
          <span className="text-xs text-slate-500">Based on 282 verified passenger reviews</span>
        </div>

        <div className="md:col-span-8 space-y-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">Rating Distribution</span>
          {ratingDistribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                {d.stars} ★
              </span>
              <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${d.percent}%` }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
              <span className="w-16 text-right font-mono text-[11px] text-slate-400 font-semibold">{d.count} ({d.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#0F2942] text-amber-300 font-bold text-xs flex items-center justify-center">
                  {rev.customer.charAt(0)}
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.customer}</span>
                <span className="text-amber-500 text-xs font-bold">★ {rev.rating}</span>
                <span className="text-[10px] text-slate-400">· {rev.date}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                ✓ Verified Booking
              </span>
            </div>

            <p className="text-xs font-bold text-[#0F2942] dark:text-amber-400">
              Tour: <span className="text-slate-800 dark:text-slate-200">{rev.tour}</span>
            </p>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
              "{rev.comment}"
            </div>

            {rev.response ? (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-start gap-2">
                <FiCornerDownRight className="shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <span className="font-bold block text-[11px]">Agency Partner Response:</span>
                  <p className="mt-0.5 text-[11px]">{rev.response}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                <input
                  value={replyDrafts[rev.id] || ''}
                  onChange={(e) => setReplyDrafts(d => ({ ...d, [rev.id]: e.target.value }))}
                  placeholder="Write a response to this guest review..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
                <button
                  onClick={() => handleSendReply(rev.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-3.5 py-1.5 text-xs font-bold transition shadow"
                >
                  <FiSend /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default AgencyReviews;
