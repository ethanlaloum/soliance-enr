import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FaqList } from '@/components/page/FaqList';
import { containerClassName } from '@/components/home/containerClassName';

export const aidSectionId = 'aides';

const columnKeys = ['equipment', 'maPrimeRenov', 'cee'] as const;

const eligibilityColumnKeys = ['maPrimeRenov', 'cee'] as const;

const aidRows = [
  { key: 'airToWater', eligibility: { maPrimeRenov: true, cee: true } },
  { key: 'waterHeater', eligibility: { maPrimeRenov: true, cee: true } },
  { key: 'airToAir', eligibility: { maPrimeRenov: false, cee: true } },
] as const;

const faqKeys = ['choice', 'cold', 'solar', 'maintenance', 'timeline'] as const;

const headingClassName = 'text-[26px] font-bold tracking-[-0.02em] lg:text-4xl';

export const HeatPumpAidSection = () => {
  const { t } = useTranslation('heatPump');
  const faqItems = faqKeys.map((key) => ({ question: t(`faq.items.${key}.question`), answer: t(`faq.items.${key}.answer`) }));

  return (
    <div className={cn(containerClassName, 'grid gap-12 pb-4 pt-12 lg:grid-cols-2 lg:gap-14 lg:pb-16 lg:pt-[88px]')}>
      <section id={aidSectionId} aria-labelledby="heat-pump-aid-title" data-reveal className="flex scroll-mt-6 flex-col gap-4 lg:gap-5">
        <h2 id="heat-pump-aid-title" className={headingClassName}>
          {t('aid.title')}
        </h2>
        <p className="text-[15px] leading-[1.55] text-slate-ink lg:text-base">{t('aid.intro')}</p>
        <div className="overflow-hidden rounded-[14px] border border-heat-line bg-white">
          <table aria-labelledby="heat-pump-aid-title" className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[31%]" />
              <col className="w-[31%]" />
            </colgroup>
            <thead className="bg-heat text-white">
              <tr>
                {columnKeys.map((columnKey) => (
                  <th key={columnKey} scope="col" className="px-3 py-3 text-[13px] font-bold lg:px-[18px] lg:text-sm">
                    {t(`aid.columns.${columnKey}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aidRows.map((row, index) => (
                <tr key={row.key} className={cn('border-b border-heat-soft last:border-b-0', index % 2 === 1 && 'bg-heat-surface')}>
                  <th scope="row" className="px-3 py-3 text-sm font-normal lg:px-[18px] lg:text-[15px]">
                    {t(`aid.rows.${row.key}.equipment`)}
                  </th>
                  {eligibilityColumnKeys.map((columnKey) => (
                    <td
                      key={columnKey}
                      className={cn('px-3 py-3 text-sm lg:px-[18px] lg:text-[15px]', row.eligibility[columnKey] ? 'font-bold text-heat' : 'text-slate')}
                    >
                      {t(`aid.rows.${row.key}.${columnKey}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] leading-normal text-slate">{t('aid.note')}</p>
      </section>
      <section aria-labelledby="heat-pump-faq-title" data-reveal className="flex flex-col gap-4 lg:gap-5">
        <h2 id="heat-pump-faq-title" className={headingClassName}>
          {t('faq.title')}
        </h2>
        <FaqList items={faqItems} accentClassName="text-heat" className="border-heat-line divide-heat-line" />
      </section>
    </div>
  );
};
