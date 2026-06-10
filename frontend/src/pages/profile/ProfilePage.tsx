import React, { useEffect, useState } from 'react';
import { usersApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconEdit, IconUser, IconStar, IconBriefcase, IconMapPin, IconCheck, IconShield } from '../../components/icons/Icons';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName:'', phone:'', location:'', bio:'', avatarUrl:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    usersApi.getMe().then(r => {
      const u = r.data.data;
      setUser(u);
      setForm({ fullName: u.fullName, phone: u.phone ?? '', location: u.location ?? '', bio: u.bio ?? '', avatarUrl: u.avatarUrl ?? '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await usersApi.updateMe(form);
      setUser(data.data);
      updateUser(data.data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({...p, [field]: e.target.value}));

  if (loading) return <Spinner className="h-64"/>;
  if (!user) return null;

  const initials = user.fullName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="My Profile"
        action={
          !editing
            ? <button onClick={() => setEditing(true)} className="btn-secondary"><IconEdit size={15}/>Edit Profile</button>
            : <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary"><IconCheck size={15}/>{saving ? 'Saving…' : 'Save'}</button>
              </div>
        }
      />

      {saved && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2"><IconCheck size={15}/>Profile updated!</div>}

      {/* Avatar + basics */}
      <div className="card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative shrink-0">
          {user.avatarUrl
            ? <img src={user.avatarUrl} className="w-24 h-24 rounded-2xl object-cover" alt="avatar"/>
            : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold">{initials}</div>
          }
          {user.isVerified && (
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
              <IconCheck size={12} className="text-white"/>
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
            <span className="badge bg-brand-100 text-brand-700 w-fit mx-auto sm:mx-0">{user.role}</span>
          </div>
          {user.location && <p className="text-sm text-slate-500 flex items-center gap-1 justify-center sm:justify-start mb-3"><IconMapPin size={13}/>{user.location}</p>}
          {user.bio && <p className="text-sm text-slate-600 leading-relaxed">{user.bio}</p>}
          <div className="flex gap-4 mt-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{user.averageRating ? user.averageRating.toFixed(1) : '—'}</p>
              <p className="text-xs text-slate-400 flex items-center gap-0.5"><IconStar size={11} className="text-amber-400"/>Rating</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{user.totalJobsCompleted ?? 0}</p>
              <p className="text-xs text-slate-400 flex items-center gap-0.5"><IconBriefcase size={11}/>Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{format(new Date(user.createdAt), 'MMM yyyy')}</p>
              <p className="text-xs text-slate-400">Member since</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">Edit Information</h3>
          <div><label className="label">Full Name</label>
            <input className="input" value={form.fullName} onChange={f('fullName')}/></div>
          <div><label className="label">Phone</label>
            <input className="input" placeholder="071 000 0000" value={form.phone} onChange={f('phone')}/></div>
          <div><label className="label">Location</label>
            <input className="input" placeholder="City, Province" value={form.location} onChange={f('location')}/></div>
          <div><label className="label">Bio</label>
            <textarea rows={4} className="input resize-none" placeholder="Tell clients about your skills and experience…" value={form.bio} onChange={f('bio')}/></div>
          <div><label className="label">Avatar URL</label>
            <input className="input" placeholder="https://..." value={form.avatarUrl} onChange={f('avatarUrl')}/></div>
        </div>
      )}

      {/* Account details */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Account Details</h3>
        <div className="space-y-3">
          {[
            { icon: <IconUser size={15}/>, label: 'Email', value: user.email },
            { icon: <IconShield size={15}/>, label: 'Account Status', value: user.isVerified ? 'Verified' : 'Not verified' },
            { icon: <IconBriefcase size={15}/>, label: 'Role', value: user.role },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <span className="text-slate-400">{icon}</span>
              <span className="text-sm text-slate-500 w-32">{label}</span>
              <span className="text-sm font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
