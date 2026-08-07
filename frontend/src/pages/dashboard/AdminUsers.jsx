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
      setUsers(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [role]);

  const setAgencyStatus = async (id, agencyStatus) => {
    try {
      await api.put(`/dashboard/admin/agencies/${id}/status`, { agencyStatus });
      toast.success(`Agency ${agencyStatus}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update agency');
    }
  };

  const setUserStatus = async (id, status) => {
    try {
      await api.put(`/dashboard/admin/users/${id}/status`, { status });
      toast.success(`User ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user');
    }
  };

  return (
    <div>
      <div className="mb-5 flex gap-2 rounded-lg border border-ink/10 dark:border-paper/20 p-1 text-sm w-fit">
        {['agency', 'customer'].map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`rounded-md px-4 py-1.5 font-medium capitalize ${role === r ? 'bg-lagoon-500 text-paper' : 'text-ink/60 dark:text-paper/60'}`}>
            {r}s
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
              <div>
                <p className="font-medium">{u.name} {u.role === 'agency' && `— ${u.agencyName}`}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">{u.email} · {u.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.role === 'agency' && (
                  <span className="rounded-full bg-ink/5 dark:bg-paper/10 px-3 py-1 text-xs font-semibold capitalize">{u.agencyStatus}</span>
                )}
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${u.status === 'blocked' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300'}`}>
                  {u.status}
                </span>

                {u.role === 'agency' && u.agencyStatus === 'pending' && (
                  <>
                    <button onClick={() => setAgencyStatus(u._id, 'approved')} className="rounded-lg bg-lagoon-500 px-3 py-1.5 text-xs font-semibold text-paper hover:bg-lagoon-600">Approve</button>
                    <button onClick={() => setAgencyStatus(u._id, 'rejected')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500">Reject</button>
                  </>
                )}

                <button
                  onClick={() => setUserStatus(u._id, u.status === 'blocked' ? 'active' : 'blocked')}
                  className="rounded-lg border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-xs font-semibold"
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
