import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { IconBriefcase } from '../../components/icons/Icons';

const CATEGORIES = ['Trades','Home & Garden','Automotive','Technology','Food','Logistics','Education','Creative','Security','Beauty','Fashion','Manufacturing'];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'Trades', location:'', budget:'', requiredSkills:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
      setForm(p => ({...p, [field]: e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await jobsApi.create({ ...form, budget: parseFloat(form.budget) });
      navigate('/jobs/my');
    } catch (err: any) { setError(err.response?.data?.message ?? 'Failed to post job'); }
    finally { setLoading(false); }
  };

  return (
      <div className="max-w-2xl">
        <PageHeader title="Post a Job" subtitle="Describe what you need and connect with a skilled worker"/>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Job Title *</label>
              <input className="input" placeholder="e.g. Fix kitchen sink leak" required value={form.title} onChange={f('title')}/>
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea rows={5} className="input resize-none" required minLength={20}
                        placeholder="Describe the job in detail — what needs to be done, any access requirements, tools needed..."
                        value={form.description} onChange={f('description')}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={f('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Budget (ZAR) *</label>
                <input type="number" min="10" step="10" className="input" placeholder="500"
                       required value={form.budget} onChange={f('budget')}/>
              </div>
            </div>
            <div>
              <label className="label">Location *</label>
              <input className="input" placeholder="e.g. Sandton, Johannesburg" required value={form.location} onChange={f('location')}/>
            </div>
            <div>
              <label className="label">Required Skills <span className="text-slate-400 font-normal">(comma separated)</span></label>
              <input className="input" placeholder="e.g. Plumbing, Soldering" value={form.requiredSkills} onChange={f('requiredSkills')}/>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                <IconBriefcase size={16}/>{loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}