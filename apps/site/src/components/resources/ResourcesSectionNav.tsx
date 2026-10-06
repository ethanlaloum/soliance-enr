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
      className="sticky top-0 z-10 bg-ivory/95 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] supports-[backdrop-filter]:bg-ivory/85 supports-[backdrop-filter]:backdrop-blur"
    >
      <div className={containerClassName}>
        <ul className="flex overflow-x-auto shadow-[inset_0_-1px_0_theme(colors.sand.border)] lg:gap-2">
          {resourceSectionIds.map((id) => {
            const isActive = id === activeId;
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'block whitespace-nowrap border-b-[3px] px-2.5 py-2.5 text-[15px] transition-colors lg:px-5 lg:py-3 lg:text-base',
                    isActive ? 'border-solar font-bold text-night hover:text-night' : 'border-transparent font-semibold text-slate-ink hover:text-night',
                  )}
                >
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
