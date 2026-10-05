import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { testimonialKeys } from '@/components/home/designs/homeContent';
import { rvTitleClassName } from '@/components/home/designs/riviera/rivieraClassNames';

type TestimonialKey = (typeof testimonialKeys)[number];

const bandClassNames: Record<TestimonialKey, string> = {
  solar: 'border-[#E07B28]',
  heatPump: 'border-[#1B3FA0]',
  evCharger: 'border-[#0B1F4D]',
};

const Stars = ({ label, className }: { label: string; className?: string }) => (
  <span role="img" aria-label={label} className={cn('tracking-[3px]', className)}>
    ★★★★★
  </span>
);

export const RivieraTestimonials = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="testimonials-title" className="bg-[#F1F5FB] text-[#0B1F4D]">
      <div className={cn(containerClassName, 'flex flex-col gap-10 pb-14 pt-20 lg:gap-16 lg:pb-20 lg:pt-32')}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 id="testimonials-title" data-reveal-heading className={rvTitleClassName}>
            {t('testimonials.title')}
          </h2>
          <p className="flex items-center gap-3 self-start rounded-full bg-[#E07B28] px-5 py-2.5 text-[15px] font-semibold text-[#0B1120] lg:self-auto lg:shrink-0">
            <Stars label={t('testimonials.starsLabel')} className="text-lg leading-none" />
            {t('testimonials.rating')}
          </p>
        </div>
        <ul className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {testimonialKeys.map((key) => (
            <li key={key} className={cn('border-t-[6px] bg-white', bandClassNames[key])}>
              <figure className="flex h-full flex-col gap-5 p-7 lg:gap-6 lg:p-9">
                <Stars label={t('testimonials.starsLabel')} className="text-[#1B3FA0]" />
                <blockquote className="text-lg leading-[1.55] text-[#0B1F4D] lg:text-xl">{t(`testimonials.${key}.quote`)}</blockquote>
                <figcaption className="mt-auto text-sm font-semibold text-[#1B3FA0]">{t(`testimonials.${key}.author`)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
