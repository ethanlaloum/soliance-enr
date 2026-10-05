import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { CheckIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';
import { Eyebrow } from '@/components/home/Eyebrow';
import { SplitWords } from '@/components/home/SplitWords';
import { ctaClassName, ctaGhostClassName } from '@/components/home/homeClassNames';
import { useMagnetic } from '@/components/home/useMagnetic';

const trustKeys = ['rge', 'decennial', 'installation', 'localTeam'] as const;
const statKeys = ['installations', 'signature', 'maintenance'] as const;

const roofOriginY = 0.5;
const bandRadiusPx = 28;

const bandInset = (frame: HTMLElement, band: HTMLElement) => {
  const frameBox = frame.getBoundingClientRect();
  const bandBox = band.getBoundingClientRect();
  return `inset(${bandBox.top - frameBox.top}px ${frameBox.right - bandBox.right}px ${frameBox.bottom - bandBox.bottom}px ${bandBox.left - frameBox.left}px round ${bandRadiusPx}px)`;
};

const roofOffsetY = (frame: HTMLElement, band: HTMLElement) => {
  const frameBox = frame.getBoundingClientRect();
  const bandBox = band.getBoundingClientRect();
  return bandBox.top - frameBox.top + bandBox.height / 2 - frameBox.height * roofOriginY;
};

const heroMotion: MotionSetup = ({ gsap }, root) => {
  const pick = (selector: string) => root.querySelector<HTMLElement>(selector);
  const stage = pick('[data-hero-stage]');
  const copy = pick('[data-hero-copy]');
  const frame = pick('[data-hero-frame]');
  const band = pick('[data-hero-band]');
  const image = pick('[data-hero-image]');
  if (!stage || !copy || !frame || !band || !image) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (reduceMotion) return;

    if (!desktop) {
      gsap.fromTo(image, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
      return;
    }

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: () => (stage.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
          end: '+=120%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(frame, { clipPath: () => bandInset(frame, band) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
      .fromTo(image, { y: () => roofOffsetY(frame, band), transformOrigin: `50% ${roofOriginY * 100}%` }, { y: 0, ease: 'power2.inOut', duration: 1 }, 0)
      .to(copy, { yPercent: -14, autoAlpha: 0, ease: 'power2.in', duration: 0.5 }, 0)
      .to({}, { duration: 0.25 });
  });
};

const KeyFigures = ({ compact, className }: { compact?: boolean; className?: string }) => {
  const { t } = useTranslation('home');

  return (
    <dl aria-label={t('hero.statsLabel')} className={cn('grid grid-cols-3', className)}>
      {statKeys.map((key) => (
        <div key={key} className="flex flex-col-reverse justify-end gap-1.5 border-l border-white/20 pl-3.5 first:border-l-0 first:pl-0 lg:gap-2 lg:pl-8">
          <dt className="text-xs leading-snug text-slate-light lg:max-w-[240px] lg:text-[15px] lg:text-white/85">
            {t(compact ? `hero.stats.${key}.labelShort` : `hero.stats.${key}.label`)}
          </dt>
          <dd className="text-[28px] font-bold leading-none tracking-[-0.03em] text-solar lg:text-[clamp(2.5rem,3.6vw,3.5rem)]">
            {t(`hero.stats.${key}.value`)}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export const HeroSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const title = t('hero.title');

  useMagnetic(sectionRef);
  useLazyMotion(sectionRef, heroMotion);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-night text-white">
      <div data-hero-stage className="hero-stage relative flex flex-col">
        <div className={cn(containerClassName, 'hero-copy-region relative z-10 pb-10 pt-9 lg:flex lg:items-center lg:pt-10')}>
          <div data-hero-copy className="flex w-full flex-col gap-5 lg:gap-8">
            <Eyebrow className="hero-fade [--fade-delay:0.1s]">
              <span className="lg:hidden">{t('hero.eyebrowShort')}</span>
              <span className="hidden lg:inline">{t('hero.eyebrow')}</span>
            </Eyebrow>
            <h1 aria-label={title} className="[text-wrap:balance] text-[clamp(2.75rem,min(7.6vw,12vh),7.5rem)] font-bold leading-[0.96] tracking-[-0.042em]">
              <SplitWords text={title} />
            </h1>
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
              <p className="hero-fade text-[17px] font-light leading-[1.6] text-slate-light [--fade-delay:0.55s] lg:col-span-6 lg:max-w-[620px] lg:leading-[1.55]">
                <span className="lg:hidden">{t('hero.leadShort')}</span>
                <span className="hidden lg:inline">{t('hero.lead')}</span>
              </p>
              <div className="flex flex-col gap-5 lg:col-span-6 lg:items-end">
                <div className="hero-fade flex flex-col gap-3 [--fade-delay:0.7s] sm:flex-row sm:flex-wrap">
                  <Link data-magnetic to={paths.simulator} className={ctaClassName}>
                    {t('hero.simulate')}
                  </Link>
                  <a data-magnetic href={`#${contactAnchor}`} className={ctaGhostClassName}>
                    {t('hero.requestStudy')}
                  </a>
                </div>
                <ul aria-label={t('hero.trustLabel')} className="hero-fade flex flex-wrap gap-x-6 gap-y-2.5 text-[13px] text-slate-light [--fade-delay:0.85s] lg:justify-end lg:text-sm">
                  {trustKeys.map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <CheckIcon className="shrink-0 text-solar" />
                      {t(`hero.trust.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual relative mx-5 aspect-[4/3] sm:aspect-[16/9] lg:static lg:mx-0 lg:aspect-auto">
          <div data-hero-frame className="hero-frame absolute inset-0 overflow-hidden">
            <div className="hero-frame-zoom absolute inset-0">
              <img
                data-hero-image
                src="/images/hero-villa-contemporaine.jpg"
                alt={t('hero.imageAlt')}
                width={1280}
                height={720}
                fetchPriority="high"
                className="hero-image absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[55%] bg-gradient-to-t from-night/90 via-night/40 to-transparent lg:block" />
          </div>
          <span data-hero-band aria-hidden="true" className="hero-band" />
          <div data-hero-figures className="hero-figures absolute z-10 hidden lg:block">
            <KeyFigures />
          </div>
        </div>

        <div className="relative z-10 px-5 pb-12 pt-8 lg:hidden">
          <KeyFigures compact />
        </div>
      </div>
    </section>
  );
};
