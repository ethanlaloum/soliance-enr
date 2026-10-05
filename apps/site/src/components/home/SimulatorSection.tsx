import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { paths } from '@/routes/paths';
import { cn } from '@/lib/utils';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { containerClassName } from '@/components/home/containerClassName';
import { Eyebrow } from '@/components/home/Eyebrow';
import { ctaClassName, homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const estimateKeys = ['power', 'production', 'autonomy'] as const;

const chartWidth = 240;
const chartHeight = 100;
const barGap = 6;
const shares = solarEstimateParameters.monthlyProductionShares;
const peakShare = Math.max(...shares);
const barWidth = (chartWidth - barGap * (shares.length - 1)) / shares.length;

const ProductionCurve = () => (
  <svg aria-hidden="true" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="block h-full w-full">
    {shares.map((share, index) => {
      const height = (share / peakShare) * chartHeight;
      return <rect key={index} data-production-bar x={index * (barWidth + barGap)} y={chartHeight - height} width={barWidth} height={height} className="fill-solar/90" />;
    })}
  </svg>
);

const simulatorMotion: MotionSetup = ({ gsap }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    const figure = root.querySelector<HTMLElement>('[data-simulator-figure]');
    const photo = root.querySelector<HTMLElement>('[data-simulator-photo]');
    const bars = gsap.utils.toArray<SVGRectElement>('[data-production-bar]', root);
    if (!figure || !photo) return;

    gsap.fromTo(photo, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(bars, {
      attr: { y: chartHeight, height: 0 },
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: figure, start: 'top 75%', end: 'bottom 70%', scrub: 0.8 },
    });
  });
};

export const SimulatorSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  useLazyMotion(sectionRef, simulatorMotion);

  return (
    <section ref={sectionRef} aria-labelledby="simulator-title" className="relative overflow-hidden bg-night text-white">
      <div className={cn(containerClassName, 'grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-36')}>
        <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-7">
          <Eyebrow>{t('simulator.eyebrow')}</Eyebrow>
          <h2 id="simulator-title" data-reveal-heading className={homeSectionTitleClassName}>
            {t('simulator.title')}
          </h2>
          <p className="max-w-[520px] text-[17px] font-light leading-[1.6] text-slate-light lg:text-lg">
            <span className="lg:hidden">{t('simulator.leadShort')}</span>
            <span className="hidden lg:inline">{t('simulator.lead')}</span>
          </p>
          <Link to={paths.simulator} className={cn(ctaClassName, 'mt-2 self-start')}>
            {t('simulator.cta')}
          </Link>
        </div>
        <figure data-simulator-figure className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-night-soft lg:aspect-[5/6] lg:rounded-[28px]">
            <div data-simulator-photo className="absolute inset-x-0 -top-[10%] h-[120%]">
              <img
                src="/images/simulator-roof.webp"
                alt={t('simulator.imageAlt')}
                width={1200}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-night via-night/70 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 h-[22%] lg:inset-x-10 lg:bottom-10 lg:h-[24%]">
              <ProductionCurve />
            </div>
          </div>
          <figcaption>
            <dl aria-label={t('simulator.estimateLabel')} className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0">
              {estimateKeys.map((key) => (
                <div key={key} className="flex flex-col-reverse justify-end gap-1.5 border-t border-white/15 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
                  <dt className="text-[13px] leading-snug text-slate-light lg:text-sm">{t(`simulator.estimate.${key}.label`)}</dt>
                  <dd className={cn('text-2xl font-bold tracking-[-0.02em] lg:text-[28px]', key === 'autonomy' ? 'text-solar' : 'text-white')}>
                    {t(`simulator.estimate.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
