import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/api';
import { IconHome, IconBriefcase, IconTrophy, IconWallet, IconUser, IconPlus, IconSparkles, IconLogOut, IconMenu, IconX } from '../icons/Icons';
import clsx from 'clsx';

const NAV = [
  { to: '/dashboard',   label: 'Home',        Icon: IconHome,      roles: ['WORKER','CLIENT','ADMIN'] },
  { to: '/jobs',        label: 'Jobs',         Icon: IconBriefcase, roles: ['WORKER','CLIENT','ADMIN'] },
  { to: '/post-job',    label: 'Post Job',     Icon: IconPlus,      roles: ['CLIENT','ADMIN'] },
  { to: '/leaderboard', label: 'Leaderboard',  Icon: IconTrophy,    roles: ['WORKER','CLIENT','ADMIN'] },
  { to: '/wallet',      label: 'Wallet',       Icon: IconWallet,    roles: ['WORKER','CLIENT','ADMIN'] },
  { to: '/ai',          label: 'GigAssist AI', Icon: IconSparkles,  roles: ['WORKER','CLIENT','ADMIN'] },
  { to: '/profile',     label: 'Profile',      Icon: IconUser,      roles: ['WORKER','CLIENT','ADMIN'] },
];

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    navigate('/login');
  };

  const filtered = NAV.filter(n => user && n.roles.includes(user.role));
  const initials = user?.fullName?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() ?? '?';

  const NavItems = () => (
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filtered.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                     className={({ isActive }) => clsx(
                         'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                         isActive
                             ? 'bg-brand-50 text-brand-600 shadow-sm'
                             : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                     )}>
              <Icon size={18} />
              {label}
            </NavLink>
        ))}
      </nav>
  );

  return (
      <>
        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-card border border-slate-100 lg:hidden">
          {mobileOpen ? <IconX size={20}/> : <IconMenu size={20}/>}
        </button>

        {/* Backdrop */}
        {mobileOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)}/>}

        {/* Sidebar */}
        <aside className={clsx(
            'fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col z-40 transition-transform duration-300',
            'lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {/* Logo */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">GIGConnect</p>
                <p className="text-xs text-slate-400">South Africa</p>
              </div>
            </div>
          </div>

          <NavItems />

          {/* User footer */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 mb-3 px-1">
              {user?.avatarUrl
                  ? <img src={user.avatarUrl} className="w-9 h-9 rounded-full object-cover" alt="avatar"/>
                  : <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
              }
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <IconLogOut size={16}/> Sign out
            </button>
          </div>
        </aside>
      </>
  );
}