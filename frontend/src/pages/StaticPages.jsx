import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

export const About = () => (
  <div className="mx-auto max-w-3xl px-5 py-16">
    <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Our story</p>
    <h1 className="mt-2 font-display text-3xl font-semibold">About Travel & Stay</h1>
    <p className="mt-6 leading-relaxed text-ink/70 dark:text-paper/70">
      We started Travel & Stay because booking a trip shouldn't mean juggling five different
      apps and hoping the fine print doesn't bite. We work directly with verified travel
      agencies and independent hotels so every price you see at checkout is the price you pay —
      no surprise fees, no fake urgency banners.
    </p>
    <p className="mt-4 leading-relaxed text-ink/70 dark:text-paper/70">
      Every agency and hotel on the platform goes through a manual review before their first
      listing goes live, and stays under ongoing review afterward. If something doesn't match
      what was promised, our support team steps in.
    </p>
  </div>
);

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/support', form);
      toast.success(data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Get in touch</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Contact support</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm" />
        <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm" />
        <textarea required rows={4} placeholder="How can we help?" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm" />
        <button disabled={sending} className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 disabled:opacity-60">
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: 'How do I cancel a booking?', a: 'Go to Dashboard → Bookings and select Cancel on any eligible booking. Refund terms follow the cancellation policy shown at checkout.' },
    { q: 'How does agency approval work?', a: 'Every travel agency account is reviewed by our admin team before it can publish packages or hotels. This usually takes under 24 hours.' },
    { q: 'Is payment secure?', a: 'All payments are processed through Razorpay with industry-standard encryption. We never store your card details.' },
    { q: 'Can I get an invoice?', a: 'Yes — a PDF receipt is available for download from Dashboard → Bookings on any confirmed booking.' },
  ];
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Help center</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Frequently asked questions</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
            <summary className="cursor-pointer font-display font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export const Privacy = () => (
  <div className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
    <p className="mt-6 leading-relaxed text-ink/70 dark:text-paper/70">
      We collect the information you provide when registering, booking, or contacting support —
      name, email, phone, and payment metadata (never full card numbers, which are handled
      directly by our payment processor). This data is used solely to operate your bookings,
      communicate updates, and improve the platform. We do not sell personal data to third parties.
    </p>
  </div>
);

export const Terms = () => (
  <div className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="font-display text-3xl font-semibold">Terms & Conditions</h1>
    <p className="mt-6 leading-relaxed text-ink/70 dark:text-paper/70">
      By booking through Travel & Stay you agree to the cancellation and payment terms displayed
      at checkout for each package or hotel. Travel agencies and hotel owners are independently
      responsible for the accuracy of their listings; our team moderates listings but cannot
      guarantee every detail in real time.
    </p>
  </div>
);

export const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
    <p className="font-mono text-6xl font-semibold text-lagoon-500">404</p>
    <h1 className="mt-4 font-display text-2xl font-semibold">This page has already checked out</h1>
    <p className="mt-2 text-ink/60 dark:text-paper/60">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="mt-6 rounded-lg bg-lagoon-500 px-5 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600">
      Back to home
    </Link>
  </div>
);
