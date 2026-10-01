import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { ReferralForm } from '@/components/referral/ReferralForm';
import { referralFormAnchor } from '@/components/referral/referralFormAnchor';

export const ReferralConditionsSection = () => {
  const { t } = useTranslation('referral');

  return (
    <div className={cn(containerClassName, 'grid items-start gap-8 pb-12 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:pb-16')}>
      <section aria-labelledby="referral-conditions-title" data-reveal className="flex flex-col gap-4 lg:gap-[18px]">
        <h2 id="referral-conditions-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[34px]">
          {t('conditions.title')}
        </h2>
        <p className="text-[15px] leading-[1.7] text-slate-ink">{t('conditions.text')}</p>
        <div className="flex flex-col gap-1.5 rounded-[14px] bg-night p-5 text-white lg:p-[22px]">
          <p className="text-[13px] text-slate-mist">{t('conditions.contact.question')}</p>
          <p className="text-[17px] font-bold lg:text-lg">
            {t('conditions.contact.phoneLabel')}{' '}
            <a href={config.referralPhoneHref} className="whitespace-nowrap text-white hover:text-solar">
              {t('conditions.contact.phone')}
            </a>
          </p>
          <a href={`mailto:${t('conditions.contact.email')}`} className="self-start text-sm text-slate-light hover:text-white">
            {t('conditions.contact.email')}
          </a>
        </div>
      </section>
      <div id={referralFormAnchor} data-reveal style={revealDelay(1, 120)} className="scroll-mt-6">
        <ReferralForm />
      </div>
    </div>
  );
};
