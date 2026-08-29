import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiLifeBuoy, FiSend, FiCheckCircle, FiClock, FiPlus,
  FiMessageSquare, FiAlertCircle, FiPhone, FiMail
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CustomerSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'Booking Issue',
    subject: '',
    message: '',
    bookingRef: ''
  });

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/my');
      if (res.data?.data) {
        const formatted = res.data.data.map((t) => ({
          id: `TKT-${t._id?.slice(-4)?.toUpperCase() || '2026-0182'}`,
          _id: t._id,
          category: t.subject.includes('[') ? t.subject.split(']')[0].replace('[', '') : 'General Inquiry',
          subject: t.subject.includes(']') ? t.subject.split(']').slice(1).join(']').trim() : t.subject,
          message: t.message,
          status: t.status === 'resolved' ? 'Resolved' : t.status === 'in_progress' ? 'In Progress' : 'Open',
          submittedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
          response: t.adminReply || null,
        }));
        setTickets(formatted);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error('Please fill in ticket subject and description');
      return;
    }
    setSubmitting(true);

    try {
      const fullSubject = `[${form.category}] ${form.subject}${form.bookingRef ? ` (Ref: ${form.bookingRef})` : ''}`;
      await api.post('/support', {
        name: user?.name || 'Valued Customer',
        email: user?.email,
        subject: fullSubject,
        message: form.message,
      });

      toast.success('Support ticket created! A PCTE travel advisor will review and respond.');
      setShowCreateModal(false);
      setForm({ category: 'Booking Issue', subject: '', message: '', bookingRef: '' });
      fetchTickets();
    } catch {
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FiLifeBuoy className="text-[#E11D48]" /> Help, Inquiries &amp; Support Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create support requests for booking amendments, payment clarifications, cancellations, or passport appointment assistance.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiPlus /> Create Support Ticket
        </button>
      </div>

      {/* Direct Contact Channels */}
      <div className="grid gap-3 sm:grid-cols-3">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:border-emerald-500 transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Instant WhatsApp</span>
            <FaWhatsapp className="text-emerald-500" size={16} />
          </div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">+91 98765 43210</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Available 24/7 for On-Trip Travelers</span>
        </a>

        <a
          href="tel:+919876543211"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:border-[#0F2942] transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Helpline Desk</span>
            <FiPhone className="text-blue-500" size={16} />
          </div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">+91 98765 43211</p>
          <span className="text-[10px] text-slate-400">Mon - Sat (09:00 AM - 08:00 PM)</span>
        </a>

        <a
          href="mailto:support@pctetravels.com"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:border-[#E11D48] transition space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Official Email</span>
            <FiMail className="text-[#E11D48]" size={16} />
          </div>
          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">support@pctetravels.com</p>
          <span className="text-[10px] text-slate-400">Replies within 2 Hours</span>
        </a>
      </div>

      {/* Active Tickets List */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          My Support Tickets &amp; Resolutions
        </h3>

        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading your support tickets...</div>
          ) : tickets.length > 0 ? (
            tickets.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0F2942] dark:text-amber-400">{t.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {t.category}
                    </span>
                    <span className="text-[10px] text-slate-400">· {t.submittedDate}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {t.subject}
                </h4>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                  "{t.message}"
                </div>

                {t.response && (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 space-y-1">
                    <span className="font-bold block text-[11px]">Advisor Resolution:</span>
                    <p>{t.response}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30]">
              No active support tickets found. Click "Create Support Ticket" above if you need assistance.
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTicket} className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Assistance Desk</span>
                <h3 className="font-display text-base font-black">Create Support Ticket</h3>
              </div>
              <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Issue Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                >
                  {['Booking Issue', 'Payment Issue', 'Cancellation', 'Passport Service', 'Other Inquiry'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Subject / Summary *</label>
                <input
                  required
                  placeholder="e.g. Need boarding pickup point change for Jibhi departure"
                  value={form.subject}
                  onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none focus:border-[#0F2942]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Booking Reference (Optional)</label>
                <input
                  placeholder="e.g. BK-2026-8801"
                  value={form.bookingRef}
                  onChange={(e) => setForm(prev => ({ ...prev, bookingRef: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe your inquiry or issue in detail..."
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none focus:border-[#0F2942]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2 text-xs font-bold shadow transition"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CustomerSupport;
