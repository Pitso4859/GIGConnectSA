import React, { useEffect, useState, useCallback } from 'react';
import { jobsApi } from '../../services/api';
import { Job, PageResponse } from '../../types';
import JobCard from '../../components/common/JobCard';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconSearch, IconBriefcase } from '../../components/icons/Icons';

const CATEGORIES = ['All','Trades','Home & Garden','Automotive','Technology','Food','Logistics','Education','Creative','Security'];
const STATUSES = ['All','OPEN','IN_PROGRESS','COMPLETED'];

export default function JobsPage() {
  const [data, setData] = useState<PageResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({ search: search || undefined, category: category || undefined, status: status || undefined, page, size: 12 });
      setData(res.data.data);
    } finally { setLoading(false); }
  }, [search, category, status, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  return (
    <div className="space-y-6">
      <PageHeader title="Job Board" subtitle="Find the right opportunity or post a new gig"/>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <IconSearch size={16} className="absolute left-3.5 top-3.5 text-slate-400"/>
          <input placeholder="Search jobs..." className="input pl-9"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}/>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => { setCategory(c === 'All' ? '' : c); setPage(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${(c === 'All' && !category) || category === c ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s}
              onClick={() => { setStatus(s === 'All' ? '' : s); setPage(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${(s === 'All' && !status) || status === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading
        ? <Spinner className="h-48"/>
        : data && data.content.length > 0
          ? <>
              <p className="text-sm text-slate-500">{data.totalElements} jobs found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.content.map(j => <JobCard key={j.id} job={j}/>)}
              </div>
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  <button disabled={page === 0} onClick={() => setPage(p => p-1)} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Previous</button>
                  <span className="px-4 py-2 text-sm text-slate-500">{page+1} / {data.totalPages}</span>
                  <button disabled={data.last} onClick={() => setPage(p => p+1)} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next</button>
                </div>
              )}
            </>
          : <div className="card p-16 text-center">
              <IconBriefcase size={40} className="mx-auto mb-3 text-slate-300"/>
              <p className="text-slate-500 font-medium">No jobs found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
      }
    </div>
  );
}
