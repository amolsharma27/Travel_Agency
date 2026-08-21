import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiSettings, FiBriefcase, FiShield, FiSave, FiUpload,
  FiDollarSign, FiGlobe, FiPhone, FiMail, FiMapPin, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const AgencySettings = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    agencyName: user?.agencyName || 'PCTE Travel Agency — Freedom To Evolve',
    email: user?.email || 'agency@pctetravels.com',
    phone: user?.phone || '+91 99881 10021',
    address: 'PCTE Campus, Near Baddowal, Ferozepur Road, Ludhiana, Punjab - 142021',
    website: 'https://pctetravels.com',
    licenseNumber: 'PB-TO-2024-0089',
    description: user?.agencyDescription || 'Premier Punjab & North India Tour Operator specializing in group departures, customized private holidays, adventure sports, transport logistics, and passport assistance.',
    logoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    bankAccountName: 'PCTE Travel Expeditions Pvt Ltd',
    bankAccountNumber: '50200088192019',
    bankIfsc: 'HDFC0000128',
    bankName: 'HDFC Bank, Mall Road Ludhiana'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      updateUser({ ...user, agencyName: form.agencyName, agencyDescription: form.description, phone: form.phone });
      toast.success('Agency credentials and profile updated successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
          Agency Profile &amp; Operational Credentials
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update verified operator information, official license documents, and bank payout details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Agency Brand Information */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiBriefcase className="text-[#0F2942] dark:text-amber-400" /> Agency Identity &amp; Contact Desk
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Agency Trading Name *</label>
              <input
                type="text"
                required
                value={form.agencyName}
                onChange={(e) => handleChange('agencyName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Operator Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Helpline / WhatsApp Contact *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none focus:border-[#0F2942]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Website</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none focus:border-[#0F2942]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Headquarters Physical Address *</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none focus:border-[#0F2942]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Agency Overview &amp; Specialization</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs outline-none focus:border-[#0F2942]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tourism Department License & Verification Documents */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiShield className="text-emerald-500" /> Government Tourism License &amp; Credentials
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">DOT License Registration Number</label>
              <input
                type="text"
                disabled
                value={form.licenseNumber}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 p-2.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Verified &amp; Active with Punjab Tourism Dept</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Attached Compliance Documents</label>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">GST Registration (03AAECP8821Q1Z4)</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Tour Operator Certificate</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Bank Account Payout Details */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <FiDollarSign className="text-[#E11D48]" /> Bank Settlement &amp; Payout Mandate
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Beneficiary Account Name</label>
              <input
                type="text"
                value={form.bankAccountName}
                onChange={(e) => handleChange('bankAccountName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bank Account Number</label>
              <input
                type="text"
                value={form.bankAccountNumber}
                onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono font-semibold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bank IFSC Code</label>
              <input
                type="text"
                value={form.bankIfsc}
                onChange={(e) => handleChange('bankIfsc', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono font-semibold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bank Branch</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] px-6 py-3 text-xs font-black text-white shadow-md transition uppercase tracking-wider disabled:opacity-60"
          >
            <FiSave /> {saving ? 'Saving Profile…' : 'Save Agency Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AgencySettings;
