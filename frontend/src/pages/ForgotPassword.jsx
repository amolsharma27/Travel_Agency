import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Step {step} of 3</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Reset your password</h1>

      {step === 1 && (
        <form onSubmit={requestOtp} className="mt-8 space-y-4">
          <p className="text-sm text-ink/60 dark:text-paper/60">Enter your email and we'll send you a one-time code.</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500"
          />
          <button disabled={loading} className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 disabled:opacity-60">
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verify} className="mt-8 space-y-4">
          <p className="text-sm text-ink/60 dark:text-paper/60">Enter the 6-digit code sent to {email}.</p>
          <input
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-center font-mono text-lg tracking-[0.5em] outline-none focus:border-lagoon-500"
          />
          <button disabled={loading} className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 disabled:opacity-60">
            {loading ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={reset} className="mt-8 space-y-4">
          <p className="text-sm text-ink/60 dark:text-paper/60">Choose a new password.</p>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-lagoon-500"
          />
          <button disabled={loading} className="w-full rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 disabled:opacity-60">
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-lagoon-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
