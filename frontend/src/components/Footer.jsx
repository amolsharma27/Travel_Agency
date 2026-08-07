import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/hotels', label: 'Hotels' },
      { to: '/packages', label: 'Tour Packages' },
      { to: '/packages?category=Beach', label: 'Beach Escapes' },
      { to: '/packages?category=Adventure', label: 'Adventure Trips' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/register', label: 'List your property' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

const Footer = () => (
  <footer className="mt-24 bg-ink text-paper/80">
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-500 text-paper text-sm">TS</span>
            Travel&amp;Stay
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            Curated tour packages and hotel stays, booked in minutes. Built for travellers who want
            it done right the first time.
          </p>
          <div className="mt-5 flex gap-3">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 hover:border-lagoon-500 hover:text-lagoon-500"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-paper">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-paper/60 hover:text-lagoon-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50 md:flex-row">
        <span>© {new Date().getFullYear()} Travel &amp; Stay. All rights reserved.</span>
        <span>Made for travellers, by travellers.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
