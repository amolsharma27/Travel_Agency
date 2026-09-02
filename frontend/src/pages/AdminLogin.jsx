import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiShield, FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft,
  FiCheckCircle, FiServer, FiKey
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import pcteLogo from '../assets/pcte-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in as admin, redirect to admin overview
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/overview', { replace: true });
    }
  }, [user, navigate]);

  const handleAdminSignIn = async (adminEmail, adminPwd) => {
    setSubmitting(true);
    try {
      const loggedUser = await login(adminEmail, adminPwd);
      if (loggedUser.role === 'admin') {
        toast.success(`Welcome to Admin Command Studio, ${loggedUser.name}!`);
        const dest = location.state?.from?.pathname || '/admin/overview';
        navigate(dest, { replace: true });
      } else {
        toast.error('Account does not possess Administrator privileges.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid administrator credentials.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both admin email and password.');
      return;
    }
    handleAdminSignIn(email, password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#070D18] px-4 py-12 text-slate-100 font-sans overflow-hidden">
      
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#E11D48]/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#0F2942]/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        
        {/* Top Floating Badge */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <FiArrowLeft /> Back to Public Website
          </Link>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 text-[10px] font-mono font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SECURE CONSOLE</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F1D30]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0F2942] to-[#1E1B4B] border border-white/10 shadow-lg shadow-red-950/30">
              <img src={pcteLogo} alt="PCTE Logo" className="h-10 w-auto" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-950/40 border border-red-800/50 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-red-400 mb-2">
              <FiShield size={12} /> Management Portal
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight text-white">
              Admin Command Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              PCTE Travel Agency Operations &amp; Governance
            </p>
          </div>

          {/* 1-Click Instant Master Admin Sign-In */}
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                ⚡ 1-Click Master Admin Login
              </span>
              <span className="text-[9px] font-mono text-amber-400/80">DEMO ACCESS</span>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAdminSignIn('admin@pctetravels.com', 'Admin@123')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] hover:from-red-600 hover:to-red-800 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <FiKey size={14} />
              <span>Instant Sign In as Super Admin</span>
            </button>
            <div className="mt-2 text-[10px] text-center text-slate-400">
              Credentials: <code className="text-amber-200">admin@pctetravels.com</code> / <code className="text-amber-200">Admin@123</code>
            </div>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative bg-[#0F1D30] px-3 text-[10px] uppercase font-bold text-slate-500">or sign in manually</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pctetravels.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Master Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#1B1464] border border-slate-700 py-3 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50 mt-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Admin Console'}
            </button>
          </form>

        </div>

        {/* Bottom Security Info */}
        <div className="mt-6 text-center text-[11px] text-slate-500 space-y-1">
          <p>Protected by PCTE Security Protocol · 256-Bit SSL Encrypted</p>
          <p>Ludhiana Campus Operations Center</p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
