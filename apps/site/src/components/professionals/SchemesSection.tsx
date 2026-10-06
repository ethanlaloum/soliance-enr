import { ComponentType } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { SchemeDiagram } from '@/components/professionals/SchemeDiagram';
import {
  BankIcon,
  BoltIcon,
  BuildingsIcon,
  CarportIcon,
  EuroIcon,
  HubIcon,
  MeterIcon,
  ParkingIcon,
  PylonIcon,
  SolarPanelIcon,
} from '@/components/professionals/SchemeIcons';

type IconComponent = ComponentType<{ className?: string }>;

type Scheme = {
  key: 'totalSale' | 'collectiveSelfConsumption' | 'thirdPartyInvestment' | 'aperCarports';
  image: string;
  width: number;
  height: number;
  icons: { source: IconComponent; hub: IconComponent; target: IconComponent };
};

const schemes: Scheme[] = [
  {
    key: 'totalSale',
    image: '/images/professionals/logistics-warehouse-roof.webp',
    width: 1024,
    height: 1024,
    icons: { source: SolarPanelIcon, hub: MeterIcon, target: PylonIcon },
  },
  {
    key: 'collectiveSelfConsumption',
    image: '/images/professionals/solis-invest-collective.webp',
    width: 1024,
    height: 576,
    icons: { source: SolarPanelIcon, hub: HubIcon, target: BuildingsIcon },
  },
  {
    key: 'thirdPartyInvestment',
    image: '/images/professionals/industrial-roof-sunset.webp',
    width: 1024,
    height: 1024,
    icons: { source: BankIcon, hub: SolarPanelIcon, target: EuroIcon },
  },
  {
    key: 'aperCarports',
    image: '/images/professionals/parking-carport.webp',
    width: 1024,
    height: 1024,
    icons: { source: ParkingIcon, hub: CarportIcon, target: BoltIcon },
  },
];

const diagramStepKeys = ['source', 'hub', 'target'] as const;
const definitionKeys = ['definition', 'audience', 'keyPoint'] as const;
const insetKeys = ['individualSelfConsumption', 'creTenders', 'taxation'] as const;

export const SchemesSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section aria-labelledby="schemes-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-2 pt-12 lg:gap-7 lg:pb-16 lg:pt-20')}>
      <div data-reveal className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-2">
          <p className={eyebrowClassName}>{t('schemes.eyebrow')}</p>
          <h2 id="schemes-title" className="text-[28px] font-bold leading-tight tracking-[-0.02em] lg:text-[40px]">
            {t('schemes.title')}
          </h2>
        </div>
        <p className="text-[15px] leading-normal text-slate-ink lg:max-w-[460px] lg:text-base">{t('schemes.intro')}</p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {schemes.map((scheme, index) => {
          const title = t(`schemes.items.${scheme.key}.title`);
          return (
            <li
              key={scheme.key}
              data-reveal
              style={revealDelay(index % 2)}
              className="flex flex-col gap-3.5 rounded-2xl border border-sand-line bg-white p-4 lg:rounded-[20px] lg:p-6"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={scheme.image}
                  alt={t(`schemes.items.${scheme.key}.imageAlt`)}
                  width={scheme.width}
                  height={scheme.height}
                  loading="lazy"
                  className="block h-[220px] w-full object-cover lg:h-[260px]"
                />
                <SchemeDiagram
                  label={t('schemes.diagramLabel', { title })}
                  className="absolute inset-x-2.5 bottom-2.5 lg:inset-x-4 lg:bottom-4"
                  steps={diagramStepKeys.map((stepKey) => ({
                    key: stepKey,
                    label: t(`schemes.items.${scheme.key}.diagram.${stepKey}`),
                    Icon: scheme.icons[stepKey],
                  }))}
                />
              </div>
              <h3 className="text-lg font-bold lg:text-xl">{title}</h3>
              <dl className="text-sm leading-[1.55] text-slate-ink">
                {definitionKeys.map((definitionKey) => (
                  <div key={definitionKey} className="inline">
                    <dt className="inline font-bold">{t(`schemes.labels.${definitionKey}`)}</dt>{' '}
                    <dd className="inline">{t(`schemes.items.${scheme.key}.${definitionKey}`)}</dd>{' '}
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>

      <ul className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        {insetKeys.map((key, index) => (
          <li key={key} data-reveal style={revealDelay(index)} className="rounded-xl border border-sand-line p-[18px]">
            <h3 className="font-bold">{t(`schemes.insets.${key}.title`)}</h3>
            <p className="mt-1 text-[13px] leading-normal text-slate-ink">{t(`schemes.insets.${key}.description`)}</p>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate">
        <Trans t={t} i18nKey="schemes.footnote" components={{ glossaryLink: <Link to={paths.resources} className="font-semibold text-solar hover:text-solar-dark" /> }} />
      </p>
    </section>
  );
};
