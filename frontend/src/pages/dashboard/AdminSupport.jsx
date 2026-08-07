import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/support');
      setMessages(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const respond = async (id) => {
    try {
      await api.put(`/support/${id}`, { status: 'resolved', adminReply: replyDrafts[id] || '' });
      toast.success('Marked as resolved');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  if (loading) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;
  if (messages.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
        <p className="font-display text-lg font-semibold">No support messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m._id} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-medium">{m.subject}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${m.status === 'resolved' ? 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300' : 'bg-sand-400/20 text-sand-600'}`}>
              {m.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{m.name} · {m.email}</p>
          <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">{m.message}</p>
          {m.status !== 'resolved' && (
            <div className="mt-3 flex gap-2">
              <input
                placeholder="Reply (optional)"
                value={replyDrafts[m._id] || ''}
                onChange={(e) => setReplyDrafts((d) => ({ ...d, [m._id]: e.target.value }))}
                className="flex-1 rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm"
              />
              <button onClick={() => respond(m._id)} className="rounded-lg bg-lagoon-500 px-4 py-2 text-xs font-semibold text-paper hover:bg-lagoon-600">
                Mark resolved
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSupport;
