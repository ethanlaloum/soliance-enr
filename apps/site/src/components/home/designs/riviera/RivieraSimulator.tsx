import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { containerClassName } from '@/components/home/containerClassName';
import { estimateKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { RivieraEyebrow } from '@/components/home/designs/riviera/RivieraEyebrow';
import { rvCtaSunClassName, rvSectionSpacingClassName, rvTitleClassName } from '@/components/home/designs/riviera/rivieraClassNames';

const pathSize = 1200;
const horizonY = 560;
const arcCenterX = pathSize / 2;
const arcRadiusX = 450;
const arcRadiusY = 440;
const peakDiscRadius = 54;
const shares = solarEstimateParameters.monthlyProductionShares;
const peakShare = Math.max(...shares);

const roundTenth = (value: number) => Math.round(value * 10) / 10;

const sunDiscs = shares.map((share, index) => {
  const angle = Math.PI * (1 - (index + 0.5) / shares.length);
  return {
    cx: roundTenth(arcCenterX + arcRadiusX * Math.cos(angle)),
    cy: roundTenth(horizonY - arcRadiusY * Math.sin(angle)),
    r: roundTenth((share / peakShare) * peakDiscRadius),
  };
});

const arcPath = `M ${arcCenterX - arcRadiusX} ${horizonY} A ${arcRadiusX} ${arcRadiusY} 0 0 1 ${arcCenterX + arcRadiusX} ${horizonY}`;

const SunPath = () => (
  <svg aria-hidden="true" viewBox={`0 0 ${pathSize} ${pathSize}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 block h-full w-full">
    <path
      data-rv-sun-arc
      d={arcPath}
      pathLength={1}
      strokeDasharray="1"
      fill="none"
      stroke="#CFE0F5"
      strokeOpacity={0.75}
      strokeWidth={2}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    {sunDiscs.map((disc, index) => (
      <circle key={index} data-rv-sun-disc cx={disc.cx} cy={disc.cy} r={disc.r} fill="#E07B28" stroke="#F1F5FB" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    ))}
  </svg>
);

const sunPathMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const figure = root.querySelector<HTMLElement>('[data-rv-sim-figure]');
  const photo = root.querySelector<HTMLElement>('[data-rv-sim-photo]');
  const arc = root.querySelector<SVGPathElement>('[data-rv-sun-arc]');
  const discs = gsap.utils.toArray<SVGCircleElement>('[data-rv-sun-disc]', root);
  if (!figure || !photo || !arc) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (reduceMotion) return;

    if (desktop) {
      gsap.fromTo(photo, { yPercent: 0 }, { yPercent: -9, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    if (ScrollTrigger.isInViewport(figure, 0.25)) return;
    gsap
      .timeline({ scrollTrigger: { trigger: figure, start: 'top 70%', once: true } })
      .fromTo(arc, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' }, 0)
      .from(discs, { attr: { r: 0 }, duration: 0.75, ease: 'back.out(2.2)', stagger: 0.12 }, 0.25);
  });
};

export const RivieraSimulator = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useLazyMotion(sectionRef, sunPathMotion);

  return (
    <section ref={sectionRef} aria-labelledby="simulator-title" className="relative overflow-hidden bg-[#0B1F4D] text-white">
      <div className={cn(containerClassName, rvSectionSpacingClassName, 'grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8')}>
        <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-7">
          <RivieraEyebrow>{t('simulator.eyebrow')}</RivieraEyebrow>
          <h2 id="simulator-title" data-reveal-heading className={rvTitleClassName}>
            {t('simulator.title')}
          </h2>
          <p className="max-w-[520px] text-[17px] leading-[1.6] text-[#CFE0F5] lg:text-lg">
            <Responsive mobile={t('simulator.leadShort')} desktop={t('simulator.lead')} />
          </p>
          <Link data-magnetic to={paths.simulator} className={cn(rvCtaSunClassName, 'mt-2 self-start')}>
            {t('simulator.cta')}
          </Link>
        </div>
        <figure data-rv-sim-figure className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-square overflow-hidden bg-[#13327F]">
            <div data-rv-sim-photo className="absolute inset-x-0 top-0 h-[112%]">
              <img
                src="/images/simulator-roof.webp"
                alt={t('simulator.imageAlt')}
                width={1200}
                height={1200}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#0B1F4D]/80 via-[#0B1F4D]/35 to-transparent" />
              <SunPath />
            </div>
          </div>
          <figcaption>
            <dl aria-label={t('simulator.estimateLabel')} className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0">
              {estimateKeys.map((key) => (
                <div
                  key={key}
                  className="flex flex-col-reverse justify-end gap-2 border-t border-[#CFE0F5]/20 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-[13px] leading-snug text-[#CFE0F5] lg:text-sm">{t(`simulator.estimate.${key}.label`)}</dt>
                  <dd
                    className={cn(
                      'riviera-display [text-wrap:balance] text-xl font-semibold leading-tight tracking-[-0.02em] lg:text-[22px]',
                      key === 'autonomy' ? 'text-[#E07B28]' : 'text-white',
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
