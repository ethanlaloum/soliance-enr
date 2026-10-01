import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { FaqList } from '@/components/page/FaqList';
import { containerClassName } from '@/components/home/containerClassName';

const aidKeys = ['taxCredit', 'reducedVat', 'advenir', 'rightToPlug'] as const;
const faqKeys = ['reinforcedSocket', 'subscription', 'timeline', 'compatibility', 'condominium'] as const;

const titleClassName = 'text-[26px] font-bold tracking-[-0.02em] lg:text-[36px]';

export const AidsAndFaqSection = () => {
  const { t } = useTranslation('evCharger');
  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  return (
    <div className={cn(containerClassName, 'grid gap-12 pb-12 pt-14 lg:grid-cols-2 lg:gap-14 lg:pb-16 lg:pt-[88px]')}>
      <section aria-labelledby="aids-title" className="flex flex-col gap-5">
        <h2 id="aids-title" data-reveal className={titleClassName}>
          {t('aids.title')}
        </h2>
        <ul className="flex flex-col gap-3">
          {aidKeys.map((key, index) => (
            <li key={key} data-reveal style={revealDelay(index)} className="rounded-xl bg-charge-surface px-5 py-[18px]">
              <h3 className="font-bold text-charge-dark">{t(`aids.items.${key}.title`)}</h3>
              <p className="mt-1 text-sm leading-normal text-slate-text">{t(`aids.items.${key}.description`)}</p>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="faq-title" className="flex flex-col gap-5">
        <h2 id="faq-title" data-reveal className={titleClassName}>
          {t('faq.title')}
        </h2>
        <div data-reveal style={revealDelay(1)}>
          <FaqList items={faqItems} accentClassName="text-charge" className="divide-charge-line border-charge-line" />
        </div>
      </section>
    </div>
  );
};
