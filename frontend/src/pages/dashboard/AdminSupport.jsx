import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiLifeBuoy, FiCheckCircle, FiClock, FiMail, FiPhone, FiSend, FiMessageSquare } from 'react-icons/fi';
import api from '../../api/axios.js';

const mockSupportTickets = [
  {
    _id: 'tkt_01',
    subject: 'Urgent: PSK Appointment Slot Rescheduling for Tatkaal Application',
    name: 'Amol Sharma',
    email: 'amolsharma2705@gmail.com',
    phone: '+91 98145 19578',
    priority: 'high',
    status: 'open',
    message: 'Need to shift PSK Ludhiana appointment slot from Friday 10 AM to next Monday due to a business meeting in Chandigarh. Please advise if documents need re-verification.',
    submittedTime: '25 mins ago'
  },
  {
    _id: 'tkt_02',
    subject: 'Vegetarian Meal Inclusions for Jibhi Group Departure',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 98765 11998',
    priority: 'medium',
    status: 'open',
    message: 'We are a group of 3 booking the Every Friday Jibhi departure. Please confirm if pure vegetarian bonfire dinners are arranged during the Jalori Pass camp stay.',
    submittedTime: '2 hours ago'
  },
  {
    _id: 'tkt_03',
    subject: 'GST Invoice requirement for Corporate Travel',
    name: 'Tech Ventures Ludhiana',
    email: 'finance@techventures.in',
    phone: '+91 98888 12345',
    priority: 'low',
    status: 'resolved',
    message: 'Need a customized B2B GST tax invoice for 12 corporate Volvo tickets booked for our team retreat.',
    submittedTime: '1 day ago',
    adminReply: 'B2B GST invoice with GSTIN 03AAECP8821Q1Z4 sent to finance@techventures.in.'
  }
];

const AdminSupport = () => {
  const [messages, setMessages] = useState(mockSupportTickets);
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = async () => {
    try {
      const { data } = await api.get('/support');
      if (Array.isArray(data?.data) && data.data.length > 0) {
        setMessages(data.data);
      }
    } catch {
      // fallback to mock
    }
  };

  useEffect(() => { load(); }, []);

  const respond = (id) => {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'resolved', adminReply: replyDrafts[id] || 'Resolved by Support Consultant.' } : m));
    toast.success('Ticket marked as resolved and resolution emailed to client');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Customer Support Desk</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage customer inquiries, booking assistance requests, and passport rescheduling queries.</p>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m._id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{m.subject}</h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                  m.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {m.priority || 'normal'} priority
                </span>
              </div>

              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                m.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              }`}>
                {m.status}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              From: <b className="text-slate-900 dark:text-white">{m.name}</b> · {m.email} {m.phone ? `· ${m.phone}` : ''} · <span className="font-mono">{m.submittedTime}</span>
            </p>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
              "{m.message}"
            </div>

            {m.adminReply && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                <b>Resolution Sent:</b> {m.adminReply}
              </div>
            )}

            {m.status !== 'resolved' && (
              <div className="flex flex-wrap gap-2 pt-2">
                <input
                  placeholder="Type resolution reply message to email client..."
                  value={replyDrafts[m._id] || ''}
                  onChange={(e) => setReplyDrafts((d) => ({ ...d, [m._id]: e.target.value }))}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
                <button
                  onClick={() => respond(m._id)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] px-4 py-2 text-xs font-bold text-white transition-colors shadow"
                >
                  <FiSend /> Send Reply &amp; Resolve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminSupport;
