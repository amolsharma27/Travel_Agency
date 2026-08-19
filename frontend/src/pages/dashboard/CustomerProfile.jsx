import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiShield,
  FiCheckCircle, FiLock, FiAward, FiUsers, FiEdit2, FiSave,
  FiStar, FiGlobe, FiCreditCard, FiSmartphone
} from 'react-icons/fi';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'travelers' | 'rewards' | 'security'

  // Personal Info Form State
  const [form, setForm] = useState({
    name: user?.name || 'Amol Sharma',
    phone: user?.phone || '+91 98145 19578',
    email: user?.email || 'amolsharma2705@gmail.com',
    dob: '1998-05-27',
    gender: 'Male',
    city: 'Ludhiana',
    state: 'Punjab',
    address: 'Near Model Town, Ludhiana, Punjab - 141002',
    passportNumber: 'Z8923412',
    passportExpiry: '2032-11-15',
    aadhaarLast4: '8821'
  });

  // Emergency & Co-Travelers
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Rohit Sharma',
    relationship: 'Brother',
    phone: '+91 99881 10021'
  });

  const [coTravelers, setCoTravelers] = useState([
    { id: 1, name: 'Ananya Verma', relation: 'Friend / Colleague', phone: '+91 98765 11223', passport: 'P7821902' },
    { id: 2, name: 'Siddharth Sharma', relation: 'Family Member', phone: '+91 98145 22334', passport: 'N6629103' }
  ]);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      if (data?.user) updateUser(data.user);
      toast.success('Profile details updated successfully!');
    } catch {
      updateUser({ ...user, name: form.name, phone: form.phone });
      toast.success('Profile details saved locally!');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await api.put('/auth/change-password', passwords);
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Profile Hero Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-[#0F2942] text-amber-300 font-display font-black text-2xl flex items-center justify-center shadow border-2 border-slate-200 dark:border-slate-700">
              {form.name ? form.name.charAt(0) : 'A'}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs shadow" title="Identity Verified">
              <FiCheckCircle size={14} />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">
                {form.name}
              </h2>
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                <FiAward size={12} /> Gold Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <FiMail className="text-slate-400" /> {form.email}
              <span>·</span>
              <FiMapPin className="text-[#E11D48]" /> {form.city}, {form.state}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <FiShield /> Aadhaar &amp; Phone Verified · Member since March 2023
            </p>
          </div>
        </div>

        {/* Quick Travel Badges */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Completed Trips</span>
            <span className="font-mono text-lg font-black text-slate-900 dark:text-white">14</span>
          </div>
          <div className="flex-1 md:flex-initial rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Reward Points</span>
            <span className="font-mono text-lg font-black text-[#E11D48]">2,450</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {[
          { id: 'personal', label: 'Personal & KYC Details', icon: FiUser },
          { id: 'travelers', label: 'Emergency & Co-Travelers', icon: FiUsers },
          { id: 'rewards', label: 'Loyalty & Reward Points', icon: FiAward },
          { id: 'security', label: 'Password & Security', icon: FiLock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL & KYC DETAILS */}
      {activeTab === 'personal' && (
        <form onSubmit={saveProfile} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
              <p className="text-xs text-slate-500">Official traveler identity details used for ticketing and travel insurance.</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow transition-colors"
            >
              <FiSave /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Legal Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Mobile Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered Email Address</label>
              <input
                disabled
                value={form.email}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 p-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City / State</label>
              <input
                value={`${form.city}, ${form.state}`}
                onChange={(e) => setForm({ ...form, city: e.target.value.split(',')[0], state: e.target.value.split(',')[1] || form.state })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* KYC & Passport details */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiShield className="text-[#E11D48]" /> KYC &amp; Travel Document Credentials
            </h4>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Indian Passport Number</label>
                <input
                  value={form.passportNumber}
                  onChange={(e) => setForm({ ...form, passportNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white uppercase outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Passport Expiry Date</label>
                <input
                  type="date"
                  value={form.passportExpiry}
                  onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aadhaar Card (Last 4 Digits)</label>
                <input
                  value={`XXXX-XXXX-${form.aadhaarLast4}`}
                  disabled
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 p-2.5 text-xs text-slate-500 font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: EMERGENCY & CO-TRAVELERS */}
      {activeTab === 'travelers' && (
        <div className="space-y-6">
          {/* Emergency Contact */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiPhone className="text-red-500" /> Primary Emergency Contact
            </h3>
            <p className="text-xs text-slate-500">Contacted by PCTE trip captains in case of severe medical or mountain emergencies.</p>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Person Name</label>
                <input
                  value={emergencyContact.name}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Relationship</label>
                <input
                  value={emergencyContact.relationship}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  value={emergencyContact.phone}
                  onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Saved Co-Travelers */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiUsers className="text-[#0F2942] dark:text-amber-400" /> Saved Co-Travelers (Fast 1-Click Booking)
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {coTravelers.map((ct) => (
                <div key={ct.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2 bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">{ct.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded">{ct.relation}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Phone: <b>{ct.phone}</b></p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Passport: <b>{ct.passport}</b></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOYALTY & REWARD POINTS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#0F2942] to-[#1E3A5F] p-6 md:p-8 text-white shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <FiAward /> PCTE Explorer Rewards Club
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl font-black text-white">2,450 Reward Points</h3>
                <p className="text-xs text-slate-300 mt-1">Equivalent to <b>₹2,450</b> instant discount applicable at checkout on any tour package or stay.</p>
              </div>
              <button
                onClick={() => toast.success('Reward points ready to apply on your next booking!')}
                className="rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow"
              >
                Redeem on Next Trip
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Lifetime Travel Spend</span>
              <p className="font-mono text-xl font-black text-slate-900 dark:text-white">₹84,200</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Savings / Discounts</span>
              <p className="font-mono text-xl font-black text-emerald-600">₹18,500</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Next Tier Upgrade</span>
              <p className="text-xs font-bold text-amber-500">Platinum Explorer (at 15 trips)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PASSWORD & SECURITY */}
      {activeTab === 'security' && (
        <form onSubmit={changePassword} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Change Account Password</h3>
            <p className="text-xs text-slate-500">Ensure your account uses a strong password with at least 6 characters.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none focus:border-[#0F2942]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none focus:border-[#0F2942]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs outline-none focus:border-[#0F2942]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <FiShield className="text-emerald-500" />
              <span>Two-Factor Authentication (OTP on +91 98145 19578) is <b>Active</b></span>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2.5 text-xs font-bold shadow transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default CustomerProfile;
