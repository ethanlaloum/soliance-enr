import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { SplitWords } from '@/components/home/SplitWords';
import { useMagnetic } from '@/components/home/useMagnetic';
import { heroImage, statKeys, trustKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { TileFrieze, TileMark } from '@/components/home/designs/garrigue/GarrigueOrnaments';
import { ghostCtaClassName, pineSectionClassName, primaryCtaClassName } from '@/components/home/designs/garrigue/garrigueTokens';

const heroMotion: MotionSetup = ({ gsap }, root) => {
  const arch = root.querySelector<HTMLElement>('[data-g-hero-arch]');
  const photo = root.querySelector<HTMLElement>('[data-g-hero-photo]');
  if (!arch || !photo) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (!desktop || reduceMotion) return;

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'clamp(top bottom)', end: 'bottom top', scrub: 0.5 },
      })
      .fromTo(arch, { scale: 1, transformOrigin: '50% 100%' }, { scale: 1.1 }, 0)
      .fromTo(photo, { yPercent: 0 }, { yPercent: 9 }, 0);
  });
};

const HeroFigures = ({ compact }: { compact?: boolean }) => {
  const { t } = useTranslation('home');

  return (
    <dl aria-label={t('hero.statsLabel')} className={cn('grid-cols-3', compact ? 'grid gap-3 lg:hidden' : 'hero-fade hidden gap-8 [--fade-delay:1.25s] lg:grid')}>
      {statKeys.map((key) => (
        <div
          key={key}
          className={cn('flex flex-col-reverse justify-end border-l border-[#B9C7B0]/20 first:border-l-0 first:pl-0', compact ? 'gap-1.5 pl-3' : 'gap-3 pl-8')}
        >
          <dt className={cn('leading-snug text-[#B9C7B0]', compact ? 'text-xs' : 'max-w-[260px] text-[15px]')}>
            {t(compact ? `hero.stats.${key}.labelShort` : `hero.stats.${key}.label`)}
          </dt>
          <dd
            className={cn(
              'g-display font-[520] leading-none tracking-[-0.02em] text-[#E07B28] lining-nums',
              compact ? 'text-[30px]' : 'text-[clamp(3rem,4.8vw,5rem)]',
            )}
          >
            {t(`hero.stats.${key}.value`)}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export const GarrigueHero = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const title = t('hero.title');

  useMagnetic(sectionRef);
  useLazyMotion(sectionRef, heroMotion);

  return (
    <section ref={sectionRef} className={cn(pineSectionClassName, 'relative overflow-hidden')}>
      <div className={cn(containerClassName, 'grid gap-12 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-14')}>
        <div className="flex flex-col gap-6 lg:col-span-7 lg:gap-8 lg:pb-14">
          <p className="hero-fade flex items-center gap-3 text-sm font-medium text-[#B9C7B0] [--fade-delay:0.1s] lg:text-[15px]">
            <TileMark />
            <span>
              <Responsive mobile={t('hero.eyebrowShort')} desktop={t('hero.eyebrow')} />
            </span>
          </p>
          <h1 aria-label={title} className="g-display [text-wrap:balance] text-[clamp(2.75rem,6.4vw,6.75rem)] font-[420] leading-[0.94] tracking-[-0.03em]">
            <SplitWords text={title} />
          </h1>
          <p className="hero-fade max-w-[600px] text-[17px] leading-[1.6] text-[#B9C7B0] [--fade-delay:0.55s] lg:text-lg">
            <Responsive mobile={t('hero.leadShort')} desktop={t('hero.lead')} />
          </p>
          <div className="hero-fade flex flex-col gap-3 [--fade-delay:0.7s] sm:flex-row sm:flex-wrap">
            <Link data-magnetic to={paths.simulator} className={primaryCtaClassName}>
              {t('hero.simulate')}
            </Link>
            <a data-magnetic href={`#${contactAnchor}`} className={ghostCtaClassName}>
              {t('hero.requestStudy')}
            </a>
          </div>
          <ul aria-label={t('hero.trustLabel')} className="hero-fade flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-[#B9C7B0] [--fade-delay:0.85s] lg:text-sm">
            {trustKeys.map((key) => (
              <li key={key} className="flex items-center gap-2.5">
                <TileMark />
                {t(`hero.trust.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative w-full max-w-[420px] lg:h-full lg:max-w-[460px]">
            <span
              aria-hidden="true"
              className="g-hero-embrasure absolute -left-3 -top-3 bottom-0 right-3 rounded-t-full border border-b-0 border-[#B9C7B0]/30 lg:-left-6 lg:-top-6 lg:right-6"
            />
            <div data-g-hero-arch className="g-arch g-hero-arch relative aspect-[10/11] w-full bg-[#142921] lg:aspect-auto lg:h-full lg:min-h-[440px]">
              <div data-g-hero-photo className="absolute inset-x-0 -top-[12%] h-[124%]">
                <img
                  src={heroImage.src}
                  alt={t('hero.imageAlt')}
                  width={heroImage.width}
                  height={heroImage.height}
                  fetchPriority="high"
                  className="g-hero-zoom h-full w-full object-cover object-[38%_50%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TileFrieze variant="genoise" className="g-frieze-intro" />

      <div className={cn(containerClassName, 'pb-12 pt-8 lg:pb-20 lg:pt-12')}>
        <HeroFigures />
        <HeroFigures compact />
      </div>
    </section>
  );
};
