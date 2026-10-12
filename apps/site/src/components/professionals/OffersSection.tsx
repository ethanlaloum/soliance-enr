import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { professionalOffersAnchor } from '@/components/professionals/professionalStudyAnchor';

type Offer = {
  key: 'industrialRoofs' | 'carports' | 'evCharging' | 'collectives';
  image: string;
  width: number;
  height: number;
  objectPosition: string;
  exampleSlug?: string;
};

const offers: Offer[] = [
  {
    key: 'industrialRoofs',
    image: '/images/professionals/agricultural-hangar.webp',
    width: 800,
    height: 450,
    objectPosition: '50% 60%',
    exampleSlug: 'saint-laurent-du-var-hangar-agricole-15-kwc',
  },
  { key: 'carports', image: '/images/professionals/parking-carport.webp', width: 1024, height: 1024, objectPosition: '50% 50%' },
  { key: 'evCharging', image: '/images/professionals/fleet-charging.webp', width: 800, height: 800, objectPosition: '50% 50%' },
  {
    key: 'collectives',
    image: '/images/professionals/pertuis-gymnasium.webp',
    width: 800,
    height: 450,
    objectPosition: '50% 50%',
    exampleSlug: 'pertuis-gymnase-163-kwc',
  },
];

const exampleLinkClassName = 'font-medium text-night underline decoration-solar underline-offset-[3px] hover:text-solar-dark';

export const OffersSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section
      id={professionalOffersAnchor}
      aria-labelledby="offers-title"
      className={cn(containerClassName, 'flex scroll-mt-6 flex-col gap-6 pb-4 pt-12 lg:gap-10 lg:pb-16 lg:pt-24')}
    >
      <div data-reveal className="flex flex-col gap-3 lg:gap-4">
        <p className="energy-kicker">{t('offers.kicker')}</p>
        <h2 id="offers-title" className="energy-title">
          {t('offers.title')}
        </h2>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {offers.map((offer, index) => (
          <li
            key={offer.key}
            data-reveal
            style={revealDelay(index)}
            className="group flex flex-col overflow-hidden rounded-md border border-sand-line bg-white"
          >
            <div className="overflow-hidden">
              <img
                src={offer.image}
                alt={t(`offers.items.${offer.key}.imageAlt`)}
                width={offer.width}
                height={offer.height}
                loading="lazy"
                style={{ objectPosition: offer.objectPosition }}
                className="block h-[180px] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:h-[200px]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-5 lg:p-6">
              <span aria-hidden="true" className="text-[11px] font-semibold tabular-nums tracking-[0.12em] text-solar-dark">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[19px] font-medium leading-tight tracking-[-0.02em] lg:text-xl">{t(`offers.items.${offer.key}.title`)}</h3>
              <p className="text-sm leading-[1.6] text-slate-ink">
                {offer.exampleSlug ? (
                  <Trans
                    t={t}
                    i18nKey={`offers.items.${offer.key}.description`}
                    components={{ exampleLink: <Link to={projectPath(offer.exampleSlug)} className={exampleLinkClassName} /> }}
                  />
                ) : (
                  t(`offers.items.${offer.key}.description`)
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
