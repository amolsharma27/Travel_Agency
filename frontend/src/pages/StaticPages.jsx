import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiStar, FiHeart, FiShield, FiTag, FiCompass, FiUsers, FiAward, FiCheck, FiX } from 'react-icons/fi';
import api from '../api/axios.js';
import { mockPreviousTripGallery } from '../data/mockData.js';

export const About = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSpot, setSelectedSpot] = useState(null);

  const categories = ['All', 'Himalayas', 'Coastal', 'Lakes & Valleys', 'Adventure', 'Heritage', 'Spiritual'];

  const filteredSpots = activeCategory === 'All'
    ? mockPreviousTripGallery
    : mockPreviousTripGallery.filter(s => s.category === activeCategory);

  return (
    <div className="bg-paper dark:bg-ink text-ink dark:text-paper pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-32">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Travel Memories"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'; }}
          className="absolute inset-0 h-full w-full object-cover opacity-40 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">Our Story & Travel Philosophy</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight md:text-5xl text-white">
            Making Incredible Travel <span className="text-sand-400">Affordable & Memorable</span> For Everyone
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
            We started Travel & Stay with one core mission: nobody should miss out on exploring India's snow peaks,
            pristine beaches, and royal palaces due to inflated middleman markups. We connect you directly with verified local
            operators so you get transparent, pocket-friendly prices.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/packages"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition duration-150"
            >
              Explore Budget Packages
            </Link>
            <Link
              to="/hotels"
              className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition duration-150"
            >
              Browse Affordable Stays
            </Link>
          </div>
        </div>
      </section>

      {/* STATS & IMPACT */}
      <section className="mx-auto -mt-10 max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-xl md:grid-cols-4 md:p-8">
          <div className="text-center">
            <p className="font-display text-3xl font-extrabold text-lagoon-600 dark:text-lagoon-400 md:text-4xl">18,500+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60 dark:text-paper/60">Happy Travelers</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-extrabold text-lagoon-600 dark:text-lagoon-400 md:text-4xl">150+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60 dark:text-paper/60">Visited Spots Curated</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-extrabold text-lagoon-600 dark:text-lagoon-400 md:text-4xl">₹4.2 Cr+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60 dark:text-paper/60">Direct Traveler Savings</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-extrabold text-lagoon-600 dark:text-lagoon-400 md:text-4xl">4.9 ★</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60 dark:text-paper/60">Average Trip Rating</p>
          </div>
        </div>
      </section>

      {/* PREVIOUS TRIP IMAGES & SPOT HIGHLIGHTS GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon-100 dark:bg-lagoon-900/30 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-lagoon-700 dark:text-lagoon-300">
              <FiMapPin /> Real Traveler Moments
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl text-ink dark:text-paper">
              Previous Trip Memories & Spot Highlights
            </h2>
            <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
              Authentic photos, ratings, and budget tips from travelers who explored India with us.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeCategory === c
                    ? 'bg-lagoon-500 text-white shadow-sm'
                    : 'border border-ink/10 dark:border-paper/20 bg-ink/5 dark:bg-paper/5 hover:bg-lagoon-50 dark:hover:bg-lagoon-900/20 text-ink/70 dark:text-paper/70'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Spot Gallery Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSpots.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedSpot(item)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'; }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {item.category}
                </span>

                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                  <FiStar className="fill-white text-[10px]" /> {item.rating}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-medium text-slate-200 flex items-center gap-1">
                    <FiMapPin className="text-lagoon-400 shrink-0" /> {item.spot}
                  </p>
                  <p className="font-display font-semibold text-sm line-clamp-1">{item.title}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs italic text-ink/70 dark:text-paper/70 line-clamp-2">
                  "{item.quote}"
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-ink/5 dark:border-paper/10 pt-3 text-[11px] text-ink/50 dark:text-paper/50">
                  <span className="font-medium text-ink/80 dark:text-paper/80">{item.traveler.split('(')[0]}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-ink shadow-2xl">
            <button
              onClick={() => setSelectedSpot(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
            >
              <FiX className="text-lg" />
            </button>

            <div className="max-h-[55vh] overflow-hidden bg-black">
              <img
                src={selectedSpot.image}
                alt={selectedSpot.title}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'; }}
                className="h-full w-full object-contain mx-auto"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-lagoon-600 dark:text-lagoon-400">
                    {selectedSpot.category} Spot
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-paper">{selectedSpot.title}</h3>
                  <p className="text-sm text-ink/60 dark:text-paper/60 flex items-center gap-1 mt-0.5">
                    <FiMapPin className="text-lagoon-500" /> {selectedSpot.spot}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-3 py-1.5 font-display text-sm font-bold text-amber-600 dark:text-amber-400">
                  <FiStar className="fill-current" /> {selectedSpot.rating} / 5.0
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-ink/5 dark:bg-paper/5 p-3.5">
                <p className="text-sm italic text-ink/80 dark:text-paper/80">"{selectedSpot.quote}"</p>
                <p className="mt-2 text-xs font-semibold text-ink/60 dark:text-paper/60">
                  — {selectedSpot.traveler} • <span className="font-normal">{selectedSpot.date}</span>
                </p>
              </div>

              {selectedSpot.budgetTip && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                  <FiTag className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold">Affordable Budget Tip: </span>
                    <span>{selectedSpot.budgetTip}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WHY CHOOSE US / AFFORDABLE PROMISE */}
      <section className="mx-auto max-w-6xl px-5 pt-20 md:px-8">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600 font-semibold">Why Travel & Stay</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-paper">The Honest & Affordable Travel Guarantee</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60 dark:text-paper/60">
            Here is how we deliver top-tier trips at 30% lower prices compared to legacy booking portals.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon-500/10 text-lagoon-600 dark:text-lagoon-400">
              <FiTag className="text-2xl" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-paper">Zero Commission Markups</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
              We eliminate multiple layers of intermediaries. What you see is the direct contracted price from verified tour operators.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon-500/10 text-lagoon-600 dark:text-lagoon-400">
              <FiShield className="text-2xl" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-paper">100% Hand-Inspected Stays</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
              Every homestay, mountain camp, and resort is verified for clean bathrooms, comfortable beds, hot water, and safety.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon-500/10 text-lagoon-600 dark:text-lagoon-400">
              <FiCompass className="text-2xl" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-paper">Dedicated 24/7 Trip Escort</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
              From station pickups to bonfire nights and rafting safety, our local trip leaders ensure smooth journeys from start to end.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mx-auto mt-20 max-w-5xl px-5 md:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-lagoon-700 p-8 text-center text-white shadow-2xl md:p-14 border border-white/10">
          <h2 className="font-display text-2xl font-bold md:text-4xl text-white">Ready to Create Your Own Travel Memories?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-100 md:text-base">
            Join thousands of smart backpackers, couples, and families traveling across India with confidence and unbeatable value.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/packages"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:scale-105"
            >
              Browse Tour Packages
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/40 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25 hover:scale-105"
            >
              Log in to View Past Trip Albums
            </Link>
          </div>
        </div>
      </section>
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
