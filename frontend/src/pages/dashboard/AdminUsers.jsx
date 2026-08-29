import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiUsers, FiBriefcase, FiShield, FiSearch, FiFilter, FiCheckCircle,
  FiXCircle, FiEye, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign, FiAlertCircle
} from 'react-icons/fi';
import api from '../../api/axios.js';

const AdminUsers = () => {
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'customer' | 'agency' | 'unverified'
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/admin/users', {
        params: { role: roleFilter === 'all' || roleFilter === 'unverified' ? undefined : roleFilter }
      });
      if (Array.isArray(res.data?.data)) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Could not load user accounts. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const setAgencyStatus = async (id, newStatus) => {
    try {
      await api.put(`/dashboard/admin/agencies/${id}/status`, { agencyStatus: newStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, agencyStatus: newStatus, kycStatus: newStatus === 'approved' ? 'verified' : u.kycStatus } : u));
      toast.success(`Agency partner status set to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update agency status:', err);
      toast.error('Could not update agency status.');
    }
  };

  const handleVerifyAgency = async (id) => {
    try {
      await api.put(`/auth/users/${id}/verify`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, agencyStatus: 'approved', kycStatus: 'verified' } : u));
      toast.success('Agency KYC and operational credentials verified successfully!');
    } catch (err) {
      toast.error('Failed to verify agency.');
    }
  };

  const handleDeleteUser = async (u) => {
    try {
      await api.delete(`/auth/users/${u._id}`);
      setUsers(prev => prev.filter(item => item._id !== u._id));
      toast.success(`User ${u.name} removed from platform.`);
      setUserToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const toggleUserBlock = async (u) => {
    const newStatus = u.status === 'blocked' ? 'active' : 'blocked';
    try {
      await api.put(`/dashboard/admin/users/${u._id}/status`, { status: newStatus });
      setUsers(prev => prev.map(item => item._id === u._id ? { ...item, status: newStatus } : item));
      toast.success(`User marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      toast.error('Could not change user status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const isUnverified = (u.role === 'agency' && (u.agencyStatus === 'pending' || u.kycStatus !== 'verified')) || u.status === 'blocked';
    const matchRole = roleFilter === 'all'
      ? true
      : roleFilter === 'unverified'
      ? isUnverified
      : u.role === roleFilter;

    const matchQuery = !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.agencyName && u.agencyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchQuery;
  });

  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalAgencies = users.filter(u => u.role === 'agency').length;
  const pendingAgencies = users.filter(u => u.role === 'agency' && (u.agencyStatus === 'pending' || u.kycStatus !== 'verified')).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">User Accounts &amp; Operators Telemetry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Inspect user spending, verified Aadhaar/Passport KYC status, and moderate agency onboarding.</p>
        </div>
      </div>

      {/* Quick Telemetry KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Customers</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">{totalCustomers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Verified Agencies</span>
          <p className="font-mono text-xl font-black text-emerald-600">{totalAgencies} Partners</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Agency Approvals</span>
          <p className="font-mono text-xl font-black text-amber-500">{pendingAgencies} Pending</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total User Accounts</span>
          <p className="font-mono text-xl font-black text-[#E11D48]">{users.length}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, agency name..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'unverified', label: `⚠️ Unverified (${pendingAgencies})` },
            { id: 'customer', label: 'Customers' },
            { id: 'agency', label: 'Agency Operators' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                roleFilter === r.id
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading user accounts...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={loadUsers} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Users Table / Card List */
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">{u.name}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      u.role === 'agency' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                    {u.role === 'agency' && (u.agencyStatus === 'pending' || u.kycStatus !== 'verified') ? (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        ⚠️ Pending Verification
                      </span>
                    ) : u.status === 'active' ? (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FiCheckCircle size={10} /> Active
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {u.email} · <span className="font-mono">{u.phone || 'No phone'}</span> {u.city ? `· ${u.city}` : ''}
                  </p>
                  {u.agencyName && (
                    <p className="text-[11px] font-bold text-[#E11D48]">{u.agencyName}</p>
                  )}
                </div>
              </div>

              {/* Metrics & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right text-xs pr-2">
                  <span className="text-[10px] text-slate-400 block font-bold">Platform Volume</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹{(u.totalSpent || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedUserModal(u)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <FiEye /> View
                  </button>

                  {u.role === 'agency' && (u.agencyStatus === 'pending' || u.kycStatus !== 'verified') && (
                    <button
                      onClick={() => handleVerifyAgency(u._id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                    >
                      ✓ Verify
                    </button>
                  )}

                  <button
                    onClick={() => toggleUserBlock(u)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                      u.status === 'blocked'
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600'
                    }`}
                  >
                    {u.status === 'blocked' ? 'Unblock' : 'Block'}
                  </button>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 px-2.5 py-1.5 text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                      title="Remove User / Agency"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No user accounts found matching the search / filter.
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-red-300 dark:border-red-900 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 text-red-600">
              <FiAlertCircle className="text-2xl shrink-0" />
              <div>
                <h3 className="font-display text-base font-black">Confirm Account Removal</h3>
                <p className="text-xs text-slate-500">This action will delete the account from the database.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-xs space-y-1">
              <p><strong>Name:</strong> {userToDelete.name}</p>
              <p><strong>Email:</strong> {userToDelete.email}</p>
              <p><strong>Role:</strong> <span className="uppercase font-bold">{userToDelete.role}</span></p>
              {userToDelete.agencyName && <p><strong>Agency:</strong> {userToDelete.agencyName}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setUserToDelete(null)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow"
              >
                Yes, Remove User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DOSSIER INSPECTOR MODAL */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">User Profile Telemetry Dossier</span>
                <h3 className="font-display text-lg font-black">{selectedUserModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-bold uppercase">{selectedUserModal.role}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Primary Contact Phone:</span>
                <span className="font-mono font-bold">{selectedUserModal.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold">{selectedUserModal.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Lifetime Bookings:</span>
                <span className="font-mono font-bold">{selectedUserModal.tripsBooked || 0} Bookings</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Gross Spent:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(selectedUserModal.totalSpent || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Member Since:</span>
                <span className="font-bold">{selectedUserModal.joinedDate || 'Recently'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
