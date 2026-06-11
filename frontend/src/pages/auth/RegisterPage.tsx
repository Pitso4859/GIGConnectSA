import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api';

const ROLES = [
  { value: 'WORKER', label: 'Worker', desc: 'Find jobs and earn income' },
  { value: 'CLIENT', label: 'Client', desc: 'Post jobs and hire workers' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'WORKER', phone: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({...p, [field]: e.target.value}));

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-4 overflow-hidden">
              <img src="/logo.svg" alt="GIGConnect SA" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-1">Join GIGConnect SA today</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role picker */}
              <div>
                <label className="label">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                      <button key={r.value} type="button"
                              onClick={() => setForm(p => ({...p, role: r.value}))}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <p className={`text-sm font-semibold ${form.role === r.value ? 'text-brand-600' : 'text-slate-700'}`}>{r.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                      </button>
                  ))}
                </div>
              </div>

              <div><label className="label">Full name</label>
                <input type="text" className="input" placeholder="Thabo Nkosi" required
                       value={form.fullName} onChange={f('fullName')}/></div>

              <div><label className="label">Email</label>
                <input type="email" className="input" placeholder="thabo@email.co.za" required
                       value={form.email} onChange={f('email')}/></div>

              <div><label className="label">Password</label>
                <input type="password" className="input" placeholder="Min 8 characters" required minLength={8}
                       value={form.password} onChange={f('password')}/></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Phone</label>
                  <input type="tel" className="input" placeholder="071 000 0000"
                         value={form.phone} onChange={f('phone')}/></div>
                <div><label className="label">Location</label>
                  <input type="text" className="input" placeholder="Johannesburg"
                         value={form.location} onChange={f('location')}/></div>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>}
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              Have an account? <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
  );
}