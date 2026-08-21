import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiSettings, FiShield, FiSave, FiDollarSign, FiServer,
  FiBell, FiSliders, FiCheckCircle, FiLock
} from 'react-icons/fi';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'PCTE Travel Agency — Freedom To Evolve',
    supportEmail: 'amolsharma2705@gmail.com',
    supportPhone: '+91 98145 19578',
    defaultCommissionRate: '8.5',
    escrowHoldingDays: '7',
    maintenanceMode: false,
    autoApproveVerifiedAgencies: true,
    requireAadhaarKyc: true,
    smsNotificationsEnabled: true
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform operational settings saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
          Platform Operations &amp; System Configuration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure default platform commission, escrow parameters, automated KYC policies, and gateway credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: General Platform Config */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiSettings className="text-[#0F2942] dark:text-amber-400" /> Platform Identity &amp; Contact Desk
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Platform Brand Title</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lead Admin Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Campus Departure Hub</label>
              <input
                type="text"
                disabled
                value="PCTE Campus, Baddowal / Ludhiana, Punjab"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Commission Parameters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiDollarSign className="text-emerald-500" /> Platform Fee &amp; Escrow Mandate
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Default Base Commission Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.defaultCommissionRate}
                  onChange={(e) => handleChange('defaultCommissionRate', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Applied automatically to new verified tour operator listings.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Escrow Holding Period (Post-Departure)</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.escrowHoldingDays}
                  onChange={(e) => handleChange('escrowHoldingDays', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">Days</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Funds released to operator bank after tour trip completion.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Governance & Security Controls */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiShield className="text-[#E11D48]" /> Compliance, KYC &amp; Live Switches
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Require Aadhaar / KYC for High-Altitude Tours</span>
                <span className="text-[11px] text-slate-500">Enforce verified traveler ID before booking Spiti &amp; Ladakh treks</span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireAadhaarKyc}
                onChange={(e) => handleChange('requireAadhaarKyc', e.target.checked)}
                className="h-4 w-4 rounded text-[#0F2942] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Automated WhatsApp / SMS Booking Alerts</span>
                <span className="text-[11px] text-slate-500">Send instant departure boarding passes to travelers and operators</span>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotificationsEnabled}
                onChange={(e) => handleChange('smsNotificationsEnabled', e.target.checked)}
                className="h-4 w-4 rounded text-[#0F2942] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 cursor-pointer">
              <div>
                <span className="font-bold text-rose-900 dark:text-rose-300 block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-rose-700 dark:text-rose-400">Temporarily freeze new bookings while maintaining staff access</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="h-4 w-4 rounded text-rose-600 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] px-6 py-3 text-xs font-black text-white shadow-md transition uppercase tracking-wider disabled:opacity-60"
          >
            <FiSave /> {saving ? 'Saving Changes…' : 'Save Configuration'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
