import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const solutions = [
  {
    key: 'solar',
    to: paths.solar,
    image: '/images/solution-solar.webp',
    imageHeight: 507,
    thumbnail: '/images/hero-vence-villa.webp',
    objectPosition: '50% 45%',
    surfaceClassName: 'lg:bg-night',
    accentClassName: 'text-solar',
    descriptionClassName: 'text-slate-light',
  },
  {
    key: 'heatPump',
    to: paths.heatPump,
    image: '/images/solution-heat-pump.webp',
    imageHeight: 900,
    thumbnail: '/images/solution-heat-pump.webp',
    objectPosition: '50% 50%',
    surfaceClassName: 'lg:bg-heat',
    accentClassName: 'text-heat-mist',
    descriptionClassName: 'text-heat-sky',
  },
  {
    key: 'evCharger',
    to: paths.evCharger,
    image: '/images/solution-ev-charger.webp',
    imageHeight: 900,
    thumbnail: '/images/solution-ev-charger-thumb.webp',
    objectPosition: '50% 60%',
    surfaceClassName: 'lg:bg-charge-dark',
    accentClassName: 'text-charge-line',
    descriptionClassName: 'text-charge-soft',
  },
] as const;

const stickyTop = (index: number) => `calc(9vh + ${index * 18}px)`;

const naturalOffsets = (items: HTMLElement[]) =>
  items.reduce<number[]>((offsets, _item, index) => {
    if (index === 0) return [0];
    const previous = items[index - 1];
    const previousSpan = previous.offsetHeight + parseFloat(getComputedStyle(previous).marginBottom);
    return [...offsets, offsets[index - 1] + previousSpan];
  }, []);

const solutionsMotion: MotionSetup = ({ gsap }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    const list = root.querySelector<HTMLElement>('[data-solution-list]');
    if (!desktop || reduceMotion || !list) return;

    const items = gsap.utils.toArray<HTMLElement>('[data-solution-item]', list);
    const offsetAt = (index: number) => naturalOffsets(items)[index];

    items.forEach((item, index) => {
      const card = item.querySelector('[data-solution-card]');
      const media = item.querySelector('[data-solution-media]');
      const shade = item.querySelector('[data-solution-shade]');

      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: () => `top+=${offsetAt(index)} bottom`,
            end: () => `top+=${offsetAt(index) + item.offsetHeight} top`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      const next = items[index + 1];
      if (!next) return;
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: list,
            start: () => `top+=${offsetAt(index + 1)} bottom`,
            end: () => `top+=${offsetAt(index + 1)} ${parseFloat(getComputedStyle(next).top)}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(card, { scale: 0.93 }, 0)
        .to(shade, { opacity: 0.55 }, 0);
    });
  });
};

export const SolutionsSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  useLazyMotion(sectionRef, solutionsMotion);

  return (
    <section ref={sectionRef} aria-labelledby="solutions-title" className={cn(containerClassName, 'flex flex-col gap-6 pb-16 pt-20 lg:gap-16 lg:pb-36 lg:pt-36')}>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id="solutions-title" data-reveal-heading className={cn(homeSectionTitleClassName, 'lg:col-span-6')}>
          {t('solutions.title')}
        </h2>
        <p className="hidden max-w-[520px] text-lg leading-[1.6] text-slate-ink lg:col-span-5 lg:col-start-8 lg:block">{t('solutions.intro')}</p>
      </div>
      <ul data-solution-list className="flex flex-col">
        {solutions.map((solution, index) => (
          <li key={solution.key} data-solution-item className="lg:sticky lg:mb-[14vh] lg:last:mb-0" style={{ top: stickyTop(index) }}>
            <Link
              to={solution.to}
              data-solution-card
              className={cn(
                'group relative flex items-center gap-5 border-b border-sand-line py-5 text-night hover:text-night lg:grid lg:h-[min(78vh,680px)] lg:origin-top lg:grid-cols-[1.15fr_1fr] lg:items-stretch lg:gap-0 lg:overflow-hidden lg:rounded-[28px] lg:border-0 lg:py-0 lg:text-white lg:hover:text-white',
                solution.surfaceClassName,
              )}
            >
              <img
                src={solution.thumbnail}
                alt=""
                width={84}
                height={84}
                loading="lazy"
                className="h-[84px] w-[84px] shrink-0 object-cover [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] lg:hidden"
              />
              <span className="relative hidden overflow-hidden lg:block">
                <span data-solution-media className="absolute inset-x-0 -top-[8%] block h-[116%]">
                  <img
                    src={solution.image}
                    alt={t(`solutions.${solution.key}.imageAlt`)}
                    width={900}
                    height={solution.imageHeight}
                    loading="lazy"
                    style={{ objectPosition: solution.objectPosition }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1 lg:justify-between lg:gap-10 lg:p-12 xl:p-16">
                <span className="flex flex-col gap-1 lg:gap-6">
                  <span className={cn('hidden text-[15px] font-medium lg:block', solution.accentClassName)}>{t(`solutions.${solution.key}.audience`)}</span>
                  <span className="text-xl font-bold tracking-[-0.01em] lg:text-[clamp(2.5rem,3.7vw,3.75rem)] lg:leading-[1.02] lg:tracking-[-0.03em]">
                    {t(`solutions.${solution.key}.title`)}
                  </span>
                  <span className="text-sm text-slate-ink lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                  <span className={cn('hidden max-w-[480px] text-lg font-light leading-[1.65] lg:block', solution.descriptionClassName)}>
                    {t(`solutions.${solution.key}.description`)}
                  </span>
                </span>
                <span aria-hidden="true" className="hidden items-center gap-3 text-lg font-semibold lg:flex">
                  {t('solutions.discover')}{' '}
                  <span className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 motion-reduce:transition-none">→</span>
                </span>
              </span>
              <span data-solution-shade aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-night opacity-0 lg:block" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
