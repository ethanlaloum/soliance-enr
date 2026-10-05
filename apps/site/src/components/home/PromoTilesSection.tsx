import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { paths } from '@/routes/paths';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';

const tileClassName =
  'group flex flex-col overflow-hidden rounded-[20px] lg:rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar';
const mediaClassName = 'relative block aspect-[16/11] overflow-hidden lg:aspect-[16/10]';
const imageClassName =
  'absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100';
const bodyClassName = 'flex flex-1 flex-col gap-3 p-7 lg:gap-4 lg:p-12';
const titleClassName = '[text-wrap:balance] max-w-[560px] text-2xl font-bold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(1.75rem,2.4vw,2.25rem)]';

const tilesMotion: MotionSetup = ({ gsap }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    gsap.utils.toArray<HTMLElement>('[data-tile-media]', root).forEach((media) => {
      gsap.fromTo(media, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
};

export const PromoTilesSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLDivElement>(null);

  useLazyMotion(sectionRef, tilesMotion);

  return (
    <div ref={sectionRef} className={`${containerClassName} grid gap-4 lg:grid-cols-2 lg:gap-6`}>
      <Link to={paths.referral} className={`${tileClassName} bg-solar text-night hover:text-night`}>
        <span className={mediaClassName}>
          <span data-tile-media className="absolute inset-0 block">
            <img src="/images/referral-tile.webp" alt="" width={1000} height={1000} loading="lazy" className={`${imageClassName} [object-position:50%_35%]`} />
          </span>
        </span>
        <span className={bodyClassName}>
          <span className="text-sm font-semibold lg:text-[15px]">{t('tiles.referral.eyebrow')}</span>
          <span className={titleClassName}>{t('tiles.referral.title')}</span>
          <span className="text-[15px] lg:text-base">{t('tiles.referral.description')}</span>
        </span>
      </Link>
      <a href={config.careUrl} className={`${tileClassName} bg-care-night text-white hover:text-white`}>
        <span className={mediaClassName}>
          <span data-tile-media className="absolute inset-0 block">
            <img src="/images/care-supervision.webp" alt={t('tiles.care.imageAlt')} width={1000} height={1000} loading="lazy" className={`${imageClassName} opacity-80`} />
          </span>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-care-night to-transparent" />
        </span>
        <span className={bodyClassName}>
          <span className="text-sm font-semibold text-care-mint lg:text-[15px]">{t('tiles.care.eyebrow')}</span>
          <span className={titleClassName}>{t('tiles.care.title')}</span>
          <span className="text-[15px] text-slate-light lg:text-base">{t('tiles.care.description')}</span>
        </span>
      </a>
    </div>
  );
};
