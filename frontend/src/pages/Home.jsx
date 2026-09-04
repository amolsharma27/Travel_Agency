import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin, FiShield, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';
import {
  FaPlane, FaHotel, FaSuitcase, FaPassport, FaHiking, FaWhatsapp
} from 'react-icons/fa';
import HeroSlider from '../components/HeroSlider.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import {
  domesticDestinations, mockPreviousTripGallery, mockNearbyGetaways
} from '../data/mockData.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const Home = () => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1727] dark:text-slate-100 min-h-screen">

      {/* 1. DYNAMIC AUTO-ROTATING HERO SLIDER (6s Rotation: Mussoorie Upcoming Tour ⇄ Search Portal) */}
      <HeroSlider />

      {/* 2. EXPLORE 5 MAIN CATEGORIES BAR */}
      <section className="mx-auto mt-12 max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { title: 'Tours & Getaways', subtitle: 'Group, Weekend & Private', icon: FaSuitcase, link: '/packages', count: '14+ Packages' },
            { title: 'Stays & Resorts', subtitle: 'Hotels, Homestays & Camps', icon: FaHotel, link: '/hotels', count: '30+ Properties' },
            { title: 'Transportation', subtitle: 'Flights, Trains & Cabs', icon: FaPlane, link: '/transportation', count: 'Daily Connect' },
            { title: 'Activities', subtitle: 'Rafting, Bungee & Treks', icon: FaHiking, link: '/activities', count: '10+ Adventures' },
            { title: 'Passport Services', subtitle: 'Application Assistance', icon: FaPassport, link: '/passport-services', count: 'MEA Guidance' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm hover:shadow-md hover:border-[#0F2942] dark:hover:border-amber-400 transition-all text-center flex flex-col items-center justify-between space-y-3"
              >
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#0F2942] dark:text-amber-400 flex items-center justify-center group-hover:bg-[#0F2942] group-hover:text-white transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cat.subtitle}</p>
                </div>
                <span className="text-[10px] font-bold text-[#E11D48] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS GRID */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Top Visited Regions
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Popular Travel Destinations
            </h2>
          </div>

          <Link
            to="/packages"
            className="text-xs font-bold text-[#0F2942] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            Explore All Circuits <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {domesticDestinations.slice(0, 6).map((dest) => (
            <Link
              key={dest.name}
              to={`/packages?q=${encodeURIComponent(dest.name)}`}
              className="group relative h-60 overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 block"
            >
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => {
                  if (e.currentTarget.dataset.fallbackApplied) return;
                  e.currentTarget.dataset.fallbackApplied = 'true';
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {dest.state}
                </span>
                <h3 className="font-display text-sm font-bold leading-tight drop-shadow-sm">
                  {dest.name}
                </h3>
                <span className="mt-1 inline-block text-[10px] font-semibold text-slate-300">
                  {dest.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WEEKEND GETAWAYS FROM PUNJAB */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
              Short Weekend Breaks
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Weekend Getaways from Punjab &amp; North India
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Accessible in 2 to 8 hours driving from Ludhiana &amp; Chandigarh.
            </p>
          </div>

          <Link
            to="/packages?category=Nearby+Getaways"
            className="text-xs font-bold text-[#0F2942] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            View All Getaways <FiArrowRight />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockNearbyGetaways.slice(0, 4).map((gw) => (
            <div
              key={gw.id}
              onClick={() => navigate(gw.packageLink || `/packages?q=${encodeURIComponent(gw.destination)}`)}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={gw.image}
                  alt={gw.destination}
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied) return;
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded bg-[#0F2942] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                    {gw.tripDurationType}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                  {gw.travelTime || 'Short drive'}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors">
                  {gw.destination}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {gw.tagline || gw.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {gw.idealFor?.split('·')[0] || 'Weekend Trip'}
                  </span>
                  <span className="font-bold text-[#E11D48] flex items-center gap-1 text-[11px]">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PASSPORT APPLICATION ASSISTANCE SPOTLIGHT BANNER */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="rounded-2xl bg-[#0F2942] p-8 md:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                <FaPassport /> Official Passport Guidance
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-black text-white leading-tight">
                Passport Application Assistance &amp; Pre-Screening
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Expert procedural guidance for Fresh Passports, Renewals, Tatkaal (urgent) slots, Minor Passports, and Police Clearance Certificates (PCC) across Ludhiana, Chandigarh, Jalandhar, and Delhi PSK centers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Document Audit</span>
                  <span className="font-semibold text-white">Pre-Screening Kit</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Fast Scheduling</span>
                  <span className="font-semibold text-white">PSK Appointment</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 border border-white/10">
                  <span className="text-[10px] text-amber-300 block font-bold">Transparent Fee</span>
                  <span className="font-semibold text-white">Govt + Service Fee</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/passport-services"
                  className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow transition-colors"
                >
                  Apply for Passport Assistance &rarr;
                </Link>
                <a
                  href="https://wa.me/919988110021?text=Hi%20PCTE%20Travel%20Agency%2C%20I%20need%20assistance%20with%20Passport%20Application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 hover:bg-white/10 px-5 py-3 text-xs font-bold text-white transition-colors"
                >
                  <FaWhatsapp className="text-emerald-400" /> WhatsApp Passport Desk
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md p-5 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-white/10 pb-2">
                  <FiShield size={18} /> Official Transparency Note
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Passports in India are processed exclusively by the Ministry of External Affairs through official Passport Seva Kendras (passportindia.gov.in). We provide authorized application preparation and appointment consultancy.
                </p>
                <div className="rounded-lg bg-black/20 p-2.5 text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between"><span>Normal Adult Govt Fee:</span><b>₹1,500</b></div>
                  <div className="flex justify-between"><span>Agency Assistance Fee:</span><b>₹499</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="mx-auto my-20 max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Freedom To Evolve
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Why Choose PCTE Travel Agency
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Personalized Travel Planning', desc: 'Every holiday package or private road tour is tailored to your group preferences with detailed day-wise itineraries.' },
            { title: 'Multiple Travel Options', desc: 'From luxury Volvo coaches and 4x4 Spiti tempo travellers to private chauffeur sedans and flight bookings.' },
            { title: 'Verified Hospitality Partners', desc: 'Every hotel, mountain resort, and riverside camp is personally inspected for cleanliness and comfort.' },
            { title: 'Easy & Transparent Booking', desc: 'Clear pricing with zero hidden charges. Direct enquiry notifications delivered straight to official travel desk.' },
            { title: '24/7 Ground Customer Support', desc: 'Dedicated trip coordinators on ground during group departures and real-time helpline for any logistical questions.' },
            { title: 'Customized Tour Packages', desc: 'Modify dates, add custom hotel upgrades, or arrange special group departures with our travel designers.' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 text-base shrink-0" />
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. VERIFIED TRAVELER FEEDBACK (NO RATINGS/STARS) */}
      <section className="mx-auto mb-20 max-w-7xl px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Authentic Feedback
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            What Our Travelers Say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockPreviousTripGallery.map((spot) => (
            <div
              key={spot.id}
              className="overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <FiCheckCircle size={14} />
                  <span>PCTE Traveler Feedback</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{spot.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white">{spot.traveler}</span>
                <span className="text-slate-400">{spot.spot.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
    </div>
  );
};

export default Home;
