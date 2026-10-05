import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';
import { rvFocusOnLightClassName } from '@/components/home/designs/riviera/rivieraClassNames';

const tileClassName = cn('group flex flex-col', rvFocusOnLightClassName);
const mediaClassName = 'relative block aspect-[16/11] overflow-hidden lg:aspect-[16/10]';
const imageClassName =
  'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100';
const bodyClassName = 'relative flex flex-1 flex-col gap-3 p-7 lg:gap-4 lg:p-12';
const sealClassName = 'absolute right-7 top-0 block h-14 w-14 -translate-y-1/2 rounded-full lg:right-12 lg:h-16 lg:w-16';
const titleClassName =
  'riviera-display [text-wrap:balance] max-w-[560px] text-[19px] font-semibold uppercase leading-[1.18] tracking-[-0.01em] lg:text-[clamp(1.375rem,2vw,1.75rem)]';

export const RivieraTiles = () => {
  const { t } = useTranslation('home');

  return (
    <div className="bg-[#F1F5FB] pb-20 lg:pb-32">
      <div className={cn(containerClassName, 'grid gap-5 lg:grid-cols-2 lg:gap-6')}>
        <Link to={paths.referral} className={cn(tileClassName, 'bg-[#E07B28] text-[#0B1120] hover:text-[#0B1120]')}>
          <span className={mediaClassName}>
            <img src="/images/referral-tile.webp" alt="" width={1000} height={1000} loading="lazy" className={cn(imageClassName, '[object-position:50%_35%]')} />
          </span>
          <span className={bodyClassName}>
            <span aria-hidden="true" className={cn(sealClassName, 'bg-[#E07B28]')} />
            <span className="text-sm font-semibold lg:text-[15px]">{t('tiles.referral.eyebrow')}</span>
            <span className={titleClassName}>{t('tiles.referral.title')}</span>
            <span className="text-[15px] lg:text-base">{t('tiles.referral.description')}</span>
          </span>
        </Link>
        <a href={config.careUrl} className={cn(tileClassName, 'bg-[#071A12] text-white hover:text-white')}>
          <span className={mediaClassName}>
            <img src="/images/care-supervision.webp" alt={t('tiles.care.imageAlt')} width={1000} height={1000} loading="lazy" className={cn(imageClassName, 'opacity-80')} />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071A12] to-transparent" />
          </span>
          <span className={bodyClassName}>
            <span aria-hidden="true" className={cn(sealClassName, 'border-2 border-[#4ECFA0] bg-[#071A12]')} />
            <span className="text-sm font-semibold text-[#4ECFA0] lg:text-[15px]">{t('tiles.care.eyebrow')}</span>
            <span className={titleClassName}>{t('tiles.care.title')}</span>
            <span className="text-[15px] text-[#C9D0D8] lg:text-base">{t('tiles.care.description')}</span>
          </span>
        </a>
      </div>
    </div>
  );
};
