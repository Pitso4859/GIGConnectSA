import React, { useEffect, useState } from 'react';
import { jobsApi } from '../../services/api';
import { Job } from '../../types';
import JobCard from '../../components/common/JobCard';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconBriefcase } from '../../components/icons/Icons';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getMy().then(r => setJobs(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="h-64"/>;

  return (
    <div className="space-y-6">
      <PageHeader title="My Jobs" subtitle={`${jobs.length} total`}/>
      {jobs.length === 0
        ? <div className="card p-16 text-center"><IconBriefcase size={40} className="mx-auto mb-3 text-slate-300"/><p className="text-slate-500">No jobs yet</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{jobs.map(j => <JobCard key={j.id} job={j}/>)}</div>
      }
    </div>
  );
}
