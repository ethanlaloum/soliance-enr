import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { assuranceKeys, valueKeys } from '@/components/home/designs/homeContent';
import { TileMark } from '@/components/home/designs/garrigue/GarrigueOrnaments';
import { deepPineSectionClassName, displayTitleClassName, eyebrowOnDarkClassName } from '@/components/home/designs/garrigue/garrigueTokens';

const whyMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    const dome = root.querySelector<HTMLElement>('[data-g-why-dome]');
    const reveal = root.querySelector<HTMLElement>('[data-g-why-reveal]');
    const image = root.querySelector<HTMLElement>('[data-g-why-image]');
    if (!desktop || reduceMotion || !dome || !reveal || !image) return;

    gsap.fromTo(image, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: dome, start: 'top bottom', end: 'bottom top', scrub: true } });

    if (ScrollTrigger.isInViewport(dome, 0.1)) return;
    gsap
      .timeline({ scrollTrigger: { trigger: dome, start: 'top 80%', once: true } })
      .fromTo(reveal, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .fromTo(reveal, { scale: 1.16, transformOrigin: '50% 100%' }, { scale: 1, duration: 2.1, ease: 'expo.out' }, 0.15);
  });
};

export const GarrigueWhy = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useLazyMotion(sectionRef, whyMotion);

  return (
    <section ref={sectionRef} aria-labelledby="why-title" className={deepPineSectionClassName}>
      <div className={cn(containerClassName, 'flex flex-col gap-14 py-20 lg:gap-20 lg:py-36')}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:col-span-6 lg:gap-7 lg:self-start">
            <p className={eyebrowOnDarkClassName}>
              <TileMark />
              <span>{t('why.eyebrow')}</span>
            </p>
            <h2 id="why-title" data-reveal-heading className={displayTitleClassName}>
              {t('why.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p className="text-[17px] leading-[1.65] text-[#B9C7B0] lg:text-lg">{t('why.body')}</p>
            <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {valueKeys.map((key) => (
                <li key={key} className="flex flex-col gap-2 border-t border-[#B9C7B0]/15 pt-4">
                  <span className="flex items-center gap-3 text-[17px] font-semibold text-[#F4F6F1]">
                    <TileMark />
                    {t(`why.values.${key}.title`)}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-[#B9C7B0]">{t(`why.values.${key}.description`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div data-g-why-dome className="g-dome relative aspect-[4/3] bg-[#1E3A2F] sm:aspect-[2.2/1] lg:col-span-8">
            <div data-g-why-reveal className="absolute inset-0">
              <div data-g-why-image className="absolute inset-x-0 -top-[8%] h-[116%]">
                <img
                  src="/images/team-showroom.webp"
                  alt={t('why.imageAlt')}
                  width={1200}
                  height={547}
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_30%]"
                />
              </div>
            </div>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
            {assuranceKeys.map((key) => (
              <div key={key} className="flex flex-col gap-1.5 rounded-[36px_36px_14px_14px] bg-[#1E3A2F] px-7 pb-6 pt-7 lg:gap-2 lg:px-9 lg:pb-8 lg:pt-9">
                <dt className="text-[13px] text-[#B9C7B0] lg:text-sm">{t(`why.${key}.label`)}</dt>
                <dd className="g-display text-xl font-[480] leading-snug text-[#F4F6F1] lg:text-[24px]">{t(`why.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
