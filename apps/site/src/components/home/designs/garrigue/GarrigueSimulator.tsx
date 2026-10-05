import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { useMagnetic } from '@/components/home/useMagnetic';
import { estimateKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { TileFrieze, TileMark } from '@/components/home/designs/garrigue/GarrigueOrnaments';
import {
  archClosedClipPath,
  archOpenClipPath,
  displayTitleClassName,
  eyebrowOnDarkClassName,
  leadOnDarkClassName,
  pineSectionClassName,
  primaryCtaClassName,
} from '@/components/home/designs/garrigue/garrigueTokens';

const chartWidth = 360;
const chartHeight = 132;
const barGap = 8;
const baseline = chartHeight - 6;
const shares = solarEstimateParameters.monthlyProductionShares;
const peakShare = Math.max(...shares);
const barWidth = (chartWidth - barGap * (shares.length - 1)) / shares.length;
const tileRadius = barWidth / 2;
const tileFillId = 'garrigue-tile-fill';
const tileClipId = 'garrigue-tile-clip';

type SimulatorConditions = { desktop: boolean; allowMotion: boolean };

const TileBars = () => (
  <svg data-g-sim-chart aria-hidden="true" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="block h-auto w-full">
    <defs>
      <linearGradient id={tileFillId} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#97462A" />
        <stop offset="0.38" stopColor="#D9804F" />
        <stop offset="0.62" stopColor="#C4673A" />
        <stop offset="1" stopColor="#8E4124" />
      </linearGradient>
      <clipPath id={tileClipId}>
        <rect x="0" y="0" width={chartWidth} height={baseline} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${tileClipId})`}>
      {shares.map((share, index) => {
        const height = (share / peakShare) * (baseline - 2);
        return (
          <rect
            key={index}
            data-g-tile-bar
            x={index * (barWidth + barGap)}
            y={baseline - height}
            width={barWidth}
            height={height + tileRadius}
            rx={tileRadius}
            fill={`url(#${tileFillId})`}
          />
        );
      })}
    </g>
    <rect x="0" y={baseline + 2} width={chartWidth} height="2" rx="1" fill="#B9C7B0" fillOpacity="0.45" />
  </svg>
);

const simulatorMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, allowMotion } = context.conditions as SimulatorConditions;
    const arch = root.querySelector<HTMLElement>('[data-g-sim-arch]');
    const photo = root.querySelector<HTMLElement>('[data-g-sim-photo]');
    const chart = root.querySelector<SVGSVGElement>('[data-g-sim-chart]');
    if (!allowMotion || !arch || !photo || !chart) return;

    if (!ScrollTrigger.isInViewport(chart, 0.2)) {
      gsap.from(gsap.utils.toArray<SVGRectElement>('[data-g-tile-bar]', chart), {
        attr: { y: baseline, height: tileRadius },
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.075,
        scrollTrigger: { trigger: chart, start: 'top 88%', once: true },
      });
    }

    if (!desktop) return;

    gsap.fromTo(photo, { yPercent: 0 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: arch, start: 'top bottom', end: 'bottom top', scrub: true } });

    if (ScrollTrigger.isInViewport(arch, 0.1)) return;
    gsap.fromTo(
      arch,
      { clipPath: archClosedClipPath },
      { clipPath: archOpenClipPath, duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: arch, start: 'top 82%', once: true } },
    );
  });
};

export const GarrigueSimulator = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useMagnetic(sectionRef);
  useLazyMotion(sectionRef, simulatorMotion);

  return (
    <section ref={sectionRef} aria-labelledby="simulator-title" className={cn(pineSectionClassName, 'relative overflow-hidden')}>
      <TileFrieze variant="eave" />
      <div className={cn(containerClassName, 'grid gap-12 pb-20 pt-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-32 lg:pt-28')}>
        <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-7">
          <p className={eyebrowOnDarkClassName}>
            <TileMark />
            <span>{t('simulator.eyebrow')}</span>
          </p>
          <h2 id="simulator-title" data-reveal-heading className={displayTitleClassName}>
            {t('simulator.title')}
          </h2>
          <p className={leadOnDarkClassName}>
            <Responsive mobile={t('simulator.leadShort')} desktop={t('simulator.lead')} />
          </p>
          <Link data-magnetic to={paths.simulator} className={cn(primaryCtaClassName, 'mt-2 self-start')}>
            {t('simulator.cta')}
          </Link>
        </div>
        <figure className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
          <div data-g-sim-arch className="g-arch relative mx-auto aspect-[10/11] w-full max-w-[520px] bg-[#142921] lg:aspect-[5/6]">
            <div data-g-sim-photo className="absolute inset-x-0 -top-[10%] h-[120%]">
              <img src="/images/simulator-roof.webp" alt={t('simulator.imageAlt')} width={1200} height={1200} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#142921] via-[#142921]/75 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 lg:inset-x-10 lg:bottom-10">
              <TileBars />
            </div>
          </div>
          <figcaption>
            <dl aria-label={t('simulator.estimateLabel')} className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0">
              {estimateKeys.map((key) => (
                <div
                  key={key}
                  className="flex flex-col-reverse justify-end gap-1.5 border-t border-[#B9C7B0]/20 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-[13px] leading-snug text-[#B9C7B0] lg:text-sm">{t(`simulator.estimate.${key}.label`)}</dt>
                  <dd
                    className={cn(
                      'g-display text-[26px] font-[480] leading-tight tracking-[-0.01em] lining-nums',
                      key === 'autonomy' ? 'text-[#E07B28]' : 'text-[#F4F6F1]',
                    )}
                  >
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
