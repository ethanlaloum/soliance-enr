import { CSSProperties, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { CheckIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';
import { SplitWords } from '@/components/home/SplitWords';
import { heroImage, statKeys, trustKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { RivieraEyebrow } from '@/components/home/designs/riviera/RivieraEyebrow';
import { rvCtaGhostClassName, rvCtaSunClassName } from '@/components/home/designs/riviera/rivieraClassNames';

const glintWidths = ['72%', '54%', '36%', '18%'] as const;

const sunsetMotion: MotionSetup = ({ gsap }, root) => {
  const stage = root.querySelector<HTMLElement>('[data-rv-stage]');
  const sun = root.querySelector<HTMLElement>('[data-rv-sun]');
  const halo = root.querySelector<HTMLElement>('[data-rv-halo]');
  const dusks = gsap.utils.toArray<HTMLElement>('[data-rv-dusk]', root);
  const glints = gsap.utils.toArray<HTMLElement>('[data-rv-glint]', root);
  const tints = gsap.utils.toArray<HTMLElement>('[data-rv-hero-tint]', root);
  if (!stage || !sun || !halo) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (!desktop || reduceMotion) return;

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: () => (stage.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
          end: '+=100%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .to(sun, { yPercent: 84, ease: 'power1.in', duration: 1 }, 0)
      .to(halo, { opacity: 0, duration: 0.55 }, 0.1)
      .to(dusks, { opacity: 1, duration: 0.85 }, 0.15)
      .to(glints, { scaleX: 0, duration: 0.45, stagger: 0.06 }, 0.45)
      .to(tints, { opacity: 0, duration: 0.7 }, 0.3)
      .to({}, { duration: 0.15 });
  });
};

const KeyFigures = ({ compact, className }: { compact?: boolean; className?: string }) => {
  const { t } = useTranslation('home');

  return (
    <dl aria-label={t('hero.statsLabel')} className={cn('grid grid-cols-3', className)}>
      {statKeys.map((key) => (
        <div key={key} className="flex flex-col-reverse justify-end gap-2 border-l border-white/25 pl-3.5 first:border-l-0 first:pl-0 lg:gap-3 lg:pl-8">
          <dt className="text-xs leading-snug text-[#CFE0F5] lg:max-w-[260px] lg:text-[15px] lg:text-white/90">
            {t(compact ? `hero.stats.${key}.labelShort` : `hero.stats.${key}.label`)}
          </dt>
          <dd className="riviera-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-white lg:text-[clamp(2.25rem,3.4vw,3.25rem)]">
            {t(`hero.stats.${key}.value`)}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export const RivieraHero = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const title = t('hero.title');

  useLazyMotion(sectionRef, sunsetMotion);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#1B3FA0] text-white">
      <div data-rv-stage className="riviera-stage relative flex flex-col">
        <div className="riviera-sky relative lg:flex lg:flex-col lg:justify-center">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <span data-rv-dusk className="absolute inset-0 block bg-[#0B1F4D] opacity-0" />
            <span className="riviera-sun-pos riviera-sun-rise absolute block">
              <span data-rv-sun className="absolute inset-0 block">
                <span data-rv-halo className="absolute inset-0 block">
                  <span className="absolute inset-[-62%] block rounded-full bg-[#1E44A6]" />
                  <span className="absolute inset-[-38%] block rounded-full bg-[#2249AB]" />
                  <span className="absolute inset-[-17%] block rounded-full bg-[#2850B2]" />
                </span>
                <span className="absolute inset-0 block rounded-full bg-[#E07B28]" />
              </span>
            </span>
          </div>

          <div className={cn(containerClassName, 'relative z-10 pt-10 lg:py-12')}>
            <div className="flex flex-col gap-5 lg:max-w-[56%] lg:gap-7">
              <RivieraEyebrow className="hero-fade [--fade-delay:0.1s]">
                <Responsive mobile={t('hero.eyebrowShort')} desktop={t('hero.eyebrow')} />
              </RivieraEyebrow>
              <h1
                aria-label={title}
                className="riviera-display [text-wrap:balance] text-[clamp(1.5rem,7.6vw,2.75rem)] font-bold uppercase leading-[1.02] tracking-[-0.015em] lg:text-[clamp(2.5rem,min(4.4vw,7.6vh),4.25rem)]"
              >
                <SplitWords text={title} />
              </h1>
              <p className="hero-fade max-w-[620px] text-[17px] leading-[1.6] text-[#CFE0F5] [--fade-delay:0.55s] lg:text-lg lg:leading-[1.55]">
                <Responsive mobile={t('hero.leadShort')} desktop={t('hero.lead')} />
              </p>
              <div className="hero-fade flex flex-col gap-3 [--fade-delay:0.7s] sm:flex-row sm:flex-wrap">
                <Link data-magnetic to={paths.simulator} className={rvCtaSunClassName}>
                  {t('hero.simulate')}
                </Link>
                <a data-magnetic href={`#${contactAnchor}`} className={rvCtaGhostClassName}>
                  {t('hero.requestStudy')}
                </a>
              </div>
              <ul
                aria-label={t('hero.trustLabel')}
                className="hero-fade flex flex-wrap gap-x-6 gap-y-2.5 text-[13px] font-medium text-[#CFE0F5] [--fade-delay:0.85s] lg:text-sm"
              >
                {trustKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <CheckIcon className="shrink-0 text-[#E07B28]" />
                    {t(`hero.trust.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="relative h-[var(--rv-sea)] overflow-hidden bg-[#13327F]">
          <span data-rv-dusk className="absolute inset-0 block bg-[#0B1F4D]/70 opacity-0" />
          <span className="riviera-glints">
            {glintWidths.map((width, index) => (
              <span key={width} className="riviera-glint-in block w-full" style={{ '--glint-index': index } as CSSProperties}>
                <span data-rv-glint className="riviera-glint mx-auto bg-[#E07B28]" style={{ width }} />
              </span>
            ))}
          </span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-[#0B1F4D] sm:aspect-[16/8] lg:aspect-auto lg:h-[var(--rv-photo)]">
          <div className="absolute inset-0 isolate">
            <img
              src={heroImage.src}
              alt={t('hero.imageAlt')}
              width={heroImage.width}
              height={heroImage.height}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[50%_50%]"
            />
            <span data-rv-hero-tint aria-hidden="true" className="riviera-tint riviera-tint-hue" />
            <span data-rv-hero-tint aria-hidden="true" className="riviera-tint riviera-tint-floor" />
          </div>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden h-[max(75%,230px)] bg-gradient-to-t from-[#0B1F4D] via-[#0B1F4D]/80 to-transparent lg:block"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 hidden lg:block">
            <div className={cn(containerClassName, 'hero-fade pb-10 [--fade-delay:1.1s]')}>
              <KeyFigures />
            </div>
          </div>
        </div>

        <div className="bg-[#0B1F4D] px-5 pb-10 pt-7 lg:hidden">
          <KeyFigures compact />
        </div>
      </div>
    </section>
  );
};
