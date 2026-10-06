import { ComponentType, Fragment } from 'react';
import { cn } from '@/lib/utils';

type DiagramStep = {
  key: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

type SchemeDiagramProps = {
  label: string;
  steps: DiagramStep[];
  className?: string;
};

export const SchemeDiagram = ({ label, steps, className }: SchemeDiagramProps) => (
  <ol aria-label={label} className={cn('flex items-start justify-between gap-1 rounded-xl bg-white/95 px-2.5 py-2.5 shadow-soft backdrop-blur-sm lg:px-4 lg:py-3', className)}>
    {steps.map(({ key, label: stepLabel, Icon }, index) => (
      <Fragment key={key}>
        {index > 0 && (
          <li aria-hidden="true" className="mt-2.5 shrink-0 text-solar">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6h15M11.5 1.5 16 6l-4.5 4.5" />
            </svg>
          </li>
        )}
        <li className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full lg:h-9 lg:w-9',
              index === steps.length - 1 ? 'bg-solar text-white' : 'bg-solar/10 text-solar',
            )}
          >
            <Icon className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
          </span>
          <span className="text-[11px] font-semibold leading-tight text-night lg:text-xs">{stepLabel}</span>
        </li>
      </Fragment>
    ))}
  </ol>
);
