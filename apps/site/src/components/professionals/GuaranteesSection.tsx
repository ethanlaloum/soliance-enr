import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';

const guaranteeKeys = ['financing', 'insurance', 'partners'] as const;

export const GuaranteesSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section aria-labelledby="guarantees-title" className={cn(containerClassName, 'pb-14 pt-8 lg:pb-24 lg:pt-6')}>
      <h2 id="guarantees-title" className="sr-only">
        {t('guarantees.title')}
      </h2>
      <dl className="grid border-t border-night lg:grid-cols-3">
        {guaranteeKeys.map((key, index) => (
          <div
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-2 border-sand-line py-5 [&:not(:first-child)]:border-t lg:px-7 lg:py-7 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
          >
            <dt className="energy-kicker">{t(`guarantees.${key}.label`)}</dt>
            <dd className="text-base font-medium leading-snug tracking-[-0.01em] lg:text-[17px]">{t(`guarantees.${key}.value`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
