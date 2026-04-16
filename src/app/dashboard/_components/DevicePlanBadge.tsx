'use client';

import React from 'react';

interface DevicePlanBadgeProps {
  plan: string | undefined;
  className?: string;
}

export function DevicePlanBadge({ plan, className = "" }: DevicePlanBadgeProps) {
  const isPlus = plan?.toLowerCase() === 'plus';

  return (
    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter transition-all ${
      isPlus
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/10'
    } ${className}`}>
      {plan ?? 'free'}
    </span>
  );
}
