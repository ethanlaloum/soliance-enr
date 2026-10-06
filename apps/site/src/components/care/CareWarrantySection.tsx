import { Trans, useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { careBodyClassName, careEyebrowClassName, careTitleClassName } from '@/components/care/careStyles';

export const CareWarrantySection = () => {
  const { t } = useTranslation('care');
  const steps = t('warranty.steps', { returnObjects: true }) as string[];

  return (
    <section aria-labelledby="care-warranty-title" className="bg-care-surface">
      <div className={cn(containerClassName, 'grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20 desktop:px-20')}>
        <div data-reveal className="flex flex-col gap-4 lg:gap-[18px]">
          <p className={careEyebrowClassName}>{t('warranty.eyebrow')}</p>
          <h2 id="care-warranty-title" className={cn(careTitleClassName, 'lg:text-[40px]')}>
            {t('warranty.title')}
          </h2>
          <p className={careBodyClassName}>{t('warranty.body')}</p>
          <p className="text-xs leading-normal text-care-muted lg:text-[13px]">{t('warranty.source')}</p>
        </div>
        <div className="flex flex-col gap-4">
          <ol aria-label={t('warranty.stepsLabel')} className="flex flex-col gap-3 lg:gap-3.5">
            {steps.map((step, index) => (
              <li key={step} data-reveal style={revealDelay(index)} className="flex items-center gap-4 rounded-xl bg-white px-5 py-4 lg:px-[22px] lg:py-[18px]">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-care font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-[15px] leading-snug lg:text-[17px]">
                  <Trans t={t} i18nKey={`warranty.steps.${index}`} components={{ strong: <strong className="font-bold" /> }} />
                </span>
              </li>
            ))}
          </ol>
          <p data-reveal className="text-[15px] font-semibold text-care lg:text-base">
            {t('warranty.motto')}
          </p>
        </div>
      </div>
    </section>
  );
};
