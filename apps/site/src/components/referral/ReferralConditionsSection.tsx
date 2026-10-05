import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { ReferralForm } from '@/components/referral/ReferralForm';
import { referralFormAnchor } from '@/components/referral/referralFormAnchor';

export const ReferralConditionsSection = () => {
  const { t } = useTranslation('referral');

  return (
    <div className={cn('hz-page-container', 'grid items-start gap-10 border-t border-sand-line pb-20 pt-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24 lg:pb-28 lg:pt-20')}>
      <section aria-labelledby="referral-conditions-title" data-reveal className="flex flex-col gap-4 lg:gap-[18px]">
        <h2 id="referral-conditions-title" className="text-[34px] font-medium leading-[1.12] tracking-[-0.045em] lg:text-[48px]">
          {t('conditions.title')}
        </h2>
        <p className="text-[15px] leading-[1.7] text-slate-ink">{t('conditions.text')}</p>
        <div className="flex flex-col gap-3 rounded-md bg-night p-6 text-white lg:mt-4 lg:p-8">
          <p className="text-[13px] text-slate-mist">{t('conditions.contact.question')}</p>
          <p className="text-[17px] font-medium lg:text-lg">
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
      <div id={referralFormAnchor} data-reveal style={revealDelay(1, 120)} className="scroll-mt-32">
        <ReferralForm />
      </div>
    </div>
  );
};
