import { Trans, useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { FaqList } from '@/components/page/FaqList';
import { containerClassName } from '@/components/home/containerClassName';
import { sectionScrollMarginClassName } from '@/components/resources/resourceSectionIds';
import { useActiveSection } from '@/components/resources/useActiveSection';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

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
  'gap-2.5 divide-y-0 rounded-none border-0 bg-transparent [&>details]:rounded-xl [&>details]:border [&>details]:border-sand-line [&>details]:bg-white lg:[&>details]:px-[22px] lg:[&>details]:py-[18px]';

export const FaqSection = () => {
  const { t } = useTranslation('resources');
  const activeThemeId = useActiveSection(themeAnchorIds);

  return (
    <section id="faq" aria-labelledby="faq-title" className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-5 pb-8 pt-8 lg:gap-6 lg:pb-12 lg:pt-10')}>
      <h2 id="faq-title" data-reveal className="text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
        {t('faq.title')}
      </h2>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <nav aria-label={t('faq.themesLabel')} className="lg:sticky lg:top-[76px]">
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
                      'block rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors lg:border-transparent lg:py-2.5 lg:text-[15px]',
                      isActive
                        ? 'border-night bg-night text-white hover:text-white lg:border-night'
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
            <div key={theme.key} id={themeAnchorId(theme.key)} data-reveal className="flex scroll-mt-16 flex-col gap-3 lg:scroll-mt-[76px]">
              <h3 className="text-[13px] font-semibold uppercase tracking-[1px] text-solar">
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
            <Trans t={t} i18nKey="faq.missing" components={{ contactLink: <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} /> }} />
          </p>
        </div>
      </div>
    </section>
  );
};
