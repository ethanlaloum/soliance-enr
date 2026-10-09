import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';
import { EnergyGlyph } from '@/components/home/EnergyGlyph';
import '@/components/home/solutions-polish.css';

const solutions = [
  { key: 'solar', to: paths.solar, image: '/images/solution-solar.webp', objectPosition: '50% 60%' },
  { key: 'heatPump', to: paths.heatPump, image: '/images/heat-pump-premium.webp', objectPosition: '64% 54%' },
  { key: 'evCharger', to: paths.evCharger, image: '/images/solution-ev-charger.webp', objectPosition: '50% 60%' },
] as const;

export const SolutionsSection = () => {
  const { t } = useTranslation('home');

  return (
    <section data-solutions aria-labelledby="solutions-title" className={cn(containerClassName, 'home-solutions flex flex-col gap-5 pb-2 pt-12 lg:gap-9 lg:pb-[88px] lg:pt-[104px]')}>
      <div data-reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="home-kicker mb-3">{t('solutions.eyebrow')}</p>
          <h2 id="solutions-title" className={sectionTitleClassName}>
            {t('solutions.title')}
          </h2>
        </div>
        <p className="hidden max-w-[520px] text-[17px] text-slate-ink lg:block">{t('solutions.intro')}</p>
      </div>
      <ul className="solution-card__grid grid gap-3.5 sm:grid-cols-3 sm:gap-4 lg:gap-6">
        {solutions.map((solution, index) => (
          <li key={solution.key} data-reveal data-solution-card={solution.key} style={revealDelay(index)}>
            <Link
              to={solution.to}
              className="solution-card group text-night hover:text-night focus-visible:text-night"
            >
              <span className="solution-card__media">
                <img
                  data-solution-image
                  src={solution.image}
                  alt={t(`solutions.${solution.key}.imageAlt`)}
                  width={900}
                  height={280}
                  loading="lazy"
                  style={{ objectPosition: solution.objectPosition }}
                  className="h-full w-full object-cover"
                />
                <span className="solution-card__icon" data-solution-icon>
                  <EnergyGlyph kind={solution.key} />
                </span>
              </span>
              <span className="solution-card__content">
                <span className="solution-card__audience">
                  {t(`solutions.${solution.key}.audience`)}
                </span>
                <span className="solution-card__title">{t(`solutions.${solution.key}.title`)}</span>
                <span className="text-[13px] leading-[1.5] text-slate-ink lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                <span className="hidden text-[15px] leading-[1.6] text-slate-ink lg:block">{t(`solutions.${solution.key}.description`)}</span>
                <span aria-hidden="true" className="solution-card__discover text-solar group-hover:text-solar-dark">
                  {t('solutions.discover')}{' '}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
                </span>
              </span>
              <span className="solution-card__charge" aria-hidden="true">
                <span data-solution-charge />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
