import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { DiamondPattern, PhoneIcon } from '@/components/icons/Icons';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';

const destinations = [
  { key: 'solar', to: paths.solar },
  { key: 'heatPump', to: paths.heatPump },
  { key: 'evCharger', to: paths.evCharger },
  { key: 'professionals', to: paths.professionals },
  { key: 'projects', to: paths.projects },
  { key: 'referral', to: paths.referral },
] as const;

const ErrorCode = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn('flex select-none items-center font-bold leading-none text-white', className)}>
    <span>4</span>
    <span className="relative mx-[0.12em] flex h-[0.62em] w-[0.62em] items-center justify-center">
      <span className="absolute inset-0 rotate-45 rounded-[0.08em] border-2 border-solar motion-safe:animate-pulse-ring" />
      <span className="absolute inset-0 rotate-45 rounded-[0.08em] bg-solar shadow-[0_0_80px_rgba(224,123,40,0.55)]" />
    </span>
    <span>4</span>
  </div>
);

export const NotFoundPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <DiamondPattern />
        <div className={cn(containerClassName, 'relative grid items-center gap-8 pb-14 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-[100px] lg:pt-20')}>
          <ErrorCode className="text-[104px] motion-safe:animate-fade-up lg:hidden" />
          <div className="flex flex-col gap-4 lg:gap-6">
            <p className={cn(eyebrowClassName, 'motion-safe:animate-fade-up')}>{t('notFound.eyebrow')}</p>
            <h1 className="text-4xl font-bold leading-[1.08] text-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[56px] lg:leading-[1.05]">
              {t('notFound.title')}
            </h1>
            <p className="max-w-[560px] text-base leading-normal text-slate-light motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-xl lg:leading-[1.55]">
              {t('notFound.description')}
            </p>
            <div className="mt-1 flex flex-col gap-3.5 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap">
              <Link to={paths.home} className={buttonVariants({ size: 'lg' })}>
                {t('notFound.backHome')}
              </Link>
              <Link to={paths.simulator} className={buttonVariants({ variant: 'outlineLight', size: 'lg' })}>
                {t('header.simulate')}
              </Link>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-mist motion-safe:animate-fade-up motion-safe:[animation-delay:320ms]">
              <PhoneIcon className="shrink-0 text-solar" />
              {t('notFound.callPrompt')}{' '}
              <a href={config.salesPhoneHref} className="font-bold text-white underline-offset-4 hover:text-solar hover:underline">
                {t('header.phoneDisplay')}
              </a>
            </p>
          </div>
          <ErrorCode className="hidden justify-center text-[200px] motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] lg:flex" />
        </div>
      </section>
      <section aria-labelledby="not-found-destinations" className={cn(containerClassName, 'flex flex-col gap-5 py-12 lg:gap-8 lg:py-[88px]')}>
        <h2 id="not-found-destinations" className="text-2xl font-bold tracking-[-0.02em] lg:text-[34px]">
          {t('notFound.destinationsTitle')}
        </h2>
        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {destinations.map((destination) => (
            <li key={destination.key}>
              <Link
                to={destination.to}
                className="group flex h-full flex-col gap-1.5 rounded-[14px] border border-sand-line bg-white p-5 text-night transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:gap-2 lg:rounded-[18px] lg:p-7"
              >
                <span className="flex items-center justify-between gap-3 text-lg font-bold lg:text-xl">
                  {t(`notFound.destinations.${destination.key}.title`)}
                  <span aria-hidden="true" className="text-solar transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </span>
                <span className="text-[15px] leading-[1.55] text-slate-ink">{t(`notFound.destinations.${destination.key}.description`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
