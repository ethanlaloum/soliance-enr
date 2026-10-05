import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { contactAnchor } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { containerClassName } from '@/components/home/containerClassName';
import { rvFocusOnLightClassName, rvSectionSpacingClassName, rvTitleClassName } from '@/components/home/designs/riviera/rivieraClassNames';

const rowClassName = 'border-t border-[#0B1F4D]/15 py-4 first:border-t-0 first:pt-0';
const linkClassName = cn(
  'whitespace-nowrap font-semibold text-[#1B3FA0] underline decoration-[#1B3FA0]/35 decoration-2 underline-offset-4 hover:text-[#0B1F4D] hover:decoration-[#E07B28]',
  rvFocusOnLightClassName,
);

const formCardClassName = 'flex flex-col gap-4 border-t-[6px] border-[#1B3FA0] bg-[#F1F5FB] p-6 lg:gap-5 lg:p-12';
const formTitleClassName = 'riviera-display text-[21px] font-semibold uppercase leading-[1.12] tracking-[-0.01em] text-[#0B1F4D] lg:text-[26px]';
const formSubmitClassName =
  'mt-1 rounded-full bg-[#E07B28] text-[#0B1120] hover:bg-[#1B3FA0] hover:text-white hover:shadow-none focus-visible:[outline-style:solid] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#1B3FA0]';

const ShowroomPoster = () => (
  <span aria-hidden="true" className="absolute inset-0 block">
    <span className="absolute bottom-[30%] right-[12%] block aspect-square w-[34%] max-w-[150px] rounded-full bg-[#E07B28] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 group-focus-visible:-translate-y-3 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0" />
    <span className="absolute inset-x-0 bottom-0 block h-[42%] bg-[#0B1F4D]" />
  </span>
);

export const RivieraContact = () => {
  const { t } = useTranslation('home');

  return (
    <section id={contactAnchor} aria-labelledby="contact-title" className="scroll-mt-6 bg-white text-[#0B1F4D]">
      <div className={cn(containerClassName, rvSectionSpacingClassName, 'grid gap-12 lg:grid-cols-12 lg:gap-8')}>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
          <h2 id="contact-title" data-reveal-heading className={rvTitleClassName}>
            {t('contact.title')}
          </h2>
          <p className="text-[17px] leading-[1.6] text-[#0B1F4D] lg:text-lg">{t('contact.lead')}</p>
          <dl className="flex flex-col text-[15px] leading-[1.6] text-[#0B1F4D]/85 lg:text-base">
            <div className={rowClassName}>
              <dt className="inline font-bold text-[#0B1F4D]">{t('contact.showroom.label')}</dt> — <dd className="inline">{t('contact.showroom.value')}</dd>
            </div>
            <div className={rowClassName}>
              <dt className="inline font-bold text-[#0B1F4D]">{t('contact.sales.label')}</dt> —{' '}
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
              <dt className="inline font-bold text-[#0B1F4D]">{t('contact.admin.label')}</dt> —{' '}
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
              <dt className="inline font-bold text-[#0B1F4D]">{t('contact.hours.label')}</dt> — <dd className="inline">{t('contact.hours.value')}</dd>
            </div>
          </dl>
          <a
            href={config.showroomMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('group relative flex h-[200px] items-end overflow-hidden bg-[#1B3FA0] p-6 text-white hover:text-white lg:h-[230px] lg:p-8', rvFocusOnLightClassName)}
          >
            <ShowroomPoster />
            <span className="relative max-w-[60%] text-[17px] font-semibold underline decoration-white/40 decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-[#E07B28]">
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
