import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { assuranceKeys, valueKeys } from '@/components/home/designs/homeContent';
import { RivieraEyebrow } from '@/components/home/designs/riviera/RivieraEyebrow';
import { rvSectionSpacingClassName, rvTitleClassName } from '@/components/home/designs/riviera/rivieraClassNames';

type AssuranceKey = (typeof assuranceKeys)[number];

const ticketClassNames: Record<AssuranceKey, string> = {
  insurance: 'bg-[#CFE0F5] text-[#0B1F4D] [--rv-stamp:#E07B28]',
  financing: 'bg-[#E07B28] text-[#0B1120] [--rv-stamp:#ffffff]',
};

const colourReturnMotion: MotionSetup = ({ gsap }, root) => {
  const photo = root.querySelector<HTMLElement>('[data-rv-why-photo]');
  const tints = gsap.utils.toArray<HTMLElement>('[data-rv-why-tint]', root);
  if (!photo || tints.length === 0) return;

  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    gsap.fromTo(tints, { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 80%', end: 'bottom 55%', scrub: true } });
  });
};

export const RivieraWhy = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useLazyMotion(sectionRef, colourReturnMotion);

  return (
    <section ref={sectionRef} aria-labelledby="why-title" className="bg-[#1B3FA0] text-white">
      <div className={cn(containerClassName, rvSectionSpacingClassName, 'flex flex-col gap-12 lg:gap-20')}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-6 lg:gap-7">
            <RivieraEyebrow>{t('why.eyebrow')}</RivieraEyebrow>
            <h2 id="why-title" data-reveal-heading className={rvTitleClassName}>
              {t('why.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p className="text-[17px] leading-[1.65] text-[#CFE0F5] lg:text-lg">{t('why.body')}</p>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {valueKeys.map((key) => (
                <li key={key} className="flex flex-col gap-1.5 border-t border-white/25 pt-4">
                  <span className="flex items-center gap-2.5 font-bold text-white">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E07B28]" />
                    {t(`why.values.${key}.title`)}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-[#CFE0F5]">{t(`why.values.${key}.description`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div data-rv-why-photo className="relative isolate aspect-[4/3] overflow-hidden bg-[#0B1F4D] sm:aspect-[2.2/1] lg:col-span-8">
            <img
              src="/images/team-showroom.webp"
              alt={t('why.imageAlt')}
              width={1200}
              height={547}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
            <span data-rv-why-tint aria-hidden="true" className="riviera-tint riviera-tint-hue" />
            <span data-rv-why-tint aria-hidden="true" className="riviera-tint riviera-tint-floor" />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-5">
            {assuranceKeys.map((key) => (
              <div key={key} className={cn('riviera-ticket flex min-h-[112px] flex-col justify-center gap-1.5 py-6 pl-[96px] pr-6 lg:min-h-[132px] lg:gap-2 lg:pr-8', ticketClassNames[key])}>
                <dt className="text-[13px] font-semibold lg:text-sm">{t(`why.${key}.label`)}</dt>
                <dd className="riviera-display text-base font-semibold uppercase leading-snug tracking-[-0.01em] lg:text-lg">{t(`why.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
