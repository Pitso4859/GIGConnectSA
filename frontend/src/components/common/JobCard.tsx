import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import { JOB_STATUS_STYLES, IconMapPin, IconClock, IconRandSign } from '../icons/Icons';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface Props { job: Job; }
export default function JobCard({ job }: Props) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/jobs/${job.id}`)}
             className="card p-5 cursor-pointer hover:shadow-card-hover transition-shadow group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{job.category}</span>
                    <h3 className="text-base font-semibold text-slate-900 mt-0.5 group-hover:text-brand-600 transition-colors line-clamp-1">{job.title}</h3>
                </div>
                <span className={clsx('badge ml-3 shrink-0', JOB_STATUS_STYLES[job.status])}>
          {job.status.replace('_', ' ')}
        </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><IconMapPin size={12}/>{job.location}</span>
                    <span className="flex items-center gap-1"><IconClock size={12}/>{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
          <IconRandSign size={14}/>R{Number(job.budget).toLocaleString()}
        </span>
            </div>
        </div>
    );
}