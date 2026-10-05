import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/solar/horizonSolutionStyles';

export const EvChargerCtaSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <div className={cn(containerClassName, 'pb-14 lg:pb-20')}>
      <section
        data-reveal
        aria-labelledby="ev-cta-title"
        className="flex flex-col items-stretch gap-5 rounded-[4px] bg-charge p-6 text-white sm:items-start lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[4px] lg:px-[52px] lg:py-11"
      >
        <div>
          <h2 id="ev-cta-title" className="text-[22px] font-medium leading-tight lg:text-[30px]">
            {t('cta.title')}
          </h2>
          <p className="mt-1.5 text-[15px] leading-normal text-charge-soft lg:text-base">{t('cta.body')}</p>
        </div>
        <Link to={`${paths.home}#${contactAnchor}`} className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 focus-visible:outline-white')}>
          {t('cta.button')}
        </Link>
      </section>
    </div>
  );
};
