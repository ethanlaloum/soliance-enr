import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { resourceSectionIds } from '@/components/resources/resourceSectionIds';
import { useActiveSection } from '@/components/resources/useActiveSection';

export const ResourcesSectionNav = () => {
  const { t } = useTranslation('resources');
  const activeId = useActiveSection(resourceSectionIds);

  return (
    <nav
      aria-label={t('sectionNav.label')}
      className="sticky top-0 z-10 border-b border-sand-line bg-ivory/95 supports-[backdrop-filter]:bg-ivory/85 supports-[backdrop-filter]:backdrop-blur"
    >
      <div className={containerClassName}>
        <ul className="-mb-px flex overflow-x-auto lg:gap-4">
          {resourceSectionIds.map((id, index) => {
            const isActive = id === activeId;
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition-colors first:pl-0 motion-reduce:transition-none lg:px-4 lg:py-4 lg:text-[15px]',
                    isActive ? 'border-solar text-night hover:text-night' : 'border-transparent text-slate-ink hover:text-night',
                  )}
                >
                  <span aria-hidden="true" className="text-[11px] font-semibold tabular-nums tracking-[0.12em] text-solar-dark">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {id === 'glossary' ? (
                    <>
                      <span className="lg:hidden">{t('sectionNav.glossaryShort')}</span>
                      <span className="hidden lg:inline">{t('sectionNav.glossary')}</span>
                    </>
                  ) : (
                    t(`sectionNav.${id}`)
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
