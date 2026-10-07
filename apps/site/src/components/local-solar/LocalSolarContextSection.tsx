import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import type { ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';
import type { LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';

type LocalSolarContextSectionProps = {
  area: ServiceArea;
  values: LocalSolarTextValues;
};

export const LocalSolarContextSection = ({ area, values }: LocalSolarContextSectionProps) => {
  const { t } = useTranslation('localSolar');
  const items = [
    { key: 'permit', description: t('context.permit.description', values) },
    { key: 'heritage', description: t(`areas.${area.slug}.heritage`, values) },
    { key: 'team', description: t('context.team.description', values) },
  ];

  return (
    <section aria-labelledby="local-solar-context-title" className={cn(containerClassName, 'flex flex-col gap-6 pb-10 lg:gap-8 lg:pb-20')}>
      <h2 id="local-solar-context-title" data-reveal className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">
        {t('context.title', values)}
      </h2>
      <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {items.map((item, index) => (
          <li key={item.key} data-reveal style={revealDelay(index)} className="rounded-2xl border border-sand-line bg-white p-5 lg:p-7">
            <h3 className="text-lg font-bold lg:text-xl">{t(`context.${item.key}.title`, values)}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-slate-ink">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
