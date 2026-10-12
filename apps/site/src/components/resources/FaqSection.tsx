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
  'rounded-none border-0 border-y border-sand-line bg-transparent [&>details]:px-0 lg:[&>details]:px-0 [&_summary]:font-medium [&_summary]:tracking-[-0.015em]';

export const FaqSection = () => {
  const { t } = useTranslation('resources');
  const activeThemeId = useActiveSection(themeAnchorIds);

  return (
    <section id="faq" aria-labelledby="faq-title" className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-6 pb-10 pt-12 lg:gap-10 lg:pb-16 lg:pt-20')}>
      <div data-reveal className="flex flex-col gap-3 lg:gap-4">
        <p aria-hidden="true" className="energy-kicker tabular-nums">02 / 03</p>
        <h2 id="faq-title" className="energy-title">
          {t('faq.title')}
        </h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-14">
        <nav aria-label={t('faq.themesLabel')} className="lg:sticky lg:top-[84px]">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {faqThemes.map((theme) => {
              const anchorId = themeAnchorId(theme.key);
              const isActive = anchorId === activeThemeId;
              return (
                <li key={theme.key}>
                  <a
                    href={`#${anchorId}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'block rounded border px-3.5 py-2 text-[13px] font-medium transition-colors motion-reduce:transition-none lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-2.5 lg:text-[15px]',
                      isActive
                        ? 'border-night bg-night text-ivory hover:text-ivory lg:border-solar lg:bg-transparent lg:text-night lg:hover:text-night'
                        : 'border-sand-border text-night hover:border-night hover:text-night lg:border-sand-line lg:text-slate-ink lg:hover:border-slate lg:hover:text-night',
                    )}
                  >
                    {t(`faq.themes.${theme.key}.label`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-col gap-10 lg:gap-14">
          {faqThemes.map((theme) => (
            <div key={theme.key} id={themeAnchorId(theme.key)} data-reveal className="flex scroll-mt-16 flex-col gap-4 lg:scroll-mt-[84px]">
              <h3 className="energy-kicker">{t(`faq.themes.${theme.key}.label`)}</h3>
              <FaqList
                className={faqListClassName}
                accentClassName="text-solar-dark"
                items={theme.questionKeys.map((questionKey) => ({
                  question: t(`faq.themes.${theme.key}.questions.${questionKey}.question`),
                  answer: t(`faq.themes.${theme.key}.questions.${questionKey}.answer`),
                }))}
              />
            </div>
          ))}
          <p className="text-[13px] text-slate-ink">
            <Trans
              t={t}
              i18nKey="faq.missing"
              components={{
                contactLink: (
                  <ContactLink
                    kind={ContactFormKind.STUDY}
                    href={`${paths.home}#${contactAnchor}`}
                    className="font-medium text-night underline decoration-solar underline-offset-[3px] hover:text-solar-dark"
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </section>
  );
};
