import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navLinks = [
  { to: '/hotels', label: 'Hotels' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const dashboardPathFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'agency') return '/agency';
  return '/dashboard';
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/10 bg-paper/80 dark:bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-500 text-paper text-sm">TS</span>
          Travel<span className="text-lagoon-500">&amp;</span>Stay
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-lagoon-500 ${
                  isActive ? 'text-lagoon-500' : 'text-ink/80 dark:text-paper/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/notifications"
                className="rounded-full p-2 text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10"
                aria-label="Notifications"
              >
                <FiBell size={18} />
              </Link>
              <Link
                to={dashboardPathFor(user.role)}
                className="flex items-center gap-2 rounded-full border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-sm font-medium hover:border-lagoon-500"
              >
                <FiUser size={16} /> {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm font-medium text-ink/60 hover:text-lagoon-500 dark:text-paper/60"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-lagoon-500">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-lagoon-500 px-4 py-2 text-sm font-semibold text-paper shadow-card transition hover:bg-lagoon-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-0 z-50 bg-paper dark:bg-ink md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <FiX size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink/5 dark:border-paper/10 py-3 text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to={dashboardPathFor(user.role)} onClick={() => setOpen(false)} className="py-3 text-lg font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate('/');
                    }}
                    className="py-3 text-left text-lg font-medium text-red-500"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="py-3 text-lg font-medium">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="py-3 text-lg font-medium text-lagoon-500">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
