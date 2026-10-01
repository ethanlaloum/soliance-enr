import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  projectCategories,
  toProjectCity,
  type ProjectCategory,
  type ProjectCategoryCounts,
  type ProjectCity,
} from '@/app/projects/domain/entities/Project';

type FilterChipProps = {
  label: string;
  pressed: boolean;
  onPress: () => void;
};

const FilterChip = ({ label, pressed, onPress }: FilterChipProps) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onPress}
    className={cn(
      'rounded-[20px] border px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solar motion-reduce:transition-none lg:px-4 lg:py-2.5 lg:text-sm',
      pressed ? 'border-night bg-night text-white' : 'border-sand-border bg-white text-night hover:border-night/50',
    )}
  >
    {label}
  </button>
);

type ProjectFiltersProps = {
  category: ProjectCategory | null;
  city: ProjectCity | null;
  counts: ProjectCategoryCounts;
  totalCount: number;
  cities: ProjectCity[];
  onCategoryChange: (category: ProjectCategory | null) => void;
  onCityChange: (city: ProjectCity | null) => void;
  className?: string;
};

export const ProjectFilters = ({ category, city, counts, totalCount, cities, onCategoryChange, onCityChange, className }: ProjectFiltersProps) => {
  const { t } = useTranslation('projects');

  return (
    <div className={cn('flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2.5', className)}>
      <div role="group" aria-label={t('portfolio.filters.typeLabel')} className="flex flex-wrap gap-2 lg:gap-2.5">
        <FilterChip
          label={t('portfolio.filters.chip', { label: t('portfolio.filters.all'), count: totalCount })}
          pressed={category === null}
          onPress={() => onCategoryChange(null)}
        />
        {projectCategories.map((item) => (
          <FilterChip
            key={item}
            label={t('portfolio.filters.chip', { label: t(`portfolio.filters.categories.${item}`), count: counts[item] })}
            pressed={category === item}
            onPress={() => onCategoryChange(item)}
          />
        ))}
      </div>
      <div aria-hidden="true" className="mx-1.5 hidden h-7 w-px bg-sand-border lg:block" />
      <div className="flex items-center gap-2">
        <label htmlFor="projects-city-filter" className="text-sm font-semibold">
          {t('portfolio.filters.city')}
        </label>
        <select
          id="projects-city-filter"
          value={city ?? ''}
          onChange={(event) => onCityChange(event.target.value === '' ? null : toProjectCity(event.target.value))}
          className="h-10 min-w-0 flex-1 rounded-[20px] border border-sand-border bg-white px-3.5 font-sans text-sm text-night outline-none transition-colors focus:border-solar focus:ring-2 focus:ring-solar/30 sm:flex-none lg:min-w-[180px]"
        >
          <option value="">{t('portfolio.filters.allCities')}</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {t(`cities.${item}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
