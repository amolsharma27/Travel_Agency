import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import pcteLogo from '../assets/pcte-logo.png';

const PHONE_NUMBER = '9988110021';
const DISPLAY_PHONE = '+91 99881 10021';
const OFFICIAL_EMAIL = 'pcte_travels@pcte.edu.in';
const WHATSAPP_URL = `https://wa.me/919988110021?text=${encodeURIComponent('Hello PCTE Travels, I would like to enquire about travel packages.')}`;

const columns = [
  {
    title: 'Tours & Packages',
    links: [
      { to: '/packages?category=Group+Tours', label: 'Himachal Group Tours (Jibhi/Kasol)' },
      { to: '/packages?q=Amritsar', label: 'Amritsar Golden Temple Weekend' },
      { to: '/packages?category=Group+Tours', label: 'Kashmir Paradise Group Tour' },
      { to: '/packages?category=Group+Tours', label: 'Rajasthan Royal Heritage' },
      { to: '/packages?category=Private+Tours', label: 'Couples & Honeymoon Trips' },
      { to: '/packages?category=Adventure+Tours', label: 'Spiti Valley 4x4 Expedition' },
      { to: '/packages?category=Adventure+Tours', label: 'Rishikesh Rafting & Camping' },
    ],
  },
  {
    title: 'Stays & Hospitality',
    links: [
      { to: '/hotels?category=Resorts', label: 'Mountain & Beach Resorts' },
      { to: '/hotels?category=Hotels', label: 'Heritage Haveli Hotels' },
      { to: '/hotels?category=Homestays', label: 'Jibhi Wooden Homestays' },
      { to: '/hotels?category=Hostels', label: 'Backpacker Hostels & Co-living' },
      { to: '/hotels?category=Camping', label: 'Riverside Glamping & Swiss Tents' },
      { to: '/hotels?category=Villas', label: 'Private Villas & Apartments' },
    ],
  },
  {
    title: 'Mobility & Services',
    links: [
      { to: '/transportation', label: 'Flight Booking & Quotes' },
      { to: '/transportation', label: 'Train Ticket Assistance' },
      { to: '/transportation', label: 'Volvo AC Bus Bookings' },
      { to: '/transportation', label: 'Intercity Cabs & Innova Crysta' },
      { to: '/activities', label: 'Adventure Sports & Bungee' },
      { to: '/nearby-getaways', label: 'Weekend Getaways from Punjab' },
      { to: '/passport-services', label: 'Passport Application Assistance' },
    ],
  },
  {
    title: 'Company & Support',
    links: [
      { to: '/about', label: 'About PCTE Travel Agency' },
      { to: '/contact', label: 'Contact Support Desk' },
      { to: '/admin/enquiries', label: 'Student Enquiries Portal' },
      { to: '/faq', label: 'Travel FAQs & Guidelines' },
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#0B1727] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          
          {/* Company Identity */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={pcteLogo} alt="PCTE Logo" className="h-11 w-auto object-contain bg-white/90 rounded-lg p-1" />
              <div className="flex flex-col">
                <span className="leading-tight text-white font-black text-lg tracking-tight">
                  PCTE <span className="text-[#E11D48]">TRAVEL AGENCY</span>
                </span>
                <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase">
                  Freedom To Evolve
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Premier travel company providing end-to-end holiday planning, group departures, premium stays, transportation logistics, adventure activities, and official passport application assistance.
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <p className="flex items-center gap-2">
                <FiPhone className="text-amber-400 shrink-0" />
                <a href={`tel:+91${PHONE_NUMBER}`} className="hover:text-amber-300 font-mono font-bold transition-colors">
                  {DISPLAY_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <FiMail className="text-amber-400 shrink-0" />
                <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-amber-300 transition-colors">
                  {OFFICIAL_EMAIL}
                </a>
              </p>
              <p className="flex items-start gap-2 text-slate-400">
                <FiMapPin className="text-amber-400 shrink-0 mt-0.5" />
                <span>PCTE Group of Institutes, Baddowal Cantt, Ferozepur Road, Ludhiana, Punjab - 142021</span>
              </p>
            </div>

            {/* Social & WhatsApp Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all hover:scale-105"
                title="WhatsApp PCTE Travels"
              >
                <FaWhatsapp size={17} />
              </a>
              <a
                href="https://instagram.com/pctetravels"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:border-pink-500 hover:text-pink-400 transition-colors"
                title="Instagram @pctetravels"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://facebook.com/pctetravels"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                title="Facebook PCTE Travels"
              >
                <FaFacebook size={15} />
              </a>
            </div>
          </div>

          {/* Dynamic Column Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3.5 text-xs font-black uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-xs text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mandatory Passport Assistance Legal Advisory */}
        <div className="mt-10 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-[11px] text-slate-400 leading-relaxed flex flex-col md:flex-row items-start md:items-center gap-3">
          <FiShield className="text-amber-400 text-xl shrink-0" />
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider">Passport Assistance Disclosure: </span>
            Official passport applications are issued and processed exclusively through the Ministry of External Affairs, Government of India (passportindia.gov.in). Our agency provides independent consultancy, document pre-screening, appointment slot scheduling, and procedural guidance.
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 md:flex-row">
          <span>© {new Date().getFullYear()} PCTE Travel Agency. All rights reserved.</span>
          <span className="flex items-center gap-2 text-slate-300">
            <FiCheckCircle className="text-emerald-400" /> Verified Partners · Direct WhatsApp Enquiry · Dedicated Travel Support
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
