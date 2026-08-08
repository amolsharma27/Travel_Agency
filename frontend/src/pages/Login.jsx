import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUserCheck, FiCompass, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

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
      toast.success(`Welcome back, ${user?.name ? user.name.split(' ')[0] : 'Traveler'}!`);
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
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Log in to your account</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Access your past trips, visited spots, and bookings</p>

      {/* 1-Click Quick Demo Logins */}
      <div className="mt-6 rounded-xl border border-lagoon-500/20 bg-lagoon-50/50 p-4 dark:bg-lagoon-900/10">
        <p className="text-xs font-semibold uppercase tracking-wider text-lagoon-700 dark:text-lagoon-300">
          ⚡ 1-Click Instant Demo Login
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLoginWithCreds('customer@travelstay.com', 'Customer@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-lagoon-500/30 bg-white dark:bg-ink p-2 text-xs font-medium text-ink dark:text-paper shadow-sm transition hover:border-lagoon-500 hover:bg-lagoon-500 hover:text-white"
          >
            <FiUserCheck className="text-sm text-lagoon-600 dark:text-lagoon-400" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('agency@travelstay.com', 'Agency@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-lagoon-500/30 bg-white dark:bg-ink p-2 text-xs font-medium text-ink dark:text-paper shadow-sm transition hover:border-lagoon-500 hover:bg-lagoon-500 hover:text-white"
          >
            <FiCompass className="text-sm text-lagoon-600 dark:text-lagoon-400" />
            <span>Agency</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoginWithCreds('admin@travelstay.com', 'Admin@123')}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-lagoon-500/30 bg-white dark:bg-ink p-2 text-xs font-medium text-ink dark:text-paper shadow-sm transition hover:border-lagoon-500 hover:bg-lagoon-500 hover:text-white"
          >
            <FiShield className="text-sm text-lagoon-600 dark:text-lagoon-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10 dark:bg-paper/10" />
        <span className="text-xs uppercase text-ink/40 dark:text-paper/40">or with email</span>
        <div className="h-px flex-1 bg-ink/10 dark:bg-paper/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-lagoon-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500"
            placeholder="••••••••"
          />
        </div>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper shadow-md transition hover:bg-lagoon-600 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        New here?{' '}
        <Link to="/register" className="font-medium text-lagoon-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;

