import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { sectionScrollMarginClassName } from '@/components/resources/resourceSectionIds';

const internalLinkPaths = {
  solar: paths.solar,
  heatPump: paths.heatPump,
  evCharger: paths.evCharger,
  professionals: paths.professionals,
  referral: paths.referral,
  simulator: paths.simulator,
} as const;

type GlossaryLinkKey = keyof typeof internalLinkPaths | 'care';

type GlossaryCard = { key: string; category: string; link: GlossaryLinkKey };

type GlossaryEntry = { key: string; link: GlossaryLinkKey };

const glossaryCards: GlossaryCard[] = [
  { key: 'selfConsumptionBonus', category: 'solar', link: 'solar' },
  { key: 'feedInTariff', category: 'solar', link: 'solar' },
  { key: 'vatRecovery', category: 'tax', link: 'solar' },
  { key: 'maPrimeRenov', category: 'heatPump', link: 'heatPump' },
  { key: 'energySavingsCertificates', category: 'heatPump', link: 'heatPump' },
  { key: 'consuel', category: 'procedures', link: 'solar' },
  { key: 'gridConnection', category: 'procedures', link: 'solar' },
  { key: 'certifications', category: 'qualifications', link: 'solar' },
  { key: 'aperLaw', category: 'professionals', link: 'professionals' },
];

const moreEntries: GlossaryEntry[] = [
  { key: 'decennialWarranty', link: 'solar' },
  { key: 'performanceWarranty', link: 'solar' },
  { key: 'chargingInfrastructure', link: 'evCharger' },
  { key: 'powerAndEnergy', link: 'simulator' },
  { key: 'hybridInverter', link: 'solar' },
  { key: 'backupBox', link: 'solar' },
  { key: 'selfConsumption', link: 'solar' },
  { key: 'surplus', link: 'solar' },
  { key: 'care', link: 'care' },
  { key: 'referral', link: 'referral' },
];

const GlossaryLink = ({ link, className }: { link: GlossaryLinkKey; className?: string }) => {
  const { t } = useTranslation('resources');
  const linkClassName = cn('group/link inline-flex items-center gap-1 self-start text-sm font-semibold', className);
  const content = (
    <>
      {t(`glossary.links.${link}`)}
      <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none">
        →
      </span>
    </>
  );

  return link === 'care' ? (
    <a href={config.careUrl} className={linkClassName}>
      {content}
    </a>
  ) : (
    <Link to={internalLinkPaths[link]} className={linkClassName}>
      {content}
    </Link>
  );
};

export const GlossarySection = () => {
  const { t, i18n } = useTranslation('resources');
  const moreTerm = (entry: GlossaryEntry) => t(`glossary.more.${entry.key}.term`);
  const sortedMoreEntries = [...moreEntries].sort((first, second) => moreTerm(first).localeCompare(moreTerm(second), i18n.language));

  return (
    <section
      id="glossary"
      aria-labelledby="glossary-title"
      className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-5 pb-14 pt-8 lg:gap-6 lg:pb-20 lg:pt-10')}
    >
      <div data-reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <h2 id="glossary-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
          {t('glossary.title')}
        </h2>
        <p className="text-[13px] text-slate">{t('glossary.updated')}</p>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {glossaryCards.map((card, index) => (
          <li key={card.key} data-reveal style={revealDelay(index % 3)}>
            <article className="flex h-full flex-col gap-1.5 rounded-[14px] border border-sand-line bg-white p-5 lg:p-[22px]">
              <p className="text-xs font-semibold uppercase tracking-[1px] text-solar">{t(`glossary.categories.${card.category}`)}</p>
              <h3 className="text-[17px] font-bold lg:text-lg">{t(`glossary.entries.${card.key}.term`)}</h3>
              <p className="text-sm leading-normal text-slate-ink">{t(`glossary.entries.${card.key}.definition`)}</p>
              <GlossaryLink link={card.link} />
            </article>
          </li>
        ))}
      </ul>

      <div data-reveal className="flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-slate-ink">{t('glossary.moreTitle')}</h3>
        <ul className="grid gap-2.5 lg:grid-cols-2 lg:items-start">
          {sortedMoreEntries.map((entry) => (
            <li key={entry.key}>
              <details className="group/entry rounded-xl border border-sand-line bg-white px-5 py-3.5 lg:px-[22px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{moreTerm(entry)}</span>
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none text-solar transition-transform duration-200 group-open/entry:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <div className="flex flex-col gap-1.5 pt-2.5">
                  <p className="text-sm leading-normal text-slate-ink">{t(`glossary.more.${entry.key}.definition`)}</p>
                  <GlossaryLink link={entry.link} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
