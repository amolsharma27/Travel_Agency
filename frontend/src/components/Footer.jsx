import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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
      { to: '/about', label: 'About TravelStay' },
      { to: '/contact', label: 'Contact Us & Hotline' },
      { to: '/dashboard/payments', label: 'Pay Online' },
      { to: '/faq', label: 'FAQs & Gear Advice' },
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-black text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white font-black">
              TS
            </div>
            <span>Travel<span className="text-amber-500">Stay</span></span>
          </Link>
          
          <p className="text-xs leading-relaxed text-slate-400 max-w-xs">
            Trusted travel operator with 5+ years of experience offering Every Friday weekend departures, Himalayan treks, educational group journeys, and luxury stays across India.
          </p>

          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <p className="flex items-center gap-2">
              <FiPhone className="text-amber-400 shrink-0" />
              +91 99966 96928 / +91 94683 12343
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-amber-400 shrink-0" />
              info@travelstay.com / support@travelstay.com
            </p>
            <p className="flex items-start gap-2 text-slate-400">
              <FiMapPin className="text-amber-400 shrink-0 mt-0.5" />
              Ludhiana, Punjab &amp; New Delhi Headquarters, India
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href="https://wa.me/919996696928?text=Hi%20TravelStay"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-display text-xs font-extrabold uppercase tracking-wider text-amber-400">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row">
        <span>© {new Date().getFullYear()} TravelStay Platform. All rights reserved.</span>
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <FiShield /> Direct Local Operator Prices · 100% Safe Travel Guarantee
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
