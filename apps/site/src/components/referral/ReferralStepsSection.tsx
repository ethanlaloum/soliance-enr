import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';

const stepKeys = ['shareContact', 'callWithin48Hours', 'signAndInstall', 'receiveReward'] as const;

export const ReferralStepsSection = () => {
  const { t } = useTranslation('referral');

  return (
    <section aria-labelledby="referral-steps-title" className={cn('hz-page-container', 'flex flex-col gap-8 pb-16 pt-16 lg:gap-12 lg:pb-24 lg:pt-24')}>
      <h2 id="referral-steps-title" data-reveal className="text-[36px] font-medium leading-[1.12] tracking-[-0.045em] lg:text-[52px]">
        {t('steps.title')}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {stepKeys.map((key, index) => (
          <li
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-5 border-t border-sand-line py-6 lg:pr-6"
          >
            <span aria-hidden="true" className="font-['Fraunces_Variable'] text-[46px] italic font-normal leading-none text-solar lg:text-[56px]">
              {index + 1}
            </span>
            <span className="text-[23px] font-medium leading-snug tracking-[-0.025em]">{t(`steps.items.${key}.title`)}</span>
            <span className="text-sm leading-normal text-slate-ink">{t(`steps.items.${key}.description`)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
