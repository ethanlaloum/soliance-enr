import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

const stepKeys = ['shareContact', 'callWithin48Hours', 'signAndInstall', 'receiveReward'] as const;

export const ReferralStepsSection = () => {
  const { t } = useTranslation('referral');

  return (
    <section aria-labelledby="referral-steps-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-10 pt-10 lg:gap-8 lg:pb-14 lg:pt-20')}>
      <h2 id="referral-steps-title" data-reveal className="text-[28px] font-bold tracking-[-0.02em] lg:text-[40px]">
        {t('steps.title')}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {stepKeys.map((key, index) => (
          <li
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-2 rounded-2xl border border-sand-line bg-white p-[22px] lg:p-[26px]"
          >
            <span aria-hidden="true" className="text-[30px] font-bold leading-none text-solar lg:text-4xl lg:leading-tight">
              {index + 1}
            </span>
            <span className="text-[17px] font-bold leading-snug lg:text-lg">{t(`steps.items.${key}.title`)}</span>
            <span className="text-sm leading-normal text-slate-ink">{t(`steps.items.${key}.description`)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
