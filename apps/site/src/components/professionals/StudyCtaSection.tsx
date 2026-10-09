import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { professionalStudyAnchor } from '@/components/professionals/professionalStudyAnchor';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

const ctaClassName =
  'flex min-h-[52px] items-center justify-center rounded-[10px] px-6 py-4 text-center text-base font-bold transition-[color,background-color,transform] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:text-[17px]';

export const StudyCtaSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <div className={cn(containerClassName, 'pt-4 lg:pt-6')}>
      <section
        data-reveal
        aria-labelledby="study-cta-title"
        className="grid items-center gap-6 rounded-2xl bg-solar p-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:rounded-3xl lg:px-14 lg:py-12"
      >
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-white lg:text-[13px]">{t('studyCta.eyebrow')}</p>
          <h2 id="study-cta-title" className="text-2xl font-bold leading-tight tracking-[-0.02em] text-white lg:text-[34px]">
            {t('studyCta.title')}
          </h2>
          <p className="text-[15px] leading-[1.55] text-white lg:text-base">{t('studyCta.lead')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <ContactLink kind={ContactFormKind.PROFESSIONAL} href={`#${professionalStudyAnchor}`} className={cn(ctaClassName, 'bg-night text-white hover:bg-night-soft hover:text-white')}>
            {t('studyCta.requestStudy')}
          </ContactLink>
          <a href={config.salesPhoneHref} className={cn(ctaClassName, 'bg-white text-night hover:bg-ivory hover:text-night')}>
            {t('studyCta.callSales')}
          </a>
          <p className="text-center text-[13px] text-white">{t('studyCta.note')}</p>
        </div>
      </section>
    </div>
  );
};
