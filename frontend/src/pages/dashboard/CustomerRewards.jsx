import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiAward, FiGift, FiClock, FiCheckCircle, FiArrowRight,
  FiZap, FiPercent, FiCoffee, FiCompass, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';

const availableRewards = [
  { id: 'rwd_01', title: '₹1,000 Flat Discount Voucher', pointsRequired: 1000, description: 'Applicable on any Himachal or Kashmir Group Tour booking.', icon: FiGift },
  { id: 'rwd_02', title: 'Free Airport AC Sedan Transfer', pointsRequired: 800, description: 'Ludhiana / Chandigarh ISBT to Mohali Airport transfer pass.', icon: FiCompass },
  { id: 'rwd_03', title: '15% Off Mountain Chalet Stays', pointsRequired: 600, description: 'Valid on Jibhi wooden chalets and Manali cedar resorts.', icon: FiPercent },
  { id: 'rwd_04', title: 'Complimentary Camp Bonfire & Barbeque', pointsRequired: 400, description: 'Special evening bonfire session on Serolsar Lake trek departures.', icon: FiCoffee }
];

const CustomerRewards = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerRewards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/customer');
      if (res.data?.data) {
        const d = res.data.data;
        const pts = d.rewardPoints || Math.round((d.totalSpent || 0) * 0.05);
        setCurrentPoints(pts);
        setTotalSpent(d.totalSpent || 0);

        // Generate points history from recent bookings
        const hist = (d.recentBookings || []).map((b, idx) => ({
          id: `pt_${b._id || idx}`,
          date: new Date(b.travelDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          desc: `Earned on ${b.itemTitle}`,
          points: `+${Math.round((b.totalAmount || 0) * 0.05)}`,
          type: 'credit'
        }));

        if (hist.length === 0) {
          hist.push({
            id: 'pt_welcome',
            date: 'Today',
            desc: 'Welcome Explorer Bonus Points',
            points: '+100',
            type: 'credit'
          });
        }
        setHistory(hist);
      }
    } catch (err) {
      console.error('Failed to load rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerRewards();
  }, []);

  const handleRedeem = (reward) => {
    if (currentPoints < reward.pointsRequired) {
      toast.error(`You need ${reward.pointsRequired - currentPoints} more points to unlock this reward`);
      return;
    }

    const newBalance = currentPoints - reward.pointsRequired;
    setCurrentPoints(newBalance);
    const newEntry = {
      id: 'pt_' + Date.now(),
      date: 'Today',
      desc: `Redeemed for ${reward.title}`,
      points: `-${reward.pointsRequired}`,
      type: 'debit'
    };
    setHistory(prev => [newEntry, ...prev]);
    toast.success(`🎉 Successfully unlocked "${reward.title}"! Voucher code applied to your account.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FiAward className="text-amber-500" /> Loyalty Tier &amp; Travel Rewards
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Earn points with every trip, unlock exclusive weekend vouchers, and elevate your traveler tier.
        </p>
      </div>

      {/* Tier & Balance Hero Banner */}
      <div className="rounded-2xl bg-[#0F2942] p-6 text-white shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
              Explorer Tier Member
            </span>
            <h3 className="font-display text-2xl font-black text-white">
              {currentPoints.toLocaleString('en-IN')} Reward Points
            </h3>
            <p className="text-xs text-slate-300">
              Equivalent to ₹{currentPoints.toLocaleString('en-IN')} in platform travel vouchers. Earned from ₹{totalSpent.toLocaleString('en-IN')} total spent.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Tier Upgrade</span>
            <p className="font-bold text-amber-400 text-sm">Voyager Pro (2,500 pts)</p>
            <div className="w-36 h-2 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min((currentPoints / 2500) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Available Vouchers &amp; Perks
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {availableRewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = currentPoints >= reward.pointsRequired;
            return (
              <div
                key={reward.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#0F2942] text-white">
                      <Icon size={16} />
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-500">
                      {reward.pointsRequired} Points
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {reward.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {reward.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition shadow ${
                    canAfford
                      ? 'bg-[#0F2942] hover:bg-[#E11D48] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem Voucher' : `Need ${reward.pointsRequired - currentPoints} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3">
        <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
          Points Activity History
        </h3>

        <div className="space-y-2 text-xs">
          {history.map((h) => (
            <div key={h.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{h.desc}</p>
                <p className="text-[10px] text-slate-400">{h.date}</p>
              </div>
              <span className={`font-mono font-bold ${h.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {h.points}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CustomerRewards;
