import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import PcteLogo from './PcteLogo.jsx';

const columns = [
  {
    title: 'Weekend & Holiday Tours',
    links: [
      { to: '/packages?category=Weekend+Tours', label: 'Every Friday Weekend Trips' },
      { to: '/packages?q=Jibhi', label: 'Jibhi & Tirthan Valley Tour' },
      { to: '/packages?q=Kasol', label: 'Kasol Kheerganga Trek' },
      { to: '/packages?q=Spiti', label: 'Spiti Valley Circuit (9 Days)' },
      { to: '/packages?q=Triund', label: 'Mcleodganj & Triund Trek' },
    ],
  },
  {
    title: 'Top Destinations',
    links: [
      { to: '/packages?q=Himachal', label: 'Himachal Tours & Homestays' },
      { to: '/packages?q=Punjab', label: 'Punjab Heritage & Golden Temple' },
      { to: '/packages?q=Rajasthan', label: 'Rajasthan Royal Desert & Forts' },
      { to: '/packages?q=Uttarakhand', label: 'Uttarakhand Rafting & Camps' },
      { to: '/packages?q=Goa', label: 'Goa Coastal Beach Getaways' },
      { to: '/packages?category=Educational+Journeys', label: 'Educational Student Journeys' },
    ],
  },
  {
    title: 'Company & Support',
    links: [
      { to: '/about', label: 'About PCTE Travel Agency' },
      { to: '/contact', label: 'Contact Us & Hotline' },
      { to: '/dashboard/payments', label: 'Pay Online' },
      { to: '/faq', label: 'FAQs & Gear Advice' },
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-[#0B0830] text-slate-300 border-t border-indigo-900/60">
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <PcteLogo variant="white" className="h-12 w-auto" />
            <div className="flex flex-col">
              <span className="leading-tight text-white font-black text-xl tracking-tight group-hover:text-[#F8B4B4] transition-colors">
                PCTE <span className="text-[#F05252]">Travel Agency</span>
              </span>
              <span className="text-[10px] font-bold text-amber-300 tracking-widest uppercase">
                Freedom To Evolve
              </span>
            </div>
          </Link>
          
          <p className="text-xs leading-relaxed text-indigo-200/80 max-w-xs">
            Official PCTE Travel Agency — Freedom To Evolve. Offering Every Friday weekend departures, Himalayan treks, educational group journeys, and luxury stays with 100% verified safety.
          </p>

          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-indigo-900/60">
            <p className="flex items-center gap-2">
              <FiPhone className="text-amber-400 shrink-0" />
              +91 99966 96928 / +91 94683 12343
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-amber-400 shrink-0" />
              info@pctetravels.com / support@pctetravels.com
            </p>
            <p className="flex items-start gap-2 text-indigo-200/70">
              <FiMapPin className="text-amber-400 shrink-0 mt-0.5" />
              PCTE Campus &amp; Ludhiana, Punjab Headquarters, India
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href="https://wa.me/919996696928?text=Hi%20PCTE%20Travels"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
              <FaWhatsapp size={16} />
            </a>
            {[FiInstagram, FiFacebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-800 hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-display text-xs font-extrabold uppercase tracking-wider text-amber-300">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-indigo-200/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-indigo-900/60 pt-6 text-xs text-indigo-300/60 md:flex-row">
        <span>© {new Date().getFullYear()} PCTE Travel Agency. All rights reserved.</span>
        <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
          <FiShield /> Freedom To Evolve · Direct Local Operator Prices · 100% Safe Travel Guarantee
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
