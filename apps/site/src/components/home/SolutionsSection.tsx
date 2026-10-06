import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';

const solutions = [
  { key: 'solar', to: paths.solar, image: '/images/solution-solar.webp', thumbnail: '/images/hero-vence-villa.webp', objectPosition: '50% 45%' },
  { key: 'heatPump', to: paths.heatPump, image: '/images/solution-heat-pump.webp', thumbnail: '/images/solution-heat-pump.webp', objectPosition: '50% 50%' },
  { key: 'evCharger', to: paths.evCharger, image: '/images/solution-ev-charger.webp', thumbnail: '/images/solution-ev-charger-thumb.webp', objectPosition: '50% 60%' },
] as const;

export const SolutionsSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="solutions-title" className={cn(containerClassName, 'flex flex-col gap-3.5 pb-2 pt-9 lg:gap-9 lg:pb-[72px] lg:pt-[88px]')}>
      <div data-reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="solutions-title" className={sectionTitleClassName}>
          {t('solutions.title')}
        </h2>
        <p className="hidden max-w-[520px] text-[17px] text-slate-ink lg:block">{t('solutions.intro')}</p>
      </div>
      <ul className="grid gap-3.5 lg:grid-cols-3 lg:gap-6">
        {solutions.map((solution, index) => (
          <li key={solution.key} data-reveal style={revealDelay(index)}>
            <Link
              to={solution.to}
              className="group flex h-full items-center gap-3.5 rounded-[14px] border border-sand-line bg-white p-[18px] text-night lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-hidden lg:rounded-[18px] lg:border-0 lg:p-0 lg:shadow-card transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:hover:shadow-lift"
            >
              <img
                src={solution.thumbnail}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-[10px] object-cover lg:hidden"
              />
              <img
                src={solution.image}
                alt={t(`solutions.${solution.key}.imageAlt`)}
                width={900}
                height={200}
                loading="lazy"
                style={{ objectPosition: solution.objectPosition }}
                className="hidden h-[200px] w-full object-cover lg:block transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="flex flex-col gap-1 lg:gap-2.5 lg:p-7">
                <span className="hidden text-[13px] font-semibold uppercase tracking-[1px] text-solar lg:block">
                  {t(`solutions.${solution.key}.audience`)}
                </span>
                <span className="text-lg font-bold lg:text-2xl">{t(`solutions.${solution.key}.title`)}</span>
                <span className="text-[13px] text-slate-ink lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                <span className="hidden text-[15px] leading-[1.55] text-slate-ink lg:block">{t(`solutions.${solution.key}.description`)}</span>
                <span aria-hidden="true" className="mt-1.5 hidden font-bold text-solar group-hover:text-solar-dark lg:block">
                  {t('solutions.discover')}{' '}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
