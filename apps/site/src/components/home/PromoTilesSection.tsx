import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { Link } from 'react-router';
import { config } from '@/config';
import { paths } from '@/routes/paths';

const tileClassName = 'group relative flex min-h-[180px] flex-col justify-end gap-2.5 overflow-hidden rounded-[14px] p-5 text-white lg:min-h-[260px] lg:rounded-[20px] lg:p-10';

export const PromoTilesSection = () => {
  const { t } = useTranslation('home');

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-3 px-4 pt-6 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-0">
      <Link to={paths.referral} data-reveal className={`${tileClassName} bg-solar hover:text-white`}>
        <img
          src="/images/referral-tile.webp"
          alt=""
          width={1000}
          height={260}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_35%] transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(224,123,40,0.05)_0%,rgba(120,55,10,0.92)_75%)]" />
        <span className="relative text-xs font-semibold uppercase tracking-[1.5px] opacity-90 lg:text-[13px]">{t('tiles.referral.eyebrow')}</span>
        <span className="relative text-[19px] font-bold lg:text-[28px]">{t('tiles.referral.title')}</span>
        <span className="relative text-[15px] opacity-[0.92]">{t('tiles.referral.description')}</span>
      </Link>
      <a href={config.careUrl} data-reveal style={revealDelay(1)} className={`${tileClassName} bg-care-night hover:text-white lg:bg-night`}>
        <img
          src="/images/care-supervision.webp"
          alt={t('tiles.care.imageAlt')}
          width={1000}
          height={260}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.55] transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,32,0.15)_0%,rgba(11,17,32,0.92)_70%)]" />
        <span className="relative text-xs font-semibold uppercase tracking-[1.5px] text-care-mint lg:text-[13px]">{t('tiles.care.eyebrow')}</span>
        <span className="relative text-[19px] font-bold lg:text-[28px]">{t('tiles.care.title')}</span>
        <span className="relative text-[15px] text-slate-light">{t('tiles.care.description')}</span>
      </a>
    </div>
  );
};
