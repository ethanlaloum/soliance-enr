import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { FaqList } from '@/components/page/FaqList';
import { containerClassName } from '@/components/home/containerClassName';

const aidKeys = ['selfConsumptionBonus', 'surplus', 'vatRefund'] as const;
const faqKeys = ['roof', 'connection', 'installer', 'breakdown', 'financing'] as const;

const titleClassName = 'text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]';

export const SolarAidsAndFaqSection = () => {
  const { t } = useTranslation('solar');
  const faqItems = faqKeys.map((key) => ({ question: t(`faq.items.${key}.question`), answer: t(`faq.items.${key}.answer`) }));

  return (
    <div className={cn(containerClassName, 'grid gap-10 pb-10 pt-12 lg:grid-cols-2 lg:gap-14 lg:pb-16 lg:pt-20')}>
      <section aria-labelledby="solar-aids-title" className="flex flex-col gap-5">
        <h2 id="solar-aids-title" data-reveal className={titleClassName}>
          {t('aids.title')}
        </h2>
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            {aidKeys.map((key, index) => (
              <li key={key} data-reveal style={revealDelay(index)} className="rounded-xl border border-sand-line bg-white px-5 py-[18px]">
                <h3 className="text-base font-bold">{t(`aids.items.${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-normal text-slate-ink">{t(`aids.items.${key}.description`)}</p>
              </li>
            ))}
          </ul>
          <div data-reveal style={revealDelay(aidKeys.length)} className="rounded-xl bg-[#fff4ea] px-5 py-[18px]">
            <p className="font-bold text-[#7a3a0c]">{t('aids.notice.title')}</p>
            <p className="mt-1 text-sm leading-normal text-[#5b3a20]">{t('aids.notice.description')}</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="solar-faq-title" className="flex flex-col gap-5">
        <h2 id="solar-faq-title" data-reveal className={titleClassName}>
          {t('faq.title')}
        </h2>
        <div data-reveal>
          <FaqList items={faqItems} />
        </div>
      </section>
    </div>
  );
};
