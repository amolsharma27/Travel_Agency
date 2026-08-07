import { NavLink, Outlet } from 'react-router-dom';

const DashboardLayout = ({ title, links }) => (
  <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
    <h1 className="mb-8 font-display text-2xl font-semibold md:text-3xl">{title}</h1>
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-lagoon-500 text-paper'
                  : 'text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10'
              }`
            }
          >
            <link.icon size={16} /> {link.label}
          </NavLink>
        ))}
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default DashboardLayout;
