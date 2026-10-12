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
  <ol
    aria-label={label}
    className={cn('flex items-start justify-between gap-1 rounded border border-white/10 bg-night/85 px-2.5 py-2.5 text-ivory backdrop-blur-sm lg:px-4 lg:py-3', className)}
  >
    {steps.map(({ key, label: stepLabel, Icon }, index) => (
      <Fragment key={key}>
        {index > 0 && (
          <li aria-hidden="true" className="mt-4 h-px min-w-3 flex-[0.35] bg-gradient-to-r from-solar/30 to-solar lg:mt-[18px]" />
        )}
        <li className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full lg:h-9 lg:w-9',
              index === steps.length - 1 ? 'bg-solar text-night' : 'border border-solar/60 text-solar',
            )}
          >
            <Icon className="h-[17px] w-[17px] lg:h-[19px] lg:w-[19px]" />
          </span>
          <span className="text-[11px] font-medium leading-tight text-ivory lg:text-xs">{stepLabel}</span>
        </li>
      </Fragment>
    ))}
  </ol>
);
