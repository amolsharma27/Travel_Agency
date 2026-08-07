import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const dashboardPathFor = (role) => (role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/dashboard');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      const redirectTo = location.state?.from?.pathname || dashboardPathFor(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Log in to your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper transition hover:bg-lagoon-600 disabled:opacity-60"
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
