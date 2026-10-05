import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { contactAnchor } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { containerClassName } from '@/components/home/containerClassName';
import { homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const rowClassName = 'border-t border-sand-line py-4 first:border-t-0 first:pt-0';
const linkClassName = 'whitespace-nowrap font-medium text-night underline decoration-sand-border underline-offset-4 hover:text-night hover:decoration-solar';

const ShowroomMark = () => (
  <svg aria-hidden="true" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
    <g fill="none" stroke="currentColor" strokeWidth="1" className="text-white/[0.14]" vectorEffect="non-scaling-stroke">
      <circle cx="300" cy="96" r="54" />
      <circle cx="300" cy="96" r="96" />
      <circle cx="300" cy="96" r="150" />
    </g>
    <rect x="290" y="86" width="20" height="20" transform="rotate(45 300 96)" className="fill-solar" />
    <circle cx="300" cy="96" r="4" className="fill-night" />
  </svg>
);

export const ContactSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id={contactAnchor}
      aria-labelledby="contact-title"
      className={cn(containerClassName, 'grid scroll-mt-6 gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-36')}
    >
      <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
        <h2 id="contact-title" data-reveal-heading className={homeSectionTitleClassName}>
          {t('contact.title')}
        </h2>
        <p className="text-[17px] leading-[1.6] text-slate-text lg:text-lg">{t('contact.lead')}</p>
        <dl className="flex flex-col text-[15px] leading-[1.6] text-slate-text lg:text-base">
          <div className={rowClassName}>
            <dt className="inline font-semibold text-night">{t('contact.showroom.label')}</dt> — <dd className="inline">{t('contact.showroom.value')}</dd>
          </div>
          <div className={rowClassName}>
            <dt className="inline font-semibold text-night">{t('contact.sales.label')}</dt> —{' '}
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
            <dt className="inline font-semibold text-night">{t('contact.admin.label')}</dt> —{' '}
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
            <dt className="inline font-semibold text-night">{t('contact.hours.label')}</dt> — <dd className="inline">{t('contact.hours.value')}</dd>
          </div>
        </dl>
        <a
          href={config.showroomMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-[180px] items-end overflow-hidden rounded-[20px] bg-night p-6 text-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar lg:h-[220px] lg:rounded-[24px] lg:p-8"
        >
          <ShowroomMark />
          <span className="relative max-w-[60%] text-[17px] font-semibold underline decoration-white/30 underline-offset-[6px] transition-colors group-hover:decoration-solar">
            {t('contact.mapLink')}
          </span>
        </a>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <StudyRequestForm />
      </div>
    </section>
  );
};
