import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { testimonialKeys } from '@/components/home/designs/homeContent';
import { Stars } from '@/components/home/designs/garrigue/GarrigueOrnaments';
import { displayTitleClassName, limeSectionClassName } from '@/components/home/designs/garrigue/garrigueTokens';

export const GarrigueTestimonials = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="testimonials-title" className={limeSectionClassName}>
      <div className={cn(containerClassName, 'flex flex-col gap-10 py-20 lg:gap-16 lg:py-32')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="testimonials-title" data-reveal-heading className={displayTitleClassName}>
            {t('testimonials.title')}
          </h2>
          <p className="flex items-center gap-3 text-[15px] text-[#4A5E52]">
            <Stars label={t('testimonials.starsLabel')} className="text-xl" />
            {t('testimonials.rating')}
          </p>
        </div>
        <ul className="grid gap-10 lg:grid-cols-3 lg:gap-0">
          {testimonialKeys.map((key) => (
            <li
              key={key}
              className="border-t border-[#1E3A2F]/15 pt-7 lg:border-l lg:border-t-0 lg:px-10 lg:pt-0 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <figure className="flex h-full flex-col gap-6">
                <Stars label={t('testimonials.starsLabel')} />
                <blockquote className="g-display g-display-calm text-[22px] font-[360] leading-[1.42] tracking-[-0.005em] text-[#1E3A2F] lg:text-[25px]">
                  {t(`testimonials.${key}.quote`)}
                </blockquote>
                <figcaption className="mt-auto text-sm font-semibold text-[#4A5E52]">{t(`testimonials.${key}.author`)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
