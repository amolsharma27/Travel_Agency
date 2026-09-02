import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiShield, FiAlertTriangle, FiArrowLeft, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * Strict Route Guard for Admin Portal
 * Only allows users with role === 'admin'.
 * Unauthenticated users are redirected to /admin/login.
 * Authenticated non-admin users see an Access Denied barrier.
 */
export const AdminRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1727] text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Verifying Admin Security Clearance...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Admin Login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in, but not an admin -> Access Denied screen
  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1727] p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0F2942] p-8 text-center shadow-2xl space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-[#E11D48]">
            <FiLock size={32} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
              Restricted Area · 403 Forbidden
            </span>
            <h1 className="mt-1 font-display text-2xl font-black text-white">
              Admin Access Required
            </h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              You are signed in as <b className="text-white">{user.email}</b> (<span className="capitalize text-amber-300">{user.role}</span>). This command console is strictly reserved for PCTE Travel Agency Administrators.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-white transition"
            >
              <FiArrowLeft /> Return to Main Website
            </Link>
            <button
              onClick={() => {
                logout();
                window.location.href = '/admin/login';
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#E11D48] hover:bg-red-700 py-2.5 text-xs font-bold text-white transition shadow-lg"
            >
              <FiShield /> Switch to Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
