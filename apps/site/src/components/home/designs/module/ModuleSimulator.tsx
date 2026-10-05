import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { useMagnetic } from '@/components/home/useMagnetic';
import { estimateKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { ModuleImage } from '@/components/home/designs/module/ModuleImage';
import { ModuleEyebrow } from '@/components/home/designs/module/ModuleParts';
import { ctaAccentClassName, titleLClassName } from '@/components/home/designs/module/moduleClassNames';
import { useModuleImages } from '@/components/home/designs/module/useModuleImages';

const arrayLevels = 10;
const shares = solarEstimateParameters.monthlyProductionShares;
const peakShare = Math.max(...shares);
const monthlyModuleCounts = shares.map((share) => Math.max(1, Math.round((share / peakShare) * arrayLevels)));
const levels = Array.from({ length: arrayLevels }, (_, level) => level);

const ProductionArray = () => (
  <div aria-hidden="true" data-production className="grid w-full max-w-[21.5rem] grid-cols-12 items-end gap-[5px] border-b-2 border-[#C9D1DA] pb-[7px]">
    {monthlyModuleCounts.map((count, month) => (
      <span key={month} data-production-column className="flex flex-col-reverse gap-[5px]">
        {levels.map((level) => (
          <span key={level} className="mod-slot">
            {level < count && <span data-production-cell className="absolute inset-0 bg-[#E07B28]" />}
          </span>
        ))}
      </span>
    ))}
  </div>
);

const simulatorMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    const array = root.querySelector<HTMLElement>('[data-production]');
    if (reduceMotion || !array || ScrollTrigger.isInViewport(array, 0.1)) return;

    const timeline = gsap.timeline({ scrollTrigger: { trigger: array, start: 'top 85%', once: true } });
    gsap.utils.toArray<HTMLElement>('[data-production-column]', array).forEach((column, month) => {
      timeline.from(
        column.querySelectorAll('[data-production-cell]'),
        { autoAlpha: 0, scale: 0.35, duration: desktop ? 0.42 : 0.3, ease: 'power3.out', stagger: desktop ? 0.045 : 0.028 },
        month * (desktop ? 0.075 : 0.045),
      );
    });
  });
};

export const ModuleSimulator = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useMagnetic(sectionRef);
  useModuleImages(sectionRef);
  useLazyMotion(sectionRef, simulatorMotion);

  return (
    <section ref={sectionRef} aria-labelledby="simulator-title" className="bg-[#10243F] text-white">
      <div className={cn(containerClassName, 'grid gap-12 py-20 lg:grid-cols-12 lg:gap-x-10 lg:py-32')}>
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:col-span-5 lg:self-start lg:gap-8">
          <ModuleEyebrow tone="dark">{t('simulator.eyebrow')}</ModuleEyebrow>
          <h2 id="simulator-title" data-reveal-heading className={titleLClassName}>
            {t('simulator.title')}
          </h2>
          <p className="max-w-[520px] text-[17px] leading-[1.6] text-[#AEBBCB] lg:text-lg">
            <Responsive mobile={t('simulator.leadShort')} desktop={t('simulator.lead')} />
          </p>
          <Link data-magnetic to={paths.simulator} className={cn(ctaAccentClassName, 'mt-2 self-start')}>
            {t('simulator.cta')}
          </Link>
        </div>
        <figure className="grid gap-10 lg:col-span-7 lg:gap-12 xl:grid-cols-[21.5rem_minmax(0,1fr)]">
          <ModuleImage intro="scroll" parallax grid={{ cols: 5, rows: 3 }} desktopGrid={{ cols: 6, rows: 3 }} className="aspect-[4/3] lg:aspect-[16/10] xl:col-span-2">
            <img
              src="/images/simulator-roof.webp"
              alt={t('simulator.imageAlt')}
              width={1200}
              height={1200}
              loading="lazy"
              className="h-full w-full object-cover object-[50%_66%]"
            />
          </ModuleImage>
          <ProductionArray />
          <figcaption className="xl:self-end">
            <dl aria-label={t('simulator.estimateLabel')} className="flex flex-col">
              {estimateKeys.map((key) => (
                <div key={key} className="flex flex-col-reverse justify-end gap-1.5 border-t border-white/15 py-4 first:border-t-0 first:pt-0 last:pb-0">
                  <dt className="text-sm leading-snug text-[#AEBBCB]">{t(`simulator.estimate.${key}.label`)}</dt>
                  <dd className={cn('text-[26px] font-extrabold leading-tight tracking-[-0.03em] lg:text-[30px]', key === 'autonomy' ? 'text-[#E07B28]' : 'text-white')}>
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
