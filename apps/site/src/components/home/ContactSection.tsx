import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { contactAnchor } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { containerClassName } from '@/components/home/containerClassName';

export const ContactSection = () => {
  const { t } = useTranslation('home');

  return (
    <section
      id={contactAnchor}
      aria-labelledby="contact-title"
      className={cn(containerClassName, 'grid scroll-mt-6 gap-8 pb-6 pt-9 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:pb-[72px] lg:pt-[88px]')}
    >
      <div data-reveal className="flex flex-col gap-4">
        <h2 id="contact-title" className="text-[28px] font-bold tracking-[-0.02em] lg:text-[40px]">
          {t('contact.title')}
        </h2>
        <p className="text-base leading-[1.55] text-slate-ink lg:text-[17px]">{t('contact.lead')}</p>
        <dl className="mt-2 flex flex-col gap-2.5 text-[15px] lg:text-base">
          <div>
            <dt className="inline font-bold">{t('contact.showroom.label')}</dt> — <dd className="inline">{t('contact.showroom.value')}</dd>
          </div>
          <div>
            <dt className="inline font-bold">{t('contact.sales.label')}</dt> —{' '}
            <dd className="inline">
              <a href={`mailto:${t('contact.sales.email')}`}>{t('contact.sales.email')}</a> ·{' '}
              <a href={config.salesPhoneHref}>{t('contact.sales.phone')}</a>
            </dd>
          </div>
          <div>
            <dt className="inline font-bold">{t('contact.admin.label')}</dt> —{' '}
            <dd className="inline">
              <a href={`mailto:${t('contact.admin.email')}`}>{t('contact.admin.email')}</a> ·{' '}
              <a href={config.adminPhoneHref}>{t('contact.admin.phone')}</a>
            </dd>
          </div>
          <div>
            <dt className="inline font-bold">{t('contact.hours.label')}</dt> — <dd className="inline">{t('contact.hours.value')}</dd>
          </div>
        </dl>
        <a
          href={config.showroomMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex h-[120px] items-center justify-center rounded-[14px] border border-dashed border-sand-border bg-white text-sm font-semibold text-solar hover:text-solar-dark lg:h-[180px]"
        >
          {t('contact.mapLink')}
        </a>
      </div>
      <div data-reveal style={revealDelay(1, 120)}>
        <StudyRequestForm />
      </div>
    </section>
  );
};
