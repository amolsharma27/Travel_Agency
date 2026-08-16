import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUserCheck, FiCompass, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import PcteLogo from '../components/PcteLogo.jsx';

const dashboardPathFor = (role) => (role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/dashboard');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginWithCreds = async (eMail, pwd) => {
    setLoading(true);
    try {
      const user = await login(eMail, pwd);
      toast.success(`Welcome back to PCTE Travels, ${user?.name ? user.name.split(' ')[0] : 'Traveler'}!`);
      const redirectTo = location.state?.from?.pathname || dashboardPathFor(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
        <PcteLogo className="h-16 w-auto mb-3" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-bold">
          PCTE Travel Agency
        </p>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-[#1B1464] dark:text-white">
          Log in to your account
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-indigo-200/70">
          Freedom To Evolve — Access past trips &amp; bookings
        </p>
      </div>

      {/* 1-Click Quick Demo Logins */}
      <div className="rounded-xl border border-indigo-900/30 bg-[#1B1464]/5 dark:bg-indigo-950/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1B1464] dark:text-amber-300">
          ⚡ 1-Click Instant Demo Login
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLoginWithCreds('customer@pctetravels.com', 'Customer@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-[#110D44] p-2 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#9B1C1C] hover:bg-[#9B1C1C] hover:text-white"
          >
            <FiUserCheck className="text-sm text-[#9B1C1C] dark:text-amber-400" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('info@pctetravels.com', 'Agency@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-[#110D44] p-2 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#9B1C1C] hover:bg-[#9B1C1C] hover:text-white"
          >
            <FiCompass className="text-sm text-[#9B1C1C] dark:text-amber-400" />
            <span>Agency</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('admin@pctetravels.com', 'Admin@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-[#110D44] p-2 text-xs font-bold text-slate-800 dark:text-white shadow-sm transition hover:border-[#9B1C1C] hover:bg-[#9B1C1C] hover:text-white"
          >
            <FiShield className="text-sm text-[#9B1C1C] dark:text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-indigo-900/40" />
        <span className="text-xs uppercase text-slate-400 font-bold">or with email</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-indigo-900/40" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]"
            placeholder="you@pctetravels.com"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Password</label>
            <Link to="/forgot-password" className="text-xs font-bold text-[#9B1C1C] dark:text-red-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]"
            placeholder="••••••••"
          />
        </div>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-[#9B1C1C] py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#1B1464] disabled:opacity-60 uppercase tracking-wider"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600 dark:text-indigo-200/70">
        New to PCTE Travels?{' '}
        <Link to="/register" className="font-bold text-[#9B1C1C] dark:text-red-400 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;

