import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsApi, ratingsApi } from '../../services/api';
import { Job } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/common/Spinner';
import { JOB_STATUS_STYLES, IconMapPin, IconClock, IconRandSign, IconUser, IconCheck, IconX, IconStar } from '../../components/icons/Icons';
import { formatDistanceToNow, format } from 'date-fns';
import clsx from 'clsx';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState({ score: 5, comment: '' });
  const [rated, setRated] = useState(false);

  useEffect(() => {
    jobsApi.getById(id!).then(r => setJob(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="h-64" />;
  if (!job) return <div className="card p-10 text-center text-slate-500">Job not found</div>;

  const isClient = user?.id === job.client?.id;
  const isWorker = user?.id === job.worker?.id;
  const isAdmin  = user?.role === 'ADMIN';

  const act = async (fn: () => Promise<any>, msg = '') => {
    setActionLoading(true); setError('');
    try { const r = await fn(); setJob(r.data.data); if (msg) alert(msg); }
    catch (e: any) { setError(e.response?.data?.message ?? 'Action failed'); }
    finally { setActionLoading(false); }
  };

  const submitRating = async () => {
    try {
      await ratingsApi.submit({ jobId: job.id, score: rating.score, comment: rating.comment });
      setRated(true);
    } catch (e: any) { setError(e.response?.data?.message ?? 'Rating failed'); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
        ← Back to jobs
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{job.category}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{job.title}</h1>
          </div>
          <span className={clsx('badge text-sm px-3 py-1', JOB_STATUS_STYLES[job.status])}>
            {job.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed mb-6">{job.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <IconRandSign size={16}/>, label: 'Budget', value: `R${Number(job.budget).toLocaleString()}` },
            { icon: <IconMapPin size={16}/>,   label: 'Location', value: job.location },
            { icon: <IconClock size={16}/>,    label: 'Posted', value: formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) },
            { icon: <IconUser size={16}/>,     label: 'Client', value: job.client?.fullName ?? '—' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">{icon}<span className="text-xs font-medium">{label}</span></div>
              <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
            </div>
          ))}
        </div>

        {job.requiredSkills && (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.split(',').map(s => (
                <span key={s} className="badge bg-slate-100 text-slate-600">{s.trim()}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Worker info */}
      {job.worker && (
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Assigned Worker</p>
          <div className="flex items-center gap-3">
            {job.worker.avatarUrl
              ? <img src={job.worker.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt=""/>
              : <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                  {job.worker.fullName.charAt(0)}
                </div>
            }
            <div>
              <p className="font-semibold text-slate-900">{job.worker.fullName}</p>
              <p className="text-sm text-slate-400">{job.worker.location ?? '—'}</p>
            </div>
            {job.worker.averageRating && (
              <span className="ml-auto flex items-center gap-1 text-amber-500 font-semibold text-sm">
                <IconStar size={14}/>{job.worker.averageRating}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Proof */}
      {job.proofImageUrl && (
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Completion Proof</p>
          <img src={job.proofImageUrl} alt="Proof" className="w-full max-h-64 object-cover rounded-xl"/>
          {job.proofLocation && <p className="text-sm text-slate-500 mt-2 flex items-center gap-1"><IconMapPin size={13}/>{job.proofLocation}</p>}
        </div>
      )}

      {/* Timeline */}
      {(job.acceptedAt || job.completedAt) && (
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Timeline</p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">Posted: <span className="font-medium text-slate-800">{format(new Date(job.postedAt), 'dd MMM yyyy HH:mm')}</span></p>
            {job.acceptedAt && <p className="text-slate-600">Accepted: <span className="font-medium text-slate-800">{format(new Date(job.acceptedAt), 'dd MMM yyyy HH:mm')}</span></p>}
            {job.completedAt && <p className="text-slate-600">Completed: <span className="font-medium text-slate-800">{format(new Date(job.completedAt), 'dd MMM yyyy HH:mm')}</span></p>}
          </div>
        </div>
      )}

      {/* Actions */}
      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {/* Worker: accept open job */}
        {user?.role === 'WORKER' && job.status === 'OPEN' && !job.worker && (
          <button disabled={actionLoading} onClick={() => act(() => jobsApi.accept(job.id))} className="btn-primary">
            <IconCheck size={16}/>{actionLoading ? 'Accepting...' : 'Accept Job'}
          </button>
        )}

        {/* Worker: submit proof when in progress */}
        {isWorker && job.status === 'IN_PROGRESS' && (
          <button disabled={actionLoading} onClick={() => {
            const url = prompt('Paste proof image URL:') ?? '';
            const loc = prompt('Your current location:') ?? '';
            if (url) act(() => jobsApi.submitProof(job.id, { proofImageUrl: url, proofLocation: loc }), 'Proof submitted!');
          }} className="btn-primary">
            <IconCheck size={16}/>{actionLoading ? 'Submitting...' : 'Submit Proof'}
          </button>
        )}

        {/* Client: approve awaiting */}
        {isClient && job.status === 'AWAITING_APPROVAL' && (
          <button disabled={actionLoading} onClick={() => act(() => jobsApi.approve(job.id), 'Payment released!')} className="btn-primary">
            <IconCheck size={16}/>{actionLoading ? 'Approving...' : 'Approve & Pay Worker'}
          </button>
        )}

        {/* Cancel */}
        {['OPEN','IN_PROGRESS'].includes(job.status) && (isClient || isWorker || isAdmin) && (
          <button disabled={actionLoading} onClick={() => { if (confirm('Cancel this job?')) act(() => jobsApi.cancel(job.id)); }} className="btn-secondary text-red-500 hover:text-red-600 hover:border-red-200">
            <IconX size={16}/>{actionLoading ? 'Cancelling...' : 'Cancel Job'}
          </button>
        )}
      </div>

      {/* Rating panel */}
      {job.status === 'COMPLETED' && (isClient || isWorker) && !rated && (
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-4">Leave a Rating</p>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(r => ({...r, score: n}))}
                className={clsx('text-2xl transition-transform', n <= rating.score ? 'text-amber-400 scale-110' : 'text-slate-200')}>★</button>
            ))}
          </div>
          <textarea rows={3} className="input resize-none mb-3" placeholder="Add a comment (optional)"
            value={rating.comment} onChange={e => setRating(r => ({...r, comment: e.target.value}))}/>
          <button className="btn-primary" onClick={submitRating}><IconStar size={15}/>Submit Rating</button>
        </div>
      )}
      {rated && <div className="card p-5 text-center text-emerald-600 font-medium"><IconCheck size={18} className="mx-auto mb-1"/>Rating submitted — thank you!</div>}
    </div>
  );
}
