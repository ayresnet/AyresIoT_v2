import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-outline-variant/10 pb-6">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
          {title}
        </h1>
        <p className="text-on-surface-variant mt-1.5 font-body text-sm md:text-base">
          {subtitle}
        </p>
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}
