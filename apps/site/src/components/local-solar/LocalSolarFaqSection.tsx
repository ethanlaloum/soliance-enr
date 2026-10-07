import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { localSolarPath, paths } from '@/routes/paths';
import { FaqList } from '@/components/page/FaqList';
import { containerClassName } from '@/components/home/containerClassName';
import { serviceAreas, type ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';
import type { LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';

const faqKeys = ['production', 'permit', 'coverage', 'aids'] as const;

const titleClassName = 'text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]';

type LocalSolarFaqSectionProps = {
  area: ServiceArea;
  values: LocalSolarTextValues;
};

export const LocalSolarFaqSection = ({ area, values }: LocalSolarFaqSectionProps) => {
  const { t } = useTranslation(['localSolar', 'common']);
  const faqItems = faqKeys.map((key) => ({ question: t(`faq.items.${key}.question`, values), answer: t(`faq.items.${key}.answer`, values) }));
  const otherAreas = serviceAreas.filter((other) => other.slug !== area.slug);

  return (
    <div className={cn(containerClassName, 'grid gap-10 pb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14 lg:pb-20')}>
      <section aria-labelledby="local-solar-faq-title" className="flex flex-col gap-5">
        <h2 id="local-solar-faq-title" data-reveal className={titleClassName}>
          {t('faq.title', values)}
        </h2>
        <div data-reveal>
          <FaqList items={faqItems} />
        </div>
      </section>
      <section aria-labelledby="local-solar-around-title" data-reveal className="flex flex-col gap-5">
        <h2 id="local-solar-around-title" className={titleClassName}>
          {t('around.title', values)}
        </h2>
        <p className="text-[15px] leading-[1.6] text-slate-ink lg:text-base">
          {t('around.body', { communes: t(`areas.${area.slug}.communes`) })}
        </p>
        <h3 className="text-lg font-bold">{t('around.otherAreasTitle')}</h3>
        <ul className="flex flex-wrap gap-2.5">
          {otherAreas.map((other) => (
            <li key={other.slug}>
              <Link
                to={localSolarPath(other.slug)}
                className="inline-flex min-h-11 items-center rounded-full border border-sand-line bg-white px-4 text-[15px] font-semibold text-night transition-colors hover:border-solar hover:text-night"
              >
                {t(`common:serviceAreas.${other.slug}`)}
              </Link>
            </li>
          ))}
        </ul>
        <Link to={paths.solar} className="group text-[15px] font-semibold">
          {t('around.allSolar')}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </section>
    </div>
  );
};
