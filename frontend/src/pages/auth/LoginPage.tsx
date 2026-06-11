import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api';
import { IconSparkles } from '../../components/icons/Icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { code?: string; response?: { status?: number; data?: { message?: string } } };

      // Network / timeout — backend is likely cold-starting on Render free tier
      if (!axiosErr.response || axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ERR_NETWORK') {
        setError('The server is waking up — this takes up to 60 seconds on first request. Please try again in a moment.');
      } else if (axiosErr.response.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (axiosErr.response.status === 404) {
        setError('API endpoint not found. If this persists, the backend may need to be redeployed.');
      } else {
        setError(axiosErr.response?.data?.message ?? 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-4 overflow-hidden">
            <img src="/logo.svg" alt="GIGConnect SA" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-3xl font-bold text-white">GIGConnect SA</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            No account?{' '}
            <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600">
              Create one free
            </Link>
          </p>
        </div>

        <div className="mt-4 card p-4 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <IconSparkles size={14} /> Powered by Gemini AI — SA's informal worker marketplace
          </p>
        </div>
      </div>
    </div>
  );
}
