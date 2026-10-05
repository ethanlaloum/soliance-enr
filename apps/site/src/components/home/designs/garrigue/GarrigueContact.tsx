import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { contactAnchor } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { TileFrieze } from '@/components/home/designs/garrigue/GarrigueOrnaments';
import { displayTitleClassName, focusOnDarkClassName, leadOnDarkClassName, pineSectionClassName } from '@/components/home/designs/garrigue/garrigueTokens';

const rowClassName = 'border-t border-[#B9C7B0]/15 py-4 first:border-t-0 first:pt-0';
const termClassName = 'inline font-semibold text-[#F4F6F1]';
const linkClassName = cn(
  'whitespace-nowrap rounded-sm font-medium text-[#F4F6F1] underline decoration-[#E07B28]/50 underline-offset-4 hover:text-[#F4F6F1] hover:decoration-[#E07B28]',
  focusOnDarkClassName,
);
const formCardClassName = 'g-form-card flex flex-col gap-4 bg-[#F4F6F1] px-6 pb-7 pt-16 text-[#1E3A2F] sm:px-8 lg:gap-5 lg:px-12 lg:pb-12 lg:pt-24';
const formTitleClassName = 'g-display text-center text-[26px] font-[480] leading-tight tracking-[-0.015em] text-[#1E3A2F] [text-wrap:balance] lg:text-[32px]';
const formSubmitClassName =
  'mt-1 rounded-[28px_28px_8px_8px] bg-[#E07B28] text-[#0B1120] hover:bg-[#1E3A2F] hover:text-[#F4F6F1] focus-visible:outline-offset-4 focus-visible:outline-[#1E3A2F]';

const ShowroomArches = () => (
  <svg aria-hidden="true" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
    <g fill="none" stroke="#B9C7B0" strokeOpacity="0.2" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <path d="M260 220V130a40 40 0 0 1 80 0v90" />
      <path d="M230 220V130a70 70 0 0 1 140 0v90" />
      <path d="M200 220V130a100 100 0 0 1 200 0v90" />
    </g>
    <path d="M285 220v-78a15 15 0 0 1 30 0v78z" fill="#C4673A" />
  </svg>
);

export const GarrigueContact = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section ref={sectionRef} id={contactAnchor} aria-labelledby="contact-title" className={cn(pineSectionClassName, 'relative scroll-mt-6 overflow-hidden')}>
      <TileFrieze variant="eave" />
      <div className={cn(containerClassName, 'grid gap-12 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-28')}>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
          <h2 id="contact-title" data-reveal-heading className={displayTitleClassName}>
            {t('contact.title')}
          </h2>
          <p className={leadOnDarkClassName}>{t('contact.lead')}</p>
          <dl className="flex flex-col text-[15px] leading-[1.6] text-[#B9C7B0] lg:text-base">
            <div className={rowClassName}>
              <dt className={termClassName}>{t('contact.showroom.label')}</dt> — <dd className="inline">{t('contact.showroom.value')}</dd>
            </div>
            <div className={rowClassName}>
              <dt className={termClassName}>{t('contact.sales.label')}</dt> —{' '}
              <dd className="inline">
                <a href={`mailto:${t('contact.sales.email')}`} className={linkClassName}>
                  {t('contact.sales.email')}
                </a>{' '}
                ·{' '}
                <a href={config.salesPhoneHref} className={linkClassName}>
                  {t('contact.sales.phone')}
                </a>
              </dd>
            </div>
            <div className={rowClassName}>
              <dt className={termClassName}>{t('contact.admin.label')}</dt> —{' '}
              <dd className="inline">
                <a href={`mailto:${t('contact.admin.email')}`} className={linkClassName}>
                  {t('contact.admin.email')}
                </a>{' '}
                ·{' '}
                <a href={config.adminPhoneHref} className={linkClassName}>
                  {t('contact.admin.phone')}
                </a>
              </dd>
            </div>
            <div className={rowClassName}>
              <dt className={termClassName}>{t('contact.hours.label')}</dt> — <dd className="inline">{t('contact.hours.value')}</dd>
            </div>
          </dl>
          <a
            href={config.showroomMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group relative flex h-[180px] items-end overflow-hidden rounded-[40px_40px_16px_16px] bg-[#142921] p-6 text-[#F4F6F1] hover:text-[#F4F6F1] lg:h-[220px] lg:rounded-[56px_56px_20px_20px] lg:p-8',
              focusOnDarkClassName,
            )}
          >
            <ShowroomArches />
            <span className="relative max-w-[60%] text-[17px] font-semibold underline decoration-[#F4F6F1]/30 underline-offset-[6px] transition-colors group-hover:decoration-[#E07B28]">
              {t('contact.mapLink')}
            </span>
          </a>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <StudyRequestForm cardClassName={formCardClassName} titleClassName={formTitleClassName} submitClassName={formSubmitClassName} />
        </div>
      </div>
    </section>
  );
};
