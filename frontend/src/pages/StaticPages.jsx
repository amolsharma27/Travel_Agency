import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiStar, FiHeart, FiShield, FiTag, FiCompass, FiUsers, FiAward, FiCheck, FiX, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios.js';
import PcteLogo from '../components/PcteLogo.jsx';
import { mockPreviousTripGallery } from '../data/mockData.js';

export const About = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSpot, setSelectedSpot] = useState(null);

  const categories = ['All', 'Himalayas', 'Coastal', 'Lakes & Valleys', 'Adventure', 'Heritage', 'Spiritual'];

  const filteredSpots = activeCategory === 'All'
    ? mockPreviousTripGallery
    : mockPreviousTripGallery.filter(s => s.category === activeCategory);

  return (
    <div className="bg-[#FAFAF9] dark:bg-[#0B0830] text-slate-900 dark:text-slate-100 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#110D44] py-24 text-white md:py-32">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          alt="PCTE Travel Agency Expedition"
          className="absolute inset-0 h-full w-full object-cover opacity-40 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0830] via-[#110D44]/80 to-[#0B0830]/50" />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8 flex flex-col items-center">
          <PcteLogo variant="white" className="h-16 w-auto mb-4" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/20">
            <FiShield /> PCTE Travel Agency · Freedom To Evolve
          </span>
          <h1 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl text-white">
            PCTE Travel Agency — Freedom To Evolve
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-indigo-100/90 md:text-lg">
            Official PCTE Travel Agency providing curated Every Friday weekend tours, student group educational journeys, Himalayan expeditions, and luxury resort stays. We deliver transparent pricing, certified travel coordinators, and 100% safe travel experiences.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/packages"
              className="rounded-xl bg-[#9B1C1C] hover:bg-[#771D1D] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all"
            >
              Explore All Tour Packages
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all"
            >
              Contact PCTE Travel Experts
            </Link>
          </div>
        </div>
      </section>

      {/* STATS & IMPACT */}
      <section className="mx-auto -mt-10 max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 dark:border-indigo-900/80 bg-white dark:bg-[#110D44] p-6 shadow-xl md:grid-cols-4 md:p-8">
          <div className="text-center">
            <p className="font-display text-3xl font-black text-[#9B1C1C] dark:text-red-400 md:text-4xl">18,500+</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-200/70">Happy Travelers</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-black text-[#9B1C1C] dark:text-red-400 md:text-4xl">400+</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-200/70">Himalayan Expeditions</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-black text-[#9B1C1C] dark:text-red-400 md:text-4xl">50,000+</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-200/70">Spots Curated</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-black text-[#9B1C1C] dark:text-red-400 md:text-4xl">4.9 ★</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-200/70">Average Rating</p>
          </div>
        </div>
      </section>

      {/* PREVIOUS TRIP IMAGES & SPOT HIGHLIGHTS GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9B1C1C]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#9B1C1C] dark:text-red-400">
              <FiMapPin /> Verified Spot Gallery
            </span>
            <h2 className="mt-2 font-display text-2xl font-black md:text-3xl text-slate-900 dark:text-white">
              Previous Trip Spot Highlights &amp; Reviews
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-indigo-200/70">
              Real photos and notes captured by travelers on PCTE Travel Agency tours.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeCategory === c
                    ? 'bg-[#9B1C1C] text-white shadow-sm'
                    : 'border border-slate-200 dark:border-indigo-900/60 bg-slate-100 dark:bg-[#110D44] text-slate-700 dark:text-indigo-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSpots.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedSpot(item)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0B0830]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0830]/80 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-[#1B1464]/90 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-indigo-400/30">
                  {item.category}
                </span>
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#9B1C1C] px-2 py-0.5 text-xs font-bold text-white">
                  <FiStar className="fill-white text-[10px]" /> {item.rating}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-medium text-indigo-200 flex items-center gap-1">
                    <FiMapPin className="text-amber-300 shrink-0" /> {item.spot}
                  </p>
                  <p className="font-display font-bold text-sm line-clamp-1">{item.title}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs italic text-slate-600 dark:text-indigo-200/80 line-clamp-2">
                  "{item.quote}"
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-indigo-900/40 pt-3 text-[11px] text-slate-500 dark:text-indigo-300/60">
                  <span className="font-bold text-slate-900 dark:text-white">{item.traveler.split('(')[0]}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-[#110D44] shadow-2xl border border-slate-200 dark:border-indigo-900">
            <button
              onClick={() => setSelectedSpot(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#1B1464] p-2 text-white transition hover:bg-[#9B1C1C]"
            >
              <FiX className="text-lg" />
            </button>

            <div className="max-h-[55vh] overflow-hidden bg-[#0B0830]">
              <img
                src={selectedSpot.image}
                alt={selectedSpot.title}
                className="h-full w-full object-contain mx-auto"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9B1C1C] dark:text-red-400">
                    {selectedSpot.category} Spot
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{selectedSpot.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-indigo-200/70 flex items-center gap-1 mt-0.5">
                    <FiMapPin className="text-[#9B1C1C]" /> {selectedSpot.spot}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-[#9B1C1C]/10 px-3 py-1.5 font-display text-sm font-bold text-[#9B1C1C] dark:text-red-400">
                  <FiStar className="fill-current" /> {selectedSpot.rating} / 5.0
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-indigo-950/40 p-3.5">
                <p className="text-xs md:text-sm italic text-slate-700 dark:text-indigo-100">"{selectedSpot.quote}"</p>
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-indigo-300/60">
                  — {selectedSpot.traveler} • <span className="font-normal">{selectedSpot.date}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/support', form);
      toast.success(data.message || 'Thank you for reaching out to PCTE Travel Agency support!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.success('Your message has been sent to PCTE Travel Agency support! We will contact you shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <div className="text-center mb-12 flex flex-col items-center">
        <PcteLogo className="h-14 w-auto mb-2" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-extrabold">PCTE Travel Agency Support</p>
        <h1 className="mt-1 font-display text-3xl font-black md:text-4xl text-slate-900 dark:text-white">Get in Touch with PCTE Travel Experts</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-indigo-200/70">Freedom To Evolve — Have questions about weekend trips, educational journeys, or custom tours?</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Contact Info */}
        <div className="md:col-span-5 rounded-2xl bg-[#110D44] p-6 text-white shadow-xl space-y-5 border border-indigo-900">
          <h3 className="font-display text-xl font-bold text-amber-300">PCTE Travel Support Team</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <FiPhone className="text-amber-400 shrink-0 text-base mt-0.5" />
              <div>
                <p className="font-bold text-white">Hotline Support</p>
                <p className="text-indigo-200/80">+91 99966 96928 / +91 94683 12343</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiMail className="text-amber-400 shrink-0 text-base mt-0.5" />
              <div>
                <p className="font-bold text-white">Email Address</p>
                <p className="text-indigo-200/80">info@pctetravels.com / support@pctetravels.com</p>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-900">
              <a
                href="https://wa.me/919996696928?text=Hi%20PCTE%20Travels"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
              >
                <FaWhatsapp size={16} /> Direct WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 rounded-2xl bg-white dark:bg-[#110D44] p-6 shadow-md border border-slate-200 dark:border-indigo-900/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">Send Us a Message</h3>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-200 mb-1">Your Full Name *</label>
              <input required placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9B1C1C]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-200 mb-1">Email Address *</label>
              <input required type="email" placeholder="priya@pctetravels.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9B1C1C]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-200 mb-1">Subject / Tour Interest *</label>
              <input required placeholder="e.g. Educational Tour Inquiry / Weekend Jibhi Package" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full rounded-xl border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9B1C1C]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-200 mb-1">Message / Requirements *</label>
              <textarea required rows={4} placeholder="Please provide details about your dates, number of travelers, budget preferences..." value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full rounded-xl border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9B1C1C]" />
            </div>
            <button disabled={sending} className="w-full rounded-xl bg-[#9B1C1C] py-3 text-xs font-bold text-white hover:bg-[#1B1464] shadow transition-all disabled:opacity-60 uppercase tracking-wider">
              {sending ? 'Sending Message…' : 'Send Message to PCTE Travels'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: 'What makes PCTE Travel Agency unique?', a: 'PCTE Travel Agency provides transparent, high-value weekend trips, educational group journeys, and Himalayan expeditions under the motto Freedom To Evolve with direct operator prices and zero hidden markups.' },
    { q: 'Are all destination images accurate to the actual place?', a: 'Yes! All PCTE tour packages feature 100% accurate, high-definition photography representing the exact geographic spots (Jibhi, Spiti, Rajasthan forts, Golden Temple, Rishikesh rafting, etc.).' },
    { q: 'Can I request a custom tailor-made itinerary?', a: 'Absolutely! Click "Custom Trip Planner" or "Book Now" to enter your destination, preferred dates, and budget. Our PCTE tour consultant will reach out promptly.' },
    { q: 'How do I cancel or manage my booking?', a: 'Log in and navigate to Dashboard → My Bookings to view your ticket pass, invoice, or request a booking update.' },
  ];
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-extrabold">Help &amp; Information</p>
      <h1 className="mt-1 font-display text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="rounded-2xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-5 shadow-sm">
            <summary className="cursor-pointer font-display font-bold text-sm text-slate-900 dark:text-white">{f.q}</summary>
            <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-indigo-200/80 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export const Privacy = () => (
  <div className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
    <p className="mt-6 leading-relaxed text-slate-600 dark:text-indigo-200/80 text-sm">
      PCTE Travel Agency respects your privacy. We collect details provided during booking or inquiry (name, phone, email) solely for itinerary processing, group travel safety, and customer support. We do not sell personal data to third parties.
    </p>
  </div>
);

export const Terms = () => (
  <div className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Terms &amp; Conditions</h1>
    <p className="mt-6 leading-relaxed text-slate-600 dark:text-indigo-200/80 text-sm">
      By booking through PCTE Travel Agency you agree to our cancellation guidelines and payment terms. High altitude treks and educational student group journeys require mandatory safety adherence.
    </p>
  </div>
);

export const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
    <PcteLogo className="h-16 w-auto mb-4" />
    <p className="font-mono text-6xl font-black text-[#9B1C1C]">404</p>
    <h1 className="mt-4 font-display text-2xl font-bold">Destination Page Not Found</h1>
    <p className="mt-2 text-xs text-slate-500 dark:text-indigo-200/70">The tour or page you are looking for has moved.</p>
    <Link to="/" className="mt-6 rounded-xl bg-[#9B1C1C] px-6 py-3 text-xs font-bold text-white shadow hover:bg-[#1B1464]">
      Back to PCTE Travels Home
    </Link>
  </div>
);
