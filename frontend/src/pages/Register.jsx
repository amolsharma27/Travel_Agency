import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', agencyName: '', agencyDescription: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({ ...form, role });
      if (data.token) {
        toast.success('Account created!');
        navigate('/dashboard');
      } else {
        toast.success(data.message);
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Join us</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Create your account</h1>

      <div className="mt-6 flex rounded-lg border border-ink/10 dark:border-paper/20 p-1 text-sm">
        {['customer', 'agency'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            type="button"
            className={`flex-1 rounded-md py-2 font-medium capitalize transition ${
              role === r ? 'bg-lagoon-500 text-paper' : 'text-ink/60 dark:text-paper/60'
            }`}
          >
            {r === 'customer' ? 'Traveller' : 'Travel Agency'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full name</label>
          <input required value={form.name} onChange={update('name')} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input type="email" required value={form.email} onChange={update('email')} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone</label>
          <input value={form.phone} onChange={update('phone')} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
        </div>

        {role === 'agency' && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Agency name</label>
              <input required value={form.agencyName} onChange={update('agencyName')} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Short description</label>
              <textarea value={form.agencyDescription} onChange={update('agencyDescription')} rows={2} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
            </div>
          </>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={update('password')} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500" />
        </div>

        <button disabled={loading} className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper transition hover:bg-lagoon-600 disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        {role === 'agency' && (
          <p className="text-center text-xs text-ink/50 dark:text-paper/50">
            Agency accounts require admin approval before you can publish listings.
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-lagoon-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
