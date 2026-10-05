import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { referralFormAnchor } from '@/components/referral/referralFormAnchor';

const rewardSteps = [
  { key: 'first', heightClassName: 'h-[92px] sm:h-[110px]' },
  { key: 'second', heightClassName: 'h-[114px] sm:h-[140px]' },
  { key: 'third', heightClassName: 'h-[136px] sm:h-[170px]' },
  { key: 'fourth', heightClassName: 'h-[158px] sm:h-[200px]' },
  { key: 'fifth', heightClassName: 'h-[190px] sm:h-[240px]', isGift: true },
] as const;

export const ReferralHeroSection = () => {
  const { t } = useTranslation('referral');

  return (
    <>
      <section aria-labelledby="referral-hero-title" className="bg-ivory text-night">
        <div className={cn('hz-page-container', 'grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-20 lg:pt-12 xl:gap-24')}>
          <div className="flex flex-col gap-4 lg:gap-5">
            <p className="hz-page-eyebrow motion-safe:animate-fade-up lg:text-sm lg:tracking-[1.5px]">{t('hero.eyebrow')}</p>
            <h1
              id="referral-hero-title"
              className="hz-page-title motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]"
            >
              {t('hero.title')}
            </h1>
            <p className="hz-page-lead motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px] lg:leading-[1.55]">{t('hero.lead')}</p>
            <a
              href={`#${referralFormAnchor}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'hz-page-button mt-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:self-start',
              )}
            >
              {t('hero.cta')}
            </a>
          </div>
          <ol aria-label={t('hero.scaleLabel')} className="grid grid-cols-5 items-end gap-1.5 border-b border-sand-line pb-5 sm:gap-2.5">
            {rewardSteps.map((step, index) => {
              const isGift = 'isGift' in step;
              return (
                <li
                  key={step.key}
                  style={{ animationDelay: `${280 + index * 90}ms` }}
                  className={cn(
                    'flex flex-col-reverse justify-start rounded-md px-1 py-3 text-center motion-safe:animate-fade-up sm:px-2.5 sm:py-4',
                    step.heightClassName,
                    isGift ? 'bg-night' : 'bg-[#eee5da]',
                  )}
                >
                  <span className={cn('block text-[11px] leading-tight sm:text-xs', isGift ? 'mt-1 text-slate-light' : 'text-slate-ink')}>{t(`hero.scale.${step.key}.rank`)}</span>
                  <span
                    className={cn(
                      'block font-medium',
                      isGift
                        ? 'text-xs leading-[1.2] text-white sm:text-[15px] lg:text-sm xl:text-base desktop:text-lg'
                        : 'whitespace-nowrap text-[17px] text-solar sm:text-[22px] lg:text-[19px] xl:text-[22px]',
                    )}
                  >
                    {t(`hero.scale.${step.key}.reward`)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <div className="hz-page-container overflow-hidden rounded-md">
        <img
          src="/images/referral/neighbours-talking.webp"
          alt={t('hero.imageAlt')}
          width={1024}
          height={1024}
          fetchPriority="high"
          className="block h-[280px] w-full object-cover [object-position:50%_40%] motion-safe:animate-zoom-in sm:h-[320px] lg:h-[520px]"
        />
      </div>
    </>
  );
};
