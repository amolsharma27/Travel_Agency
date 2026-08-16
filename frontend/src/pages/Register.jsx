import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import PcteLogo from '../components/PcteLogo.jsx';

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
        toast.success('Account created with PCTE Travels!');
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
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="flex flex-col items-center text-center mb-6">
        <PcteLogo className="h-16 w-auto mb-3" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#9B1C1C] dark:text-red-400 font-bold">
          PCTE Travel Agency
        </p>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-[#1B1464] dark:text-white">
          Create your account
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-indigo-200/70">
          Freedom To Evolve — Join PCTE Travel Community
        </p>
      </div>

      <div className="flex rounded-lg border border-indigo-900/30 bg-[#1B1464]/5 dark:bg-indigo-950/40 p-1 text-xs font-bold">
        {['customer', 'agency'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            type="button"
            className={`flex-1 rounded-md py-2.5 capitalize transition ${
              role === r ? 'bg-[#9B1C1C] text-white shadow-md' : 'text-slate-700 dark:text-indigo-200 hover:text-[#9B1C1C]'
            }`}
          >
            {r === 'customer' ? 'Traveller' : 'Travel Operator Agency'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Full name</label>
          <input required value={form.name} onChange={update('name')} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="e.g. Priya Sharma" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Email Address</label>
          <input type="email" required value={form.email} onChange={update('email')} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="you@pctetravels.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Phone Number</label>
          <input value={form.phone} onChange={update('phone')} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="+91 99966 96928" />
        </div>

        {role === 'agency' && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Agency Name</label>
              <input required value={form.agencyName} onChange={update('agencyName')} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="PCTE Partner Travels" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Agency Description</label>
              <textarea value={form.agencyDescription} onChange={update('agencyDescription')} rows={2} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="Specializing in weekend tours..." />
            </div>
          </>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700 dark:text-indigo-200">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={update('password')} className="w-full rounded-lg border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-4 py-2.5 text-sm outline-none focus:border-[#9B1C1C]" placeholder="••••••••" />
        </div>

        <button disabled={loading} className="w-full rounded-lg bg-[#9B1C1C] py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#1B1464] disabled:opacity-60 uppercase tracking-wider">
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        {role === 'agency' && (
          <p className="text-center text-xs text-slate-500 dark:text-indigo-200/70">
            Agency accounts require admin approval before you can publish listings.
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-xs text-slate-600 dark:text-indigo-200/70">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#9B1C1C] dark:text-red-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
