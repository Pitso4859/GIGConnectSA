import React from 'react';

interface IconProps { className?: string; size?: number; }
const svg = (paths: React.ReactNode, vb = '0 0 24 24') =>
  ({ className, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox={vb} fill="none" stroke="currentColor"
         strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths}
    </svg>
  );

export const IconHome        = svg(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>);
export const IconBriefcase   = svg(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></>);
export const IconTrophy      = svg(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></>);
export const IconWallet      = svg(<><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>);
export const IconUser        = svg(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>);
export const IconPlus        = svg(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>);
export const IconSearch      = svg(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>);
export const IconMapPin      = svg(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>);
export const IconStar        = svg(<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>);
export const IconCheck       = svg(<><polyline points="20 6 9 17 4 12"/></>);
export const IconX           = svg(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>);
export const IconLogOut      = svg(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>);
export const IconSparkles    = svg(<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>);
export const IconSend        = svg(<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>);
export const IconArrowRight  = svg(<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>);
export const IconShield      = svg(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>);
export const IconRefreshCw   = svg(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></>);
export const IconChevronDown = svg(<polyline points="6 9 12 15 18 9"/>);
export const IconMenu        = svg(<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>);
export const IconEdit        = svg(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>);
export const IconLoader      = svg(<><path d="M21 12a9 9 0 1 1-6.219-8.56"/></>);
export const IconClock       = svg(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>);
export const IconRandSign    = svg(<><path d="M2 8h8l4 8h8"/><path d="M6 4l4 4-4 4"/><path d="M12 12h4a2 2 0 0 1 0 4h-4"/></>);

// Status badge colours
export const JOB_STATUS_STYLES: Record<string, string> = {
  OPEN:              'bg-emerald-100 text-emerald-700',
  IN_PROGRESS:       'bg-blue-100 text-blue-700',
  AWAITING_APPROVAL: 'bg-amber-100 text-amber-700',
  COMPLETED:         'bg-slate-100 text-slate-600',
  CANCELLED:         'bg-red-100 text-red-600',
  DISPUTED:          'bg-purple-100 text-purple-700',
};

export const BADGE_STYLES: Record<string, string> = {
  ELITE:    'bg-gradient-to-r from-purple-600 to-pink-500 text-white',
  GOLD:     'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  SILVER:   'bg-gradient-to-r from-slate-400 to-slate-500 text-white',
  BRONZE:   'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
  NEWCOMER: 'bg-slate-100 text-slate-500',
};
