import React, { useState } from 'react';
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
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">GIGConnect SA</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}/>
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}/>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            No account? <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600">Create one free</Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 card p-4 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <IconSparkles size={14}/> Powered by Gemini AI — SA's informal worker marketplace
          </p>
        </div>
      </div>
    </div>
  );
}
