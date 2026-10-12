import { ComponentType } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
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
    <section aria-labelledby="schemes-title" className={cn(containerClassName, 'flex flex-col gap-6 pb-4 pt-14 lg:gap-10 lg:pb-16 lg:pt-24')}>
      <div data-reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="energy-kicker">{t('schemes.eyebrow')}</p>
          <h2 id="schemes-title" className="energy-title max-w-[720px]">
            {t('schemes.title')}
          </h2>
        </div>
        <p className="text-[15px] leading-[1.65] text-slate-ink lg:max-w-[440px] lg:text-base">{t('schemes.intro')}</p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {schemes.map((scheme, index) => {
          const title = t(`schemes.items.${scheme.key}.title`);
          return (
            <li
              key={scheme.key}
              data-reveal
              style={revealDelay(index % 2)}
              className="flex flex-col gap-4 rounded-md border border-sand-line bg-white p-4 lg:p-5"
            >
              <div className="relative overflow-hidden rounded">
                <img
                  src={scheme.image}
                  alt={t(`schemes.items.${scheme.key}.imageAlt`)}
                  width={scheme.width}
                  height={scheme.height}
                  loading="lazy"
                  className="block h-[220px] w-full object-cover lg:h-[270px]"
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
              <div className="flex flex-col gap-2.5 px-1 pb-1 lg:px-2 lg:pb-2">
                <h3 className="flex items-baseline gap-3 text-[19px] font-medium leading-tight tracking-[-0.02em] lg:text-[22px]">
                  <span aria-hidden="true" className="text-[11px] font-semibold tabular-nums tracking-[0.12em] text-solar-dark">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {title}
                </h3>
                <dl className="text-sm leading-[1.6] text-slate-ink">
                  {definitionKeys.map((definitionKey) => (
                    <div key={definitionKey} className="inline">
                      <dt className="inline font-semibold text-night">{t(`schemes.labels.${definitionKey}`)}</dt>{' '}
                      <dd className="inline">{t(`schemes.items.${scheme.key}.${definitionKey}`)}</dd>{' '}
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          );
        })}
      </ul>

      <ul className="grid border-y border-sand-line lg:grid-cols-3">
        {insetKeys.map((key, index) => (
          <li
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-1.5 border-sand-line py-5 [&:not(:first-child)]:border-t lg:px-6 lg:py-6 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
          >
            <h3 className="font-medium tracking-[-0.01em] lg:text-[17px]">{t(`schemes.insets.${key}.title`)}</h3>
            <p className="text-[13px] leading-[1.6] text-slate-ink">{t(`schemes.insets.${key}.description`)}</p>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate">
        <Trans
          t={t}
          i18nKey="schemes.footnote"
          components={{ glossaryLink: <Link to={paths.resources} className="font-medium text-night underline decoration-solar underline-offset-[3px] hover:text-solar-dark" /> }}
        />
      </p>
    </section>
  );
};
