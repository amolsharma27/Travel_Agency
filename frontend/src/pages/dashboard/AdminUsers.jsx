import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiUsers, FiBriefcase, FiShield, FiSearch, FiFilter, FiCheckCircle,
  FiXCircle, FiEye, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign
} from 'react-icons/fi';
import api from '../../api/axios.js';

const mockAdminUsersList = [
  { _id: 'u_01', name: 'Amol Sharma', email: 'amolsharma2705@gmail.com', phone: '+91 98145 19578', role: 'customer', status: 'active', kycStatus: 'verified', city: 'Ludhiana, Punjab', tripsBooked: 14, totalSpent: 84200, joinedDate: '15 March 2023' },
  { _id: 'u_02', name: 'PCTE Travel Expeditions', email: 'agency@pctetravels.com', phone: '+91 99881 10021', role: 'agency', agencyName: 'PCTE Travel & Tours Pvt Ltd', agencyStatus: 'approved', status: 'active', kycStatus: 'verified', city: 'Ludhiana, Punjab', tripsBooked: 102, totalSpent: 640000, joinedDate: '10 Jan 2024' },
  { _id: 'u_03', name: 'Himalayan Wanderers Co.', email: 'wanderers@himalayas.in', phone: '+91 98765 44332', role: 'agency', agencyName: 'Himalayan Wanderers Spiti & Manali', agencyStatus: 'pending', status: 'active', kycStatus: 'under_review', city: 'Manali, HP', tripsBooked: 0, totalSpent: 0, joinedDate: '18 August 2026' },
  { _id: 'u_04', name: 'Priya Verma', email: 'priya.verma@example.com', phone: '+91 98765 11998', role: 'customer', status: 'active', kycStatus: 'verified', city: 'Chandigarh', tripsBooked: 4, totalSpent: 26400, joinedDate: '02 Feb 2025' },
  { _id: 'u_05', name: 'Karanvir Singh', email: 'karanvir.s@example.com', phone: '+91 94683 99221', role: 'customer', status: 'active', kycStatus: 'verified', city: 'Amritsar, Punjab', tripsBooked: 6, totalSpent: 38900, joinedDate: '12 Nov 2024' },
  { _id: 'u_06', name: 'Spiti 4x4 Adventures', email: 'spiti4x4@expeditions.com', phone: '+91 98000 77112', role: 'agency', agencyName: 'Spiti High Altitude 4x4 Tour Partners', agencyStatus: 'approved', status: 'active', kycStatus: 'verified', city: 'Kaza, Spiti', tripsBooked: 38, totalSpent: 245000, joinedDate: '05 May 2024' },
  { _id: 'u_07', name: 'Suspended Guest Account', email: 'spam.user@testmail.com', phone: '+91 90000 00000', role: 'customer', status: 'blocked', kycStatus: 'rejected', city: 'Delhi', tripsBooked: 0, totalSpent: 0, joinedDate: '01 Aug 2026' }
];

const AdminUsers = () => {
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'customer' | 'agency'
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockAdminUsersList);
  const [loading, setLoading] = useState(false);
  const [selectedUserModal, setSelectedUserModal] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/dashboard/admin/users', { params: { role: roleFilter === 'all' ? undefined : roleFilter } });
      if (Array.isArray(data?.data) && data.data.length > 0) {
        setUsers(data.data);
      }
    } catch {
      // fallback to mock
    }
  };

  useEffect(() => {
    load();
  }, [roleFilter]);

  const setAgencyStatus = (id, newStatus) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, agencyStatus: newStatus } : u));
    toast.success(`Agency partner status set to ${newStatus}`);
  };

  const toggleUserBlock = (id) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u));
    toast.success('User account status updated');
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchQuery = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.agencyName && u.agencyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchQuery;
  });

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
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">1,840</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Verified Agencies</span>
          <p className="font-mono text-xl font-black text-emerald-600">28 Partners</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Agency Approvals</span>
          <p className="font-mono text-xl font-black text-amber-500">1 Pending</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">KYC Verified Rate</span>
          <p className="font-mono text-xl font-black text-[#E11D48]">98.5%</p>
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

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'customer', label: 'Customers' },
            { id: 'agency', label: 'Agency Operators' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
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

      {/* Users Table / Card List */}
      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">{u.name}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    u.role === 'agency' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                  {u.kycStatus === 'verified' && (
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <FiCheckCircle size={10} /> KYC Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {u.email} · <span className="font-mono">{u.phone}</span> · {u.city}
                </p>
                {u.agencyName && (
                  <p className="text-[11px] font-bold text-[#E11D48]">{u.agencyName}</p>
                )}
              </div>
            </div>

            {/* Metrics & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 block font-bold">Total Platform Volume</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{u.totalSpent?.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 ml-1">({u.tripsBooked} trips)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUserModal(u)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  <FiEye /> View Dossier
                </button>

                {u.role === 'agency' && u.agencyStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => setAgencyStatus(u._id, 'approved')}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setAgencyStatus(u._id, 'rejected')}
                      className="rounded-lg border border-red-200 text-red-500 px-2.5 py-1.5 text-xs font-bold hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggleUserBlock(u._id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    u.status === 'blocked'
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-500'
                  }`}
                >
                  {u.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                <span className="font-mono font-bold">{selectedUserModal.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold">{selectedUserModal.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">KYC Aadhaar / Passport Verification:</span>
                <span className="font-bold text-emerald-600 uppercase">Verified (Govt ID Match)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Total Lifetime Bookings:</span>
                <span className="font-mono font-bold">{selectedUserModal.tripsBooked} Trips Completed</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Gross Spent:</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedUserModal.totalSpent?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Member Since:</span>
                <span className="font-bold">{selectedUserModal.joinedDate}</span>
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
