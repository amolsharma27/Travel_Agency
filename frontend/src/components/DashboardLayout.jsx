import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiUser, FiShield, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardLayout = ({ title, links }) => {
  const { user } = useAuth();
  const location = useLocation();

  const roleTag = user?.role === 'admin' 
    ? { name: 'Super Admin', color: 'bg-red-50 text-[#E11D48] dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-900', icon: FiShield }
    : user?.role === 'agency'
    ? { name: 'Agency Partner', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900', icon: FiBriefcase }
    : { name: 'Explorer Member', color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900', icon: FiUser };

  const RoleIcon = roleTag.icon;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Dashboard Title & User Quick Identity */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleTag.color}`}>
                <RoleIcon size={12} /> {roleTag.name}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm">
              <div className="h-9 w-9 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{user.name}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          
          {/* Left Navigation Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-3 shadow-sm flex flex-col gap-1 overflow-x-auto">
              <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu Navigation
              </span>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0F2942] text-white shadow-sm border border-slate-700'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <link.icon size={15} className="shrink-0" />
                  <span className="truncate">{link.label}</span>
                </NavLink>
              ))}

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <NavLink
                  to="/"
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#E11D48] hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group"
                >
                  <FiArrowLeft size={15} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Website</span>
                </NavLink>
              </div>
            </div>
          </aside>

          {/* Right Main Content Outlet */}
          <main className="min-w-0">
            <Outlet />
          </main>

        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
