import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiAward, FiGift, FiClock, FiCheckCircle, FiArrowRight,
  FiZap, FiPercent, FiCoffee, FiCompass
} from 'react-icons/fi';

const availableRewards = [
  { id: 'rwd_01', title: '₹1,000 Flat Discount Voucher', pointsRequired: 1000, description: 'Applicable on any Himachal or Kashmir Group Tour booking.', icon: FiGift },
  { id: 'rwd_02', title: 'Free Airport AC Sedan Transfer', pointsRequired: 800, description: 'Ludhiana / Chandigarh ISBT to Mohali Airport transfer pass.', icon: FiCompass },
  { id: 'rwd_03', title: '15% Off Mountain Chalet Stays', pointsRequired: 600, description: 'Valid on Jibhi wooden chalets and Manali cedar resorts.', icon: FiPercent },
  { id: 'rwd_04', title: 'Complimentary Camp Bonfire & Barbeque', pointsRequired: 400, description: 'Special evening bonfire session on Serolsar Lake trek departures.', icon: FiCoffee }
];

const mockPointsHistory = [
  { id: 'pt_1', date: '21 Aug 2026', desc: 'Earned on Himachal Group Tour Booking (BK-2026-8801)', points: '+250', type: 'credit' },
  { id: 'pt_2', date: '02 Feb 2026', desc: 'Earned on Kashmir Paradise Group Tour', points: '+600', type: 'credit' },
  { id: 'pt_3', date: '15 Jan 2026', desc: 'Redeemed for ₹500 Weekend Getaway Coupon', points: '-500', type: 'debit' },
  { id: 'pt_4', date: '10 Jan 2026', desc: 'Welcome Explorer Bonus Points', points: '+1100', type: 'credit' }
];

const CustomerRewards = () => {
  const [currentPoints, setCurrentPoints] = useState(1450);
  const [history, setHistory] = useState(mockPointsHistory);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
          <div>
            <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30 inline-flex items-center gap-1.5 mb-1.5">
              <FiAward /> Gold Explorer Member
            </span>
            <h3 className="font-display text-2xl font-black text-white">
              {currentPoints.toLocaleString()} Travel Reward Points
            </h3>
            <p className="text-xs text-slate-300">Equivalent to ₹{currentPoints.toLocaleString()} instant redemption balance</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Milestone Tier</span>
            <span className="font-display text-base font-bold text-amber-300">Platinum Explorer</span>
            <span className="text-[11px] text-slate-400 block font-mono">550 pts to upgrade</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (currentPoints / 2000) * 100)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#E11D48]"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Gold Tier (1,000 pts)</span>
            <span>Platinum Tier (2,000 pts)</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            <FiClock /> View Points History →
          </button>
        </div>
      </div>

      {/* Redeemable Rewards Catalogue */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Redeem Available Vouchers &amp; Perks
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {availableRewards.map((rwd) => {
            const Icon = rwd.icon;
            const canRedeem = currentPoints >= rwd.pointsRequired;
            return (
              <div
                key={rwd.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#E11D48]">
                      {rwd.pointsRequired} Points
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {rwd.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {rwd.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleRedeem(rwd)}
                    disabled={!canRedeem}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition shadow ${
                      canRedeem
                        ? 'bg-[#0F2942] hover:bg-[#E11D48] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Redeem Voucher' : `Needs ${rwd.pointsRequired - currentPoints} More Pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POINTS HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display text-base font-black flex items-center gap-2">
                <FiClock /> Reward Points Ledger
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {history.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{h.desc}</p>
                    <span className="text-[10px] text-slate-400">{h.date}</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${
                    h.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {h.points}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerRewards;
