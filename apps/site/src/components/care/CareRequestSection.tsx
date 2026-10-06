import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { config } from '@/config';
import { containerClassName } from '@/components/home/containerClassName';
import { PhoneIcon } from '@/components/icons/Icons';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { PinIcon } from '@/components/care/CareIcons';
import { CareRequestForm } from '@/components/care/CareRequestForm';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careBodyClassName, careEyebrowClassName, careTitleClassName } from '@/components/care/careStyles';

type CareRequestSectionProps = {
  requestType: CareRequestType;
  onRequestTypeChange: (requestType: CareRequestType) => void;
};

export const CareRequestSection = ({ requestType, onRequestTypeChange }: CareRequestSectionProps) => {
  const { t } = useTranslation('care');

  return (
    <section id={careAnchors.request} aria-labelledby="care-request-title" className={cn('bg-care-surface', careSectionScrollClassName)}>
      <div className={cn(containerClassName, 'grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-[88px] desktop:px-20')}>
        <div className="flex flex-col gap-4 lg:gap-5">
          <p className={careEyebrowClassName}>{t('request.eyebrow')}</p>
          <h2 id="care-request-title" className={careTitleClassName}>
            {t('request.title')}
          </h2>
          <p className={careBodyClassName}>{t('request.body')}</p>
          <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-white/70 p-5 lg:mt-4 lg:p-6">
            <p className="text-sm font-bold uppercase tracking-[1px] text-care">{t('request.contactTitle')}</p>
            <a href={config.carePhoneHref} className="flex items-center gap-2.5 text-xl font-bold text-care-ink hover:text-care lg:text-2xl">
              <PhoneIcon className="text-care" />
              {t('request.phone')}
            </a>
            <a href={`mailto:${config.careEmail}`} className="text-[15px] font-semibold text-care hover:text-care-deep">
              {config.careEmail}
            </a>
            <p className="flex items-start gap-2 text-[15px] text-care-muted">
              <PinIcon className="mt-px h-5 w-5 shrink-0 text-care" />
              {t('request.address')}
            </p>
          </div>
        </div>
        <CareRequestForm requestType={requestType} onRequestTypeChange={onRequestTypeChange} />
      </div>
    </section>
  );
};
