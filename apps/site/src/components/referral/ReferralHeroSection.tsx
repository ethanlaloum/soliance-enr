import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';
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
      <section aria-labelledby="referral-hero-title" className="bg-solar text-white">
        <div className={cn(containerClassName, 'grid items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-20 xl:gap-16')}>
          <div className="flex flex-col gap-4 lg:gap-5">
            <p className="text-xs font-semibold uppercase tracking-[1.2px] text-white/85 motion-safe:animate-fade-up lg:text-sm lg:tracking-[1.5px]">{t('hero.eyebrow')}</p>
            <h1
              id="referral-hero-title"
              className="text-[36px] font-bold leading-[1.08] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[46px] lg:leading-[1.05] xl:text-[52px] desktop:text-[58px]"
            >
              {t('hero.title')}
            </h1>
            <p className="text-base leading-normal text-white/[0.92] motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px] lg:leading-[1.55]">{t('hero.lead')}</p>
            <a
              href={`#${referralFormAnchor}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-1 bg-night hover:bg-night-soft hover:shadow-[0_12px_24px_-10px_rgba(11,17,32,0.7)] focus-visible:outline-night motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:self-start',
              )}
            >
              {t('hero.cta')}
            </a>
          </div>
          <ol aria-label={t('hero.scaleLabel')} className="grid grid-cols-5 items-end gap-1.5 sm:gap-2.5">
            {rewardSteps.map((step, index) => {
              const isGift = 'isGift' in step;
              return (
                <li
                  key={step.key}
                  style={{ animationDelay: `${280 + index * 90}ms` }}
                  className={cn(
                    'flex flex-col-reverse justify-start rounded-xl px-1 py-3 text-center motion-safe:animate-fade-up sm:px-2.5 sm:py-4',
                    step.heightClassName,
                    isGift ? 'bg-night shadow-soft' : 'bg-white',
                  )}
                >
                  <span className={cn('block text-[11px] leading-tight sm:text-xs', isGift ? 'mt-1 text-slate-light' : 'text-slate-ink')}>{t(`hero.scale.${step.key}.rank`)}</span>
                  <span
                    className={cn(
                      'block font-bold',
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
      <picture className="block overflow-hidden">
        <source
          media="(min-width: 768px)"
          srcSet="/images/referral/neighbours-talking-landscape.webp"
          width={1983}
          height={793}
        />
        <img
          src="/images/referral/neighbours-talking-enhanced.webp"
          alt={t('hero.imageAlt')}
          width={1254}
          height={1254}
          fetchPriority="high"
          className="block h-auto w-full motion-safe:animate-zoom-in"
        />
      </picture>
    </>
  );
};
