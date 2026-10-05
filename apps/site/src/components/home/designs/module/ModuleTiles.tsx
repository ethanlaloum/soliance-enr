import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';
import { focusOnLightClassName } from '@/components/home/designs/module/moduleClassNames';

const tileClassName = cn('group flex flex-col overflow-hidden rounded-[4px]', focusOnLightClassName);
const mediaClassName = 'relative m-2 block aspect-[16/10] overflow-hidden rounded-[2px] lg:m-3';
const imageClassName =
  'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100';
const bodyClassName = 'flex flex-1 flex-col gap-3 px-6 pb-8 pt-5 lg:gap-4 lg:px-10 lg:pb-12 lg:pt-7';
const titleClassName = '[text-wrap:balance] max-w-[560px] text-[26px] font-extrabold leading-[1.08] tracking-[-0.035em] lg:text-[clamp(1.875rem,2.6vw,2.5rem)]';

export const ModuleTiles = () => {
  const { t } = useTranslation('home');

  return (
    <div className="bg-[#EEF1F4] pb-20 lg:pb-32">
      <div className={cn(containerClassName, 'grid gap-4 lg:grid-cols-2 lg:gap-6')}>
        <Link to={paths.referral} className={cn(tileClassName, 'bg-[#E07B28] text-[#14181D] hover:text-[#14181D]')}>
          <span className={mediaClassName}>
            <img src="/images/referral-tile.webp" alt="" width={1000} height={1000} loading="lazy" className={cn(imageClassName, '[object-position:50%_35%]')} />
          </span>
          <span className={bodyClassName}>
            <span className="text-[15px] font-semibold">{t('tiles.referral.eyebrow')}</span>
            <span className={titleClassName}>{t('tiles.referral.title')}</span>
            <span className="text-base">{t('tiles.referral.description')}</span>
          </span>
        </Link>
        <a href={config.careUrl} className={cn(tileClassName, 'bg-[#071A12] text-white hover:text-white')}>
          <span className={mediaClassName}>
            <img src="/images/care-supervision.webp" alt={t('tiles.care.imageAlt')} width={1000} height={1000} loading="lazy" className={cn(imageClassName, 'opacity-90')} />
          </span>
          <span className={bodyClassName}>
            <span className="text-[15px] font-semibold text-[#4ECFA0]">{t('tiles.care.eyebrow')}</span>
            <span className={titleClassName}>{t('tiles.care.title')}</span>
            <span className="text-base text-[#C9D0D8]">{t('tiles.care.description')}</span>
          </span>
        </a>
      </div>
    </div>
  );
};
