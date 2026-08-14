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
      setMessages(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id) => {
    try {
      await api.put(`/support/${id}`, { status: 'resolved', adminReply: replyDrafts[id] || '' });
      toast.success('Ticket marked as resolved');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update ticket');
    }
  };

  const messageList = Array.isArray(messages) ? messages : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500"></div>
        <span className="ml-3 text-xs text-slate-500">Loading support tickets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Support Tickets</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage customer inquiries and resolution status.</p>
      </div>

      {messageList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-14 text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No support tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messageList.map((m) => (
            <div
              key={m._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{m.subject || 'Support Request'}</p>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${
                    m.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {(m.status || 'open').replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{m.name || 'User'}</span> · {m.email}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                {m.message}
              </p>
              {m.status !== 'resolved' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <input
                    placeholder="Reply note (optional)..."
                    value={replyDrafts[m._id] || ''}
                    onChange={(e) => setReplyDrafts((d) => ({ ...d, [m._id]: e.target.value }))}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => respond(m._id)}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
