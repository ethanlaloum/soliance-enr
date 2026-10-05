import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { FaqList } from '@/components/page/FaqList';
import { sectionScrollMarginClassName } from '@/components/resources/resourceSectionIds';
import { useActiveSection } from '@/components/resources/useActiveSection';

const faqThemes = [
  { key: 'pricing', questionKeys: ['cost', 'financing', 'deposit', 'payback', 'maintenance'] },
  { key: 'aids', questionKeys: ['solarBonus', 'resale', 'maPrimeRenov', 'vatRecovery', 'chargerAids'] },
  { key: 'technical', questionKeys: ['roof', 'battery', 'hardware', 'outage', 'heatPumpCoupling'] },
  { key: 'procedures', questionKeys: ['connection', 'paperwork', 'installationDays', 'heatPumpLeadTime', 'chargerLeadTime'] },
  { key: 'warranty', questionKeys: ['breakdown', 'coverage', 'manufacturerWarranty', 'installer', 'heatPumpServicing'] },
  { key: 'referral', questionKeys: ['reward', 'eligibility', 'payment', 'installations', 'howTo'] },
] as const;

const themeAnchorId = (themeKey: string) => `faq-${themeKey}`;

const themeAnchorIds = faqThemes.map((theme) => themeAnchorId(theme.key));

const faqListClassName =
  'gap-2.5 divide-y-0 rounded-none border-0 bg-transparent [&>details]:rounded-none [&>details]:border-b [&>details]:border-sand-line [&>details]:bg-transparent lg:[&>details]:px-[22px] lg:[&>details]:py-[18px]';

export const FaqSection = () => {
  const { t } = useTranslation('resources');
  const activeThemeId = useActiveSection(themeAnchorIds);

  return (
    <section id="faq" aria-labelledby="faq-title" className={cn('hz-page-container', sectionScrollMarginClassName, 'flex flex-col gap-8 border-t border-sand-line pb-16 pt-12 lg:gap-12 lg:pb-20 lg:pt-20')}>
      <h2 id="faq-title" data-reveal className="text-[34px] font-medium leading-[1.12] tracking-[-0.045em] lg:text-[48px]">
        {t('faq.title')}
      </h2>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <nav aria-label={t('faq.themesLabel')} className="lg:sticky lg:top-[calc(var(--hz-header-height)+88px)]">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
            {faqThemes.map((theme) => {
              const anchorId = themeAnchorId(theme.key);
              const isActive = anchorId === activeThemeId;
              return (
                <li key={theme.key}>
                  <a
                    href={`#${anchorId}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'block rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors lg:border-transparent lg:py-2.5 lg:text-[15px]',
                      isActive
                        ? 'border-solar bg-solar text-white hover:text-white lg:border-solar'
                        : 'border-sand-border bg-white text-night hover:text-night lg:bg-transparent lg:hover:bg-white',
                    )}
                  >
                    {t(`faq.themes.${theme.key}.label`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-col gap-8 lg:gap-10">
          {faqThemes.map((theme) => (
            <div key={theme.key} id={themeAnchorId(theme.key)} data-reveal className="flex scroll-mt-[calc(var(--hz-header-height)+84px)] flex-col gap-3">
              <h3 className="text-[13px] font-medium uppercase tracking-[1px] text-solar">
                {t(`faq.themes.${theme.key}.label`)}
              </h3>
              <FaqList
                className={faqListClassName}
                items={theme.questionKeys.map((questionKey) => ({
                  question: t(`faq.themes.${theme.key}.questions.${questionKey}.question`),
                  answer: t(`faq.themes.${theme.key}.questions.${questionKey}.answer`),
                }))}
              />
            </div>
          ))}
          <p className="text-[13px] text-slate">
            <Trans t={t} i18nKey="faq.missing" components={{ contactLink: <Link to={`${paths.home}#${contactAnchor}`} /> }} />
          </p>
        </div>
      </div>
    </section>
  );
};
