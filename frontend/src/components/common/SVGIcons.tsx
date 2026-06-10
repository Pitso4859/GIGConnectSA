import React from 'react'

interface IconProps { className?: string; size?: number }
const icon = (path: string) => ({ className = 'w-5 h-5', size }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path.split('|').map((d, i) => <path key={i} d={d} />)}
  </svg>
)

export const HomeIcon = icon('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10')
export const BriefcaseIcon = icon('M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z|M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2')
export const WalletIcon = icon('M21 12V7H5a2 2 0 0 1 0-4h14v4|M3 5v14a2 2 0 0 0 2 2h16v-5|M18 12a2 2 0 0 0 0 4h4v-4z')
export const UserIcon = icon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z')
export const TrophyIcon = icon('M6 9H4.5a2.5 2.5 0 0 1 0-5H6|M18 9h1.5a2.5 2.5 0 0 0 0-5H18|M4 22h16|M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22|M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22|M18 2H6v7a6 6 0 0 0 12 0V2z')
export const SearchIcon = icon('M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z|M21 21l-4.35-4.35')
export const PlusIcon = icon('M12 5v14|M5 12h14')
export const CheckIcon = icon('M20 6L9 17l-5-5')
export const XIcon = icon('M18 6L6 18|M6 6l12 12')
export const ChevronRightIcon = icon('M9 18l6-6-6-6')
export const ChevronDownIcon = icon('M6 9l6 6 6-6')
export const StarIcon = ({ filled = false, className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
export const MapPinIcon = icon('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z')
export const ClockIcon = icon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2')
export const ArrowUpRightIcon = icon('M7 17L17 7|M7 7h10v10')
export const ArrowDownLeftIcon = icon('M17 7L7 17|M17 17H7V7')
export const BotIcon = icon('M12 8V4H8|M16 8V4h-4|M8.5 9.5A1.5 1.5 0 1 0 8.5 12a1.5 1.5 0 0 0 0-2.5M15.5 9.5A1.5 1.5 0 1 0 15.5 12a1.5 1.5 0 0 0 0-2.5|M3 17.4V17c0-4.4 3.6-8 8-8h2c4.4 0 8 3.6 8 8v.4|M7.5 17v2.5|M16.5 17v2.5')
export const SendIcon = icon('M22 2L11 13|M22 2l-7 20-4-9-9-4z')
export const LogOutIcon = icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9')
export const ShieldIcon = icon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')
export const RefreshIcon = icon('M1 4v6h6|M23 20v-6h-6|M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15')
export const CameraIcon = icon('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z|M12 13a4 4 0 1 0 0-6 4 4 0 0 0 0 6z')
export const AlertCircleIcon = icon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 8v4|M12 16h.01')
