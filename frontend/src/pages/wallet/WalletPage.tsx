import React, { useEffect, useState } from 'react';
import { walletApi } from '../../services/api';
import { WalletData } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { IconRandSign, IconArrowRight } from '../../components/icons/Icons';
import { format } from 'date-fns';
import clsx from 'clsx';

const TX_STYLES: Record<string,string> = {
  CREDIT:  'text-emerald-600 bg-emerald-50',
  DEBIT:   'text-red-500 bg-red-50',
  ESCROW:  'text-amber-600 bg-amber-50',
  RELEASE: 'text-blue-600 bg-blue-50',
  REFUND:  'text-purple-600 bg-purple-50',
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    walletApi.get().then(r => setWallet(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="h-64"/>;
  if (!wallet) return <div className="card p-10 text-center text-slate-500">Wallet not found</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Wallet" subtitle="Your GIGConnect balance and transactions"/>

      {/* Balance card */}
      <div className="card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <p className="text-sm text-slate-400 mb-1">Available Balance</p>
        <div className="flex items-end gap-2 mb-6">
          <span className="text-5xl font-bold">R{Number(wallet.balance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Total In</p>
            <p className="font-semibold text-emerald-400">
              R{wallet.transactions.filter(t => t.type === 'CREDIT' || t.type === 'RELEASE')
                .reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Total Out</p>
            <p className="font-semibold text-red-400">
              R{wallet.transactions.filter(t => t.type === 'DEBIT')
                .reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Transactions</p>
            <p className="font-semibold text-white">{wallet.transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Transaction History</h2>
        </div>
        {wallet.transactions.length === 0
          ? <div className="p-12 text-center text-slate-400"><IconRandSign size={32} className="mx-auto mb-2 opacity-30"/><p>No transactions yet</p></div>
          : <div className="divide-y divide-slate-50">
              {wallet.transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', TX_STYLES[tx.type] ?? 'bg-slate-100 text-slate-500')}>
                    {tx.type === 'CREDIT' || tx.type === 'RELEASE' ? '+' : tx.type === 'DEBIT' ? '−' : '~'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400">{format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm')}</p>
                  </div>
                  <span className={clsx('text-sm font-bold shrink-0',
                    tx.type === 'CREDIT' || tx.type === 'RELEASE' ? 'text-emerald-600' : 'text-red-500')}>
                    {tx.type === 'CREDIT' || tx.type === 'RELEASE' ? '+' : '−'}R{Number(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
        }
      </div>

      <div className="card p-4 bg-amber-50 border-amber-100">
        <p className="text-xs text-amber-700 text-center">
          Payments are held securely and released automatically on job approval.
          New accounts receive a R100 starter balance.
        </p>
      </div>
    </div>
  );
}
