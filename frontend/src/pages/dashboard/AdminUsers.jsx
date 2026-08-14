import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const AdminUsers = () => {
  const [role, setRole] = useState('agency');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/admin/users', { params: { role } });
      setUsers(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [role]);

  const setAgencyStatus = async (id, agencyStatus) => {
    try {
      await api.put(`/dashboard/admin/agencies/${id}/status`, { agencyStatus });
      toast.success(`Agency status updated to ${agencyStatus}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update agency status');
    }
  };

  const setUserStatus = async (id, status) => {
    try {
      await api.put(`/dashboard/admin/users/${id}/status`, { status });
      toast.success(`User status updated to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user status');
    }
  };

  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Users & Agencies</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage customer accounts and agency approvals.</p>
        </div>

        <div className="flex gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 p-1 text-xs">
          {['agency', 'customer'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`rounded-lg px-4 py-1.5 font-bold capitalize transition-all ${
                role === r
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {r}s
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-xs text-slate-500">Loading accounts...</span>
        </div>
      ) : userList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-14 text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No {role} accounts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userList.map((u) => (
            <div
              key={u._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                  {u.role === 'agency' && u.agencyName && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">({u.agencyName})</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {u.email} {u.phone ? `· ${u.phone}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {u.role === 'agency' && u.agencyStatus && (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${
                      u.agencyStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : u.agencyStatus === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    Agency: {u.agencyStatus}
                  </span>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${
                    u.status === 'blocked'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  Account: {u.status || 'active'}
                </span>

                {u.role === 'agency' && u.agencyStatus === 'pending' && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => setAgencyStatus(u._id, 'approved')}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setAgencyStatus(u._id, 'rejected')}
                      className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setUserStatus(u._id, u.status === 'blocked' ? 'active' : 'blocked')}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {u.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
