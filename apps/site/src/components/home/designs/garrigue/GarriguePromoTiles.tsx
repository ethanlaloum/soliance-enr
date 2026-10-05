import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';
import { focusOnLightClassName } from '@/components/home/designs/garrigue/garrigueTokens';

const tileClassName = cn('group flex flex-col overflow-hidden rounded-[36px_36px_16px_16px] lg:rounded-[56px_56px_24px_24px]', focusOnLightClassName);
const bodyClassName = 'flex flex-1 flex-col gap-3 p-7 lg:gap-4 lg:p-10 xl:p-12';
const zoomClassName =
  'transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] group-focus-visible:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100';

export const GarriguePromoTiles = () => {
  const { t } = useTranslation('home');

  return (
    <div className="bg-[#F4F6F1] pb-20 lg:pb-32">
      <div className={cn(containerClassName, 'grid gap-4 lg:grid-cols-2 lg:gap-6')}>
        <Link to={paths.referral} className={cn(tileClassName, 'bg-[#E07B28] text-[#0B1120] hover:text-[#0B1120]')}>
          <span className="g-dome relative mx-5 mt-5 block aspect-[16/10] bg-[#C4673A] lg:mx-8 lg:mt-8">
            <img
              src="/images/referral-tile.webp"
              alt=""
              width={1000}
              height={1000}
              loading="lazy"
              className={cn('absolute inset-0 h-full w-full object-cover [object-position:50%_35%]', zoomClassName)}
            />
          </span>
          <span className={bodyClassName}>
            <span className="text-sm font-semibold lg:text-[15px]">{t('tiles.referral.eyebrow')}</span>
            <span className="g-display max-w-[560px] text-[26px] font-[480] leading-[1.12] tracking-[-0.015em] [text-wrap:balance] lg:text-[clamp(1.75rem,2.5vw,2.375rem)]">
              {t('tiles.referral.title')}
            </span>
            <span className="text-[15px] lg:text-base">{t('tiles.referral.description')}</span>
          </span>
        </Link>
        <a href={config.careUrl} className={cn(tileClassName, 'bg-[#071A12] text-white hover:text-white')}>
          <span className="relative block aspect-[16/11] overflow-hidden lg:aspect-[16/10]">
            <img
              src="/images/care-supervision.webp"
              alt={t('tiles.care.imageAlt')}
              width={1000}
              height={1000}
              loading="lazy"
              className={cn('absolute inset-0 h-full w-full object-cover opacity-80', zoomClassName)}
            />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071A12] to-transparent" />
          </span>
          <span className={bodyClassName}>
            <span className="text-sm font-semibold text-[#4ECFA0] lg:text-[15px]">{t('tiles.care.eyebrow')}</span>
            <span className="g-display max-w-[560px] text-[26px] font-[480] leading-[1.12] tracking-[-0.015em] [text-wrap:balance] lg:text-[clamp(1.75rem,2.5vw,2.375rem)]">
              {t('tiles.care.title')}
            </span>
            <span className="text-[15px] text-[#C9D0D8] lg:text-base">{t('tiles.care.description')}</span>
          </span>
        </a>
      </div>
    </div>
  );
};
