import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { paths } from '@/routes/paths';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { eyebrowClassName } from '@/components/home/containerClassName';

const estimateKeys = ['power', 'production', 'autonomy'] as const;

export const SimulatorSection = () => {
  const { t } = useTranslation('home');

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 lg:px-10 lg:pt-0">
      <section
        data-simulator
        aria-labelledby="simulator-title"
        className="home-simulator relative isolate grid items-center gap-14 overflow-hidden rounded-2xl bg-night p-6 lg:grid-cols-[1.1fr_1fr] lg:rounded-3xl lg:p-16"
      >
        <div className="home-simulator__halo" data-simulator-halo aria-hidden="true" />
        <div data-reveal className="relative flex flex-col gap-3 lg:gap-[18px]">
          <p className={eyebrowClassName}>{t('simulator.eyebrow')}</p>
          <h2 id="simulator-title" className="text-2xl font-bold leading-[1.15] text-white lg:text-[40px] lg:tracking-[-0.02em]">
            {t('simulator.title')}
          </h2>
          <p className="text-sm leading-normal text-slate-light lg:text-[17px] lg:leading-[1.55]">
            <span className="lg:hidden">{t('simulator.leadShort')}</span>
            <span className="hidden lg:inline">{t('simulator.lead')}</span>
          </p>
          <Link to={paths.simulator} className={cn(buttonVariants({ size: 'md' }), 'lg:self-start')}>
            {t('simulator.cta')}
          </Link>
        </div>
        <figure className="home-simulator__visual relative hidden min-h-[460px] overflow-hidden rounded-2xl bg-night-soft lg:block">
          <img
            data-simulator-image
            src="/images/simulator-roof.webp"
            alt={t('simulator.imageAlt')}
            width={1200}
            height={460}
            loading="lazy"
            className="block h-[460px] w-full object-cover"
          />
          <div className="home-simulator__autonomy" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="51" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" /><circle data-autonomy-ring cx="60" cy="60" r="51" pathLength="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="75 100" transform="rotate(-90 60 60)" /></svg>
            <span>{t('simulator.estimate.autonomy.value')}</span>
          </div>
          <figcaption className="absolute inset-x-5 bottom-5">
            <dl aria-label={t('simulator.estimateLabel')} className="grid grid-cols-3 gap-3 rounded-xl bg-white/95 px-[18px] py-3.5">
              {estimateKeys.map((key) => (
                <div key={key} data-estimate className="flex flex-col-reverse justify-end">
                  <dt className="text-xs text-slate-ink">{t(`simulator.estimate.${key}.label`)}</dt>
                  <dd className={cn('text-[22px] font-bold', key === 'autonomy' ? 'text-solar-dark' : 'text-night')}>
                    {t(`simulator.estimate.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </figcaption>
        </figure>
      </section>
    </div>
  );
};
