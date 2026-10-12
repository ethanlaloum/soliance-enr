import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { ArrowUpRightIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';
import { sectionScrollMarginClassName } from '@/components/resources/resourceSectionIds';

const internalLinkPaths = {
  solar: paths.solar,
  heatPump: paths.heatPump,
  evCharger: paths.evCharger,
  professionals: paths.professionals,
  referral: paths.referral,
  simulator: paths.simulator,
  care: paths.care,
} as const;

type GlossaryLinkKey = keyof typeof internalLinkPaths;

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
  const linkClassName = cn('energy-link mt-auto self-start', className);
  const content = (
    <>
      {t(`glossary.links.${link}`)}
      <ArrowUpRightIcon className="h-3 w-3" />
    </>
  );

  return (
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
      className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-6 pb-16 pt-12 lg:gap-10 lg:pb-24 lg:pt-20')}
    >
      <div data-reveal className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p aria-hidden="true" className="energy-kicker tabular-nums">03 / 03</p>
          <h2 id="glossary-title" className="energy-title">
            {t('glossary.title')}
          </h2>
        </div>
        <p className="text-[13px] text-slate-ink">{t('glossary.updated')}</p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {glossaryCards.map((card, index) => (
          <li key={card.key} data-reveal style={revealDelay(index % 3)}>
            <article className="flex h-full flex-col gap-2.5 rounded-md border border-sand-line bg-white p-5 lg:p-6">
              <p className="energy-kicker">{t(`glossary.categories.${card.category}`)}</p>
              <h3 className="mt-1 text-lg font-medium leading-snug tracking-[-0.02em] lg:text-[19px]">{t(`glossary.entries.${card.key}.term`)}</h3>
              <p className="pb-2 text-sm leading-[1.6] text-slate-ink">{t(`glossary.entries.${card.key}.definition`)}</p>
              <GlossaryLink link={card.link} />
            </article>
          </li>
        ))}
      </ul>

      <div data-reveal className="flex flex-col gap-4">
        <h3 className="energy-kicker">{t('glossary.moreTitle')}</h3>
        <ul className="grid border-t border-sand-line lg:grid-cols-2 lg:gap-x-12">
          {sortedMoreEntries.map((entry) => (
            <li key={entry.key} className="border-b border-sand-line">
              <details className="group/entry py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium tracking-[-0.015em] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{moreTerm(entry)}</span>
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none text-solar-dark transition-transform duration-200 group-open/entry:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <div className="flex flex-col gap-2 pt-3">
                  <p className="text-sm leading-[1.6] text-slate-ink">{t(`glossary.more.${entry.key}.definition`)}</p>
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
