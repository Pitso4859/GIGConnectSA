import React from 'react';
import clsx from 'clsx';

export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="w-8 h-8 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"/>
    </div>
  );
}
