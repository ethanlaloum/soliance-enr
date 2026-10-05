import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const testimonialKeys = ['solar', 'heatPump', 'evCharger'] as const;

const Stars = ({ label, className }: { label: string; className?: string }) => (
  <span role="img" aria-label={label} className={cn('tracking-[3px] text-solar', className)}>
    ★★★★★
  </span>
);

export const TestimonialsSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="testimonials-title" className={cn(containerClassName, 'flex flex-col gap-10 py-20 lg:gap-16 lg:py-36')}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="testimonials-title" data-reveal-heading className={homeSectionTitleClassName}>
          {t('testimonials.title')}
        </h2>
        <p className="flex items-center gap-3 text-[15px] text-slate-ink">
          <Stars label={t('testimonials.starsLabel')} className="text-xl" />
          {t('testimonials.rating')}
        </p>
      </div>
      <ul className="grid gap-10 lg:grid-cols-3 lg:gap-0">
        {testimonialKeys.map((key) => (
          <li key={key} className="border-t border-sand-border pt-6 lg:border-l lg:border-t-0 lg:px-10 lg:pt-0 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
            <figure className="flex h-full flex-col gap-6">
              <Stars label={t('testimonials.starsLabel')} />
              <blockquote className="text-xl font-light leading-[1.5] tracking-[-0.005em] text-night lg:text-[22px]">{t(`testimonials.${key}.quote`)}</blockquote>
              <figcaption className="mt-auto text-sm font-semibold text-slate-ink">{t(`testimonials.${key}.author`)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
};
