import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';

export const HeatPumpCtaSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-cta-title" className={cn(containerClassName, 'pb-12 pt-8 lg:pb-20 lg:pt-0')}>
      <div
        data-reveal
        className="flex flex-col gap-6 rounded-[20px] bg-heat px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-[52px] lg:py-11"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="heat-pump-cta-title" className="text-2xl font-bold leading-tight text-white lg:text-[30px]">
            {t('cta.title')}
          </h2>
          <p className="text-[15px] leading-normal text-heat-sky lg:text-base">{t('cta.description')}</p>
        </div>
        <Link to={`${paths.home}#${contactAnchor}`} className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 self-stretch sm:self-start lg:self-auto')}>
          {t('cta.button')}
        </Link>
      </div>
    </section>
  );
};
