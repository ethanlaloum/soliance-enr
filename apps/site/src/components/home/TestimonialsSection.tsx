import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';

const testimonialKeys = ['solar', 'heatPump', 'evCharger'] as const;

const Stars = ({ label, className }: { label: string; className?: string }) => (
  <span role="img" aria-label={label} className={cn('tracking-[2px] text-solar', className)}>
    ★★★★★
  </span>
);

export const TestimonialsSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="testimonials-title" className={cn(containerClassName, 'flex flex-col gap-6 pb-2 pt-9 lg:gap-8 lg:pb-[72px] lg:pt-[88px]')}>
      <div data-reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="testimonials-title" className={sectionTitleClassName}>
          {t('testimonials.title')}
        </h2>
        <p className="flex items-center gap-2.5 text-[15px] text-slate-ink">
          <Stars label={t('testimonials.starsLabel')} className="text-xl" />
          {t('testimonials.rating')}
        </p>
      </div>
      <ul className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {testimonialKeys.map((key, index) => (
          <li key={key} data-reveal style={revealDelay(index)}>
            <figure className="flex h-full flex-col gap-3 rounded-2xl border border-sand-line bg-white p-6 lg:p-7">
              <Stars label={t('testimonials.starsLabel')} />
              <blockquote className="text-base leading-[1.55] text-slate-text">{t(`testimonials.${key}.quote`)}</blockquote>
              <figcaption className="text-sm font-semibold text-slate">{t(`testimonials.${key}.author`)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
};
