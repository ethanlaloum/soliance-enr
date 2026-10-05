import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { testimonialKeys } from '@/components/home/designs/homeContent';
import { ModuleStars } from '@/components/home/designs/module/ModuleParts';
import { titleXLClassName } from '@/components/home/designs/module/moduleClassNames';

export const ModuleTestimonials = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="testimonials-title" className="bg-[#EEF1F4] text-[#14181D]">
      <div className={cn(containerClassName, 'flex flex-col gap-10 pb-6 pt-20 lg:gap-14 lg:pb-8 lg:pt-32')}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 id="testimonials-title" data-reveal-heading className={titleXLClassName}>
            {t('testimonials.title')}
          </h2>
          <p className="flex items-center gap-3 text-[15px] font-medium text-[#4A535E] lg:pb-2">
            <ModuleStars label={t('testimonials.starsLabel')} className="px-2.5 py-2 text-base" />
            {t('testimonials.rating')}
          </p>
        </div>
        <ul className="grid gap-[2px] rounded-[4px] bg-[#C9D1DA] p-[2px] lg:grid-cols-3">
          {testimonialKeys.map((key) => (
            <li key={key} className="bg-white">
              <figure className="flex h-full flex-col gap-6 p-7 lg:gap-8 lg:p-10">
                <ModuleStars label={t('testimonials.starsLabel')} className="self-start" />
                <blockquote className="text-xl font-medium leading-[1.45] tracking-[-0.012em] text-[#14181D] lg:text-[22px]">{t(`testimonials.${key}.quote`)}</blockquote>
                <figcaption className="mt-auto border-t border-[#C9D1DA] pt-4 text-sm font-semibold text-[#4A535E]">{t(`testimonials.${key}.author`)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
