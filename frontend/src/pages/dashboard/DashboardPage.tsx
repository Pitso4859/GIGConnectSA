import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { jobsApi, walletApi } from '../../services/api';
import { Job, WalletData } from '../../types';
import JobCard from '../../components/common/JobCard';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconBriefcase, IconRandSign, IconSparkles, IconArrowRight, IconShield } from '../../components/icons/Icons';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsApi.getAll({ size: 4, status: user?.role === 'WORKER' ? 'OPEN' : undefined }),
      walletApi.get()
    ]).then(([jRes, wRes]) => {
      setJobs(jRes.data.data.content ?? []);
      setWallet(wRes.data.data);
    }).finally(() => setLoading(false));
  }, [user?.role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  if (loading) return <Spinner className="h-64"/>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${firstName}!`}
        subtitle={user?.role === 'WORKER' ? 'Find your next opportunity' : 'Manage your job postings'}
        action={
          user?.role === 'CLIENT'
            ? <button onClick={() => navigate('/post-job')} className="btn-primary">Post a Job</button>
            : <button onClick={() => navigate('/jobs')} className="btn-primary">Browse Jobs</button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><IconRandSign className="text-emerald-600" size={18}/></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Wallet Balance</p>
              <p className="text-xl font-bold text-slate-900">R{Number(wallet?.balance ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><IconBriefcase className="text-brand-500" size={18}/></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Jobs Completed</p>
              <p className="text-xl font-bold text-slate-900">{user?.totalJobsCompleted ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><IconShield className="text-amber-500" size={18}/></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Rating</p>
              <p className="text-xl font-bold text-slate-900">{user?.averageRating ? `${user.averageRating} ★` : 'No ratings'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI promo */}
      <div className="card p-5 bg-gradient-to-r from-brand-500 to-brand-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <IconSparkles size={24}/>
            </div>
            <div>
              <p className="font-semibold text-base">GigAssist AI</p>
              <p className="text-brand-100 text-sm">Career tips, job writing help & SA labour advice</p>
            </div>
          </div>
          <button onClick={() => navigate('/ai')} className="flex items-center gap-1.5 bg-white text-brand-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors shrink-0">
            Chat now <IconArrowRight size={14}/>
          </button>
        </div>
      </div>

      {/* Recent jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {user?.role === 'WORKER' ? 'Open Jobs Near You' : 'Recent Postings'}
          </h2>
          <button onClick={() => navigate('/jobs')} className="text-sm text-brand-500 font-medium hover:text-brand-600 flex items-center gap-1">
            View all <IconArrowRight size={14}/>
          </button>
        </div>
        {jobs.length === 0
          ? <div className="card p-10 text-center text-slate-400"><IconBriefcase size={32} className="mx-auto mb-2 opacity-40"/><p>No jobs found</p></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{jobs.map(j => <JobCard key={j.id} job={j}/>)}</div>
        }
      </div>
    </div>
  );
}
