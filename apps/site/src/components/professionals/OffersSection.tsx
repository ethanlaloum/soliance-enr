import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';

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

const exampleLinkClassName = 'font-semibold text-solar underline decoration-solar/40 underline-offset-2 hover:text-solar-dark';

export const OffersSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section aria-labelledby="offers-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-2 pt-10 lg:gap-8 lg:pb-16 lg:pt-20')}>
      <h2 id="offers-title" data-reveal className="text-[28px] font-bold tracking-[-0.02em] lg:text-[40px]">
        {t('offers.title')}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {offers.map((offer, index) => (
          <li
            key={offer.key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-sand-line bg-white pb-6 lg:pb-[26px]"
          >
            <img
              src={offer.image}
              alt={t(`offers.items.${offer.key}.imageAlt`)}
              width={offer.width}
              height={offer.height}
              loading="lazy"
              style={{ objectPosition: offer.objectPosition }}
              className="mb-3 block h-[170px] w-full object-cover"
            />
            <h3 className="px-5 text-lg font-bold lg:px-[26px] lg:text-xl">{t(`offers.items.${offer.key}.title`)}</h3>
            <p className="px-5 text-sm leading-normal text-slate-ink lg:px-[26px]">
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
          </li>
        ))}
      </ul>
    </section>
  );
};
