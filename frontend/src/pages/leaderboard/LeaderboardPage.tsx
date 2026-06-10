import React, { useEffect, useState } from 'react';
import { ratingsApi } from '../../services/api';
import { LeaderboardEntry } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconTrophy, IconStar, IconBriefcase } from '../../components/icons/Icons';
import { BADGE_STYLES } from '../../components/icons/Icons';
import clsx from 'clsx';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ratingsApi.getLeaderboard().then(r => setEntries(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="h-64"/>;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-28', 'h-36', 'h-24'];
  const podiumColors  = ['bg-slate-400', 'bg-amber-400', 'bg-orange-400'];

  return (
    <div className="space-y-8">
      <PageHeader title="Leaderboard" subtitle="Top-rated workers across South Africa"/>

      {/* Podium */}
      {top3.length === 3 && (
        <div className="card p-8">
          <div className="flex items-end justify-center gap-4">
            {podiumOrder.map((entry, i) => (
              <div key={entry.userId} className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                {/* Avatar */}
                <div className="relative">
                  {entry.avatarUrl
                    ? <img src={entry.avatarUrl} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" alt=""/>
                    : <div className="w-16 h-16 rounded-full bg-brand-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold">
                        {entry.fullName.charAt(0)}
                      </div>
                  }
                  {i === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <IconTrophy size={20} className="text-amber-400"/>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900 text-center leading-tight">{entry.fullName}</p>
                <span className={clsx('badge text-xs', BADGE_STYLES[entry.badge])}>{entry.badge}</span>
                {/* Podium block */}
                <div className={clsx('w-full rounded-t-xl flex items-center justify-center text-white font-bold text-xl shadow-sm', podiumHeights[i], podiumColors[i])}>
                  {entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : '3rd'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">All Rankings</h2>
          <p className="text-sm text-slate-400">{entries.length} workers ranked</p>
        </div>
        {entries.length === 0
          ? <div className="p-12 text-center text-slate-400"><IconTrophy size={36} className="mx-auto mb-2 opacity-30"/><p>No ratings yet — complete a job to appear here!</p></div>
          : <div className="divide-y divide-slate-50">
              {entries.map(entry => (
                <div key={entry.userId} className={clsx('flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors', entry.rank <= 3 && 'bg-amber-50/40')}>
                  {/* Rank */}
                  <span className={clsx('w-8 text-center font-bold text-sm shrink-0',
                    entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-slate-400' : entry.rank === 3 ? 'text-orange-400' : 'text-slate-300')}>
                    #{entry.rank}
                  </span>
                  {/* Avatar */}
                  {entry.avatarUrl
                    ? <img src={entry.avatarUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt=""/>
                    : <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                        {entry.fullName.charAt(0)}
                      </div>
                  }
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900">{entry.fullName}</p>
                      <span className={clsx('badge text-xs', BADGE_STYLES[entry.badge])}>{entry.badge}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-0.5"><IconStar size={11} className="text-amber-400"/>{entry.averageRating.toFixed(1)} ({entry.totalRatings})</span>
                      <span className="flex items-center gap-0.5"><IconBriefcase size={11}/>{entry.totalJobsCompleted} completed</span>
                    </div>
                  </div>
                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(n => (
                        <div key={n} className={clsx('w-2 h-2 rounded-full', n <= Math.round(entry.averageRating) ? 'bg-amber-400' : 'bg-slate-100')}/>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{entry.averageRating.toFixed(1)} / 5.0</p>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
