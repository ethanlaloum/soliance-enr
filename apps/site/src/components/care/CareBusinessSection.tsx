import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { CareDiamondPattern } from '@/components/care/CareIcons';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careOutlineOnDarkButtonClassName, careTitleClassName } from '@/components/care/careStyles';

const offers = [
  { key: 'pro', requestType: CareRequestType.PRO },
  { key: 'partner', requestType: CareRequestType.PARTNER },
] as const;

export const CareBusinessSection = () => {
  const { t } = useTranslation('care');
  const modules = t('business.partner.modules', { returnObjects: true }) as string[];

  return (
    <section
      id={careAnchors.business}
      aria-labelledby="care-business-title"
      className={cn('relative overflow-hidden bg-care-forest text-white', careSectionScrollClassName)}
    >
      <CareDiamondPattern id="care-business-diamonds" />
      <div className={cn(containerClassName, 'relative flex flex-col gap-8 py-14 lg:gap-10 lg:py-[88px] desktop:px-20')}>
        <div data-reveal className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-care-leaf lg:text-[15px]">{t('business.eyebrow')}</p>
          <h2 id="care-business-title" className={careTitleClassName}>
            {t('business.title')}
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          {offers.map((offer, index) => (
            <article
              key={offer.key}
              data-reveal
              style={revealDelay(index)}
              aria-labelledby={`care-business-${offer.key}`}
              className="flex flex-col gap-4 rounded-[20px] border border-care-moss bg-white/[0.04] p-6 lg:p-10"
            >
              <p className="text-xs font-bold uppercase tracking-[1.2px] text-care-leaf lg:text-sm">{t(`business.${offer.key}.eyebrow`)}</p>
              <h3 id={`care-business-${offer.key}`} className="text-[22px] font-bold leading-tight lg:text-[26px]">
                {t(`business.${offer.key}.title`)}
              </h3>
              <p className="text-[15px] leading-[1.55] text-care-pale lg:text-[17px]">{t(`business.${offer.key}.body`)}</p>
              {offer.key === 'partner' && (
                <ul className="flex flex-wrap gap-2">
                  {modules.map((module) => (
                    <li key={module} className="rounded-full border border-care-moss px-3 py-1.5 text-[13px] font-semibold text-care-pale">
                      {module}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex flex-col gap-1 border-t border-care-moss pt-5">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[32px] font-bold leading-none lg:text-[40px]">{t(`business.${offer.key}.price`)}</span>
                  <span className="text-base text-care-fog">{t(`business.${offer.key}.unit`)}</span>
                </p>
                <p className="text-[13px] leading-normal text-care-fog lg:text-sm">{t(`business.${offer.key}.note`)}</p>
              </div>
              <CareRequestLink requestType={offer.requestType} className={cn(careOutlineOnDarkButtonClassName, 'w-full sm:self-start')}>
                {t(`business.${offer.key}.cta`)}
              </CareRequestLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
