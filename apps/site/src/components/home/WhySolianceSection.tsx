import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { Eyebrow } from '@/components/home/Eyebrow';
import { homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const valueKeys = ['trust', 'transparency', 'expertise', 'proximity'] as const;
const assuranceKeys = ['insurance', 'financing'] as const;
const slatCount = 6;

const whyMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    const photo = root.querySelector<HTMLElement>('[data-why-photo]');
    const image = root.querySelector<HTMLElement>('[data-why-image]');
    const slats = gsap.utils.toArray<HTMLElement>('[data-why-slat]', root);
    if (!photo || !image) return;

    gsap.fromTo(image, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (ScrollTrigger.isInViewport(photo, 0.1)) return;
    gsap.fromTo(
      slats,
      { scaleY: 1, autoAlpha: 1 },
      { scaleY: 0, duration: 1.1, ease: 'power3.inOut', stagger: { each: 0.08, from: 'end' }, scrollTrigger: { trigger: photo, start: 'top 78%', once: true } },
    );
  });
};

export const WhySolianceSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  useLazyMotion(sectionRef, whyMotion);

  return (
    <section ref={sectionRef} aria-labelledby="why-title" className="bg-white">
      <div className={cn(containerClassName, 'flex flex-col gap-12 py-20 lg:gap-20 lg:py-36')}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-6 lg:gap-7">
            <Eyebrow tone="onLight">{t('why.eyebrow')}</Eyebrow>
            <h2 id="why-title" data-reveal-heading className={homeSectionTitleClassName}>
              {t('why.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p className="text-[17px] leading-[1.65] text-slate-text lg:text-lg">{t('why.body')}</p>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {valueKeys.map((key) => (
                <li key={key} className="flex flex-col gap-1.5 border-t border-sand-line pt-4">
                  <span className="flex items-center gap-2.5 font-bold">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-solar" />
                    {t(`why.values.${key}.title`)}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-slate-ink">{t(`why.values.${key}.description`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div data-why-photo className="relative aspect-[4/3] overflow-hidden rounded-[20px] sm:aspect-[2.2/1] lg:col-span-8 lg:rounded-[28px]">
            <div data-why-image className="absolute inset-x-0 -top-[8%] h-[116%]">
              <img
                src="/images/team-showroom.webp"
                alt={t('why.imageAlt')}
                width={1200}
                height={547}
                loading="lazy"
                className="h-full w-full object-cover object-[50%_30%]"
              />
            </div>
            <span aria-hidden="true" className="absolute inset-0 flex flex-col">
              {Array.from({ length: slatCount }, (_, index) => (
                <span key={index} data-why-slat className="invisible block flex-1 origin-top bg-white" />
              ))}
            </span>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
            {assuranceKeys.map((key) => (
              <div key={key} className="flex flex-col gap-1.5 rounded-[16px] bg-night px-6 py-5 text-white lg:gap-2 lg:rounded-[20px] lg:px-8 lg:py-8">
                <dt className="text-[13px] text-slate-light lg:text-sm">{t(`why.${key}.label`)}</dt>
                <dd className="text-lg font-bold lg:text-[22px] lg:leading-snug">{t(`why.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
