import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const expectedPoints = '0,70 42,66 84,68 126,64 168,66 210,62 252,65 294,63 336,66 378,64 420,68 462,66 504,70';
const actualPoints = '0,74 42,70 84,72 126,69 168,71 210,68 252,70 294,118 336,124 378,121 420,126 462,122 504,125';

export const CareDashboard = ({ className }: { className?: string }) => {
  const { t } = useTranslation('care');

  return (
    <div className={cn('relative text-care-ink lg:pb-[112px]', className)}>
      <figure className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-hero motion-safe:animate-fade-up motion-safe:[animation-delay:200ms] lg:mr-12 lg:gap-[18px] lg:rounded-[18px] lg:p-7">
        <figcaption className="flex items-center justify-between gap-3">
          <span className="text-base font-bold lg:text-lg">{t('dashboard.title')}</span>
          <span className="whitespace-nowrap rounded-full bg-care-surface px-3 py-1.5 text-xs font-semibold text-care lg:text-[13px]">{t('dashboard.status')}</span>
        </figcaption>
        <svg role="img" aria-label={t('dashboard.chartLabel')} viewBox="0 0 504 170" className="block h-auto w-full overflow-visible">
          <line x1="0" y1="160" x2="504" y2="160" stroke="#dfe8e2" strokeWidth="1" />
          <line x1="0" y1="110" x2="504" y2="110" stroke="#eef3ef" strokeWidth="1" />
          <line x1="0" y1="60" x2="504" y2="60" stroke="#eef3ef" strokeWidth="1" />
          <polyline fill="none" stroke="#9fb8aa" strokeWidth="2" strokeDasharray="5 5" points={expectedPoints} />
          <polyline
            fill="none"
            stroke="#1A7A52"
            strokeWidth="3"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            points={actualPoints}
            className="motion-safe:animate-draw-line motion-safe:[animation-delay:500ms]"
          />
          <circle cx="294" cy="118" r="7" fill="#E07B28" className="origin-center opacity-0 [transform-box:fill-box] motion-safe:animate-pulse-ring motion-safe:[animation-delay:1.9s] motion-reduce:hidden" />
          <circle cx="294" cy="118" r="7" fill="#E07B28" className="motion-safe:animate-fade-in motion-safe:[animation-delay:1.4s]" />
        </svg>
        <div aria-hidden="true" className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-care-muted lg:text-[13px]">
          <span className="flex items-center gap-2">
            <span className="block h-[3px] w-5 rounded-full bg-care" />
            {t('dashboard.actual')}
          </span>
          <span className="flex items-center gap-2">
            <span className="block w-5 border-t-2 border-dashed border-[#9fb8aa]" />
            {t('dashboard.expected')}
          </span>
        </div>
      </figure>

      <div
        role="note"
        className="relative z-10 -mt-4 ml-auto flex w-[92%] flex-col gap-2 rounded-2xl border-t-[5px] border-solar bg-white p-5 shadow-float motion-safe:animate-fade-up motion-safe:[animation-delay:1.6s] sm:w-[380px] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:p-[22px]"
      >
        <p className="text-xs font-bold uppercase tracking-[1px] text-care-alert lg:text-[13px]">{t('dashboard.alertEyebrow')}</p>
        <p className="text-base font-bold leading-snug lg:text-[17px]">{t('dashboard.alertTitle')}</p>
        <p className="text-sm leading-[1.45] text-care-muted">{t('dashboard.alertBody')}</p>
      </div>
    </div>
  );
};
