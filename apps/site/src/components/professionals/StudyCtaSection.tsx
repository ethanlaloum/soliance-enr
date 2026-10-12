import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { ArrowUpRightIcon, PhoneIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';
import { professionalStudyAnchor } from '@/components/professionals/professionalStudyAnchor';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

export const StudyCtaSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <div className={cn(containerClassName, 'pt-4 lg:pt-6')}>
      <section
        data-reveal
        aria-labelledby="study-cta-title"
        className="relative isolate grid items-center gap-7 overflow-hidden rounded-lg bg-night p-6 text-ivory lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:px-14 lg:py-14"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_20%,rgba(224,123,40,0.14),transparent_60%)]" />
        <div className="flex flex-col gap-3.5">
          <p className="energy-kicker energy-kicker--dark">{t('studyCta.eyebrow')}</p>
          <h2 id="study-cta-title" className="text-[26px] font-medium leading-[1.12] tracking-[-0.035em] lg:text-[38px]">
            {t('studyCta.title')}
          </h2>
          <p className="max-w-[560px] text-[15px] leading-[1.65] text-slate-light lg:text-base">{t('studyCta.lead')}</p>
        </div>
        <div className="flex flex-col items-start gap-5 lg:border-l lg:border-night-line lg:pl-12">
          <ContactLink kind={ContactFormKind.PROFESSIONAL} href={`#${professionalStudyAnchor}`} className="energy-button energy-button--on-dark w-full sm:w-auto">
            {t('studyCta.requestStudy')}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </ContactLink>
          <a href={config.salesPhoneHref} className="energy-link energy-link--on-dark">
            <PhoneIcon className="h-3.5 w-3.5" />
            {t('studyCta.callSales')}
          </a>
          <p className="text-xs text-slate-mist">{t('studyCta.note')}</p>
        </div>
      </section>
    </div>
  );
};
