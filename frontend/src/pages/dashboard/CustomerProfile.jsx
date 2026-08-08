import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', passwords);
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold">Profile details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input disabled value={user?.email || 'customer@travelstay.com'} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-ink/5 dark:bg-paper/5 px-3 py-2 text-sm text-ink/50 dark:text-paper/50" />
          </div>
        </div>
        <button disabled={saving} className="mt-4 rounded-lg bg-lagoon-500 px-5 py-2 text-sm font-semibold text-paper hover:bg-lagoon-600 disabled:opacity-60">
          Save changes
        </button>
      </form>

      <form onSubmit={changePassword} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold">Change password</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="password" required placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input type="password" required minLength={6} placeholder="New password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        </div>
        <button className="mt-4 rounded-lg border border-ink/10 dark:border-paper/20 px-5 py-2 text-sm font-semibold hover:border-lagoon-500">
          Update password
        </button>
      </form>
    </div>
  );
};

export default CustomerProfile;
