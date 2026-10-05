import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { contactAnchor } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { focusOnLightClassName, titleLClassName } from '@/components/home/designs/module/moduleClassNames';

const rowClassName = 'border-t border-[#C9D1DA] py-4 first:border-t-0 first:pt-0';
const linkClassName =
  '-my-3 inline-block whitespace-nowrap py-3 font-semibold text-[#14181D] underline decoration-[#C9D1DA] decoration-2 underline-offset-4 hover:text-[#14181D] hover:decoration-[#E07B28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14181D]';

const formCardClassName =
  'mod-form-card flex flex-col gap-4 rounded-[4px] border border-[#C9D1DA] bg-white p-6 shadow-[0_0_0_8px_#EEF1F4,0_0_0_9px_#C9D1DA] lg:gap-5 lg:p-12';
const formTitleClassName = 'text-2xl font-extrabold tracking-[-0.035em] text-[#14181D] lg:text-[32px]';
const formSubmitClassName =
  'mt-1 rounded-[4px] bg-[#14181D] text-white hover:bg-[#E07B28] hover:text-[#14181D] hover:shadow-none focus-visible:outline-[#14181D] focus-visible:outline-offset-4';

const mapColumns = 5;
const mapRows = 3;
const showroomModule = 7;
const mapModules = Array.from({ length: mapColumns * mapRows }, (_, index) => ({
  index,
  x: 214 + (index % mapColumns) * 34,
  y: 34 + Math.floor(index / mapColumns) * 52,
  delay: ((index % mapColumns) + Math.floor(index / mapColumns)) * 45,
}));

const ShowroomArray = () => (
  <svg aria-hidden="true" viewBox="0 0 400 220" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full">
    {mapModules.map((panel) => (
      <rect
        key={panel.index}
        x={panel.x}
        y={panel.y}
        width={30}
        height={48}
        vectorEffect="non-scaling-stroke"
        style={{ transitionDelay: `${panel.delay}ms` }}
        className={cn(
          'mod-map-module',
          panel.index === showroomModule ? 'fill-[#E07B28]' : 'fill-white/0 stroke-white/30 group-hover:fill-white/[0.14] group-focus-visible:fill-white/[0.14]',
        )}
      />
    ))}
  </svg>
);

export const ModuleContact = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  return (
    <section ref={sectionRef} id={contactAnchor} aria-labelledby="contact-title" className="scroll-mt-6 bg-white text-[#14181D]">
      <div className={cn(containerClassName, 'grid gap-14 py-20 lg:grid-cols-12 lg:gap-x-10 lg:py-32')}>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
          <h2 id="contact-title" data-reveal-heading className={titleLClassName}>
            {t('contact.title')}
          </h2>
          <p className="text-[17px] leading-[1.6] text-[#4A535E] lg:text-lg">{t('contact.lead')}</p>
          <dl className="flex flex-col text-[15px] leading-[1.6] text-[#4A535E] lg:text-base">
            <div className={rowClassName}>
              <dt className="inline font-semibold text-[#14181D]">{t('contact.showroom.label')}</dt> — <dd className="inline">{t('contact.showroom.value')}</dd>
            </div>
            <div className={rowClassName}>
              <dt className="inline font-semibold text-[#14181D]">{t('contact.sales.label')}</dt> —{' '}
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
              <dt className="inline font-semibold text-[#14181D]">{t('contact.admin.label')}</dt> —{' '}
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
              <dt className="inline font-semibold text-[#14181D]">{t('contact.hours.label')}</dt> — <dd className="inline">{t('contact.hours.value')}</dd>
            </div>
          </dl>
          <a
            href={config.showroomMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('group relative flex h-[180px] items-end overflow-hidden rounded-[4px] bg-[#10243F] p-6 text-white hover:text-white lg:h-[220px] lg:p-8', focusOnLightClassName)}
          >
            <ShowroomArray />
            <span className="relative max-w-[50%] text-[17px] font-semibold underline decoration-white/40 underline-offset-[6px] transition-colors group-hover:decoration-[#E07B28]">
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
