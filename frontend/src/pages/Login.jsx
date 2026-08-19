import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUserCheck, FiCompass, FiShield, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import pcteLogo from '../assets/pcte-logo.png';

const dashboardPathFor = (role) => (role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/dashboard');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectParam = searchParams.get('redirect');

  const handleLoginWithCreds = async (eMail, pwd) => {
    setLoading(true);
    try {
      const user = await login(eMail, pwd);
      toast.success(`Welcome back to PCTE Travel Agency, ${user?.name ? user.name.split(' ')[0] : 'Traveler'}!`);
      const redirectTo = redirectParam || location.state?.from?.pathname || dashboardPathFor(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginWithCreds(email, password);
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="flex flex-col items-center text-center mb-6">
        <img src={pcteLogo} alt="PCTE Logo" className="h-16 w-auto mb-3 bg-white rounded-xl p-1.5 shadow" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#E11D48] font-black">
          PCTE Travel Agency
        </p>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign In to Your Account
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Freedom To Evolve — Access bookings, tickets &amp; passport files
        </p>
      </div>

      {redirectParam && (
        <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium text-center">
          🔒 Sign in required to proceed with your booking / request.
        </div>
      )}

      {/* 1-Click Instant Demo Logins */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center mb-2.5">
          ⚡ 1-Click Instant Demo Login
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLoginWithCreds('amolsharma2705@gmail.com', 'Customer@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] p-2.5 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#0F2942] hover:bg-[#0F2942] hover:text-white"
          >
            <FiUserCheck className="text-base text-[#E11D48]" />
            <span className="text-[11px]">Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('agency@pctetravels.com', 'Agency@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] p-2.5 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#0F2942] hover:bg-[#0F2942] hover:text-white"
          >
            <FiCompass className="text-base text-amber-500" />
            <span className="text-[11px]">Agency</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('admin@pctetravels.com', 'Admin@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] p-2.5 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#0F2942] hover:bg-[#0F2942] hover:text-white"
          >
            <FiShield className="text-base text-emerald-500" />
            <span className="text-[11px]">Admin</span>
          </button>
        </div>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-[10px] uppercase text-slate-400 font-bold">or sign in with email</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] pl-3 pr-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              placeholder="amolsharma2705@gmail.com"
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs font-bold text-[#E11D48] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] pl-3 pr-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-[#0F2942] hover:bg-[#E11D48] py-3 text-xs font-black text-white shadow-md transition disabled:opacity-60 uppercase tracking-wider"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
        New to PCTE Travels?{' '}
        <Link to="/register" className="font-bold text-[#E11D48] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
