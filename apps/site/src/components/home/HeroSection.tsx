import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CheckIcon, DiamondPattern } from '@/components/icons/Icons';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';

const trustKeys = ['rge', 'decennial', 'installation', 'localTeam'] as const;
const statKeys = ['installations', 'signature', 'maintenance'] as const;

const KeyFigures = ({ className, compact }: { className?: string; compact?: boolean }) => {
  const { t } = useTranslation('home');

  return (
    <dl aria-label={t('hero.statsLabel')} className={cn('grid grid-cols-3 rounded-[14px] bg-white', className)}>
      {statKeys.map((key) => (
        <div key={key} className="flex flex-col-reverse justify-end">
          <dt className={cn('text-slate-ink', compact ? 'text-[11px]' : 'text-[13px]')}>
            {t(compact ? `hero.stats.${key}.labelShort` : `hero.stats.${key}.label`)}
          </dt>
          <dd className={cn('font-bold text-solar', compact ? 'text-[22px]' : 'text-3xl')}>{t(`hero.stats.${key}.value`)}</dd>
        </div>
      ))}
    </dl>
  );
};

export const HeroSection = () => {
  const { t } = useTranslation('home');

  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <DiamondPattern />
        <div className={cn(containerClassName, 'relative grid items-center gap-16 pb-10 pt-8 lg:grid-cols-2 lg:pb-[100px] lg:pt-20')}>
          <div className="flex flex-col gap-4 lg:gap-6">
            <p className={cn(eyebrowClassName, 'motion-safe:animate-fade-up')}>
              <span className="lg:hidden">{t('hero.eyebrowShort')}</span>
              <span className="hidden lg:inline">{t('hero.eyebrow')}</span>
            </p>
            <h1 className="text-4xl font-bold leading-[1.08] text-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[62px] lg:leading-[1.05]">{t('hero.title')}</h1>
            <p className="text-base leading-normal text-slate-light motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-xl lg:leading-[1.55]">
              <span className="lg:hidden">{t('hero.leadShort')}</span>
              <span className="hidden lg:inline">{t('hero.lead')}</span>
            </p>
            <div className="mt-1 flex flex-col gap-3.5 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap">
              <Link to={paths.simulator} className={buttonVariants({ size: 'lg' })}>
                {t('hero.simulate')}
              </Link>
              <a href={`#${contactAnchor}`} className={buttonVariants({ variant: 'outlineLight', size: 'lg' })}>
                {t('hero.requestStudy')}
              </a>
            </div>
            <ul aria-label={t('hero.trustLabel')} className="mt-1 flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-slate-mist motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:mt-2 lg:text-sm">
              {trustKeys.map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <CheckIcon className="shrink-0 text-solar" />
                  {t(`hero.trust.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden flex-col gap-4 lg:flex">
            <img
              src="/images/hero-vence-villa.webp"
              alt={t('hero.imageAlt')}
              width={1280}
              height={720}
              loading="lazy"
              fetchPriority="high"
              data-preload-media="(min-width: 1024px)"
              className="block h-[360px] w-full rounded-[18px] object-cover shadow-hero motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms]"
            />
            <KeyFigures className="gap-4 px-6 py-5 shadow-float motion-safe:animate-fade-up motion-safe:[animation-delay:400ms]" />
          </div>
        </div>
      </section>
      <div className="relative z-10 -mt-5 px-4 lg:hidden">
        <KeyFigures compact className="gap-2 p-[18px] shadow-soft motion-safe:animate-fade-up motion-safe:[animation-delay:320ms]" />
      </div>
    </>
  );
};
