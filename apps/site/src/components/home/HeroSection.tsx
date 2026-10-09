import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { ArrowRightIcon, CheckIcon } from '@/components/icons/Icons';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

const trustKeys = ['rge', 'decennial', 'installation', 'localTeam'] as const;
const statKeys = ['installations', 'savings', 'maintenance'] as const;
const heroPoster = '/images/hero-villa-premium.webp';
const equipment = [
  { key: 'solar', to: paths.solar },
  { key: 'evCharger', to: paths.evCharger },
  { key: 'heatPump', to: paths.heatPump },
] as const;

const KeyFigures = () => {
  const { t } = useTranslation('home');

  return (
    <div className="border-b border-sand-line bg-ivory">
      <dl aria-label={t('hero.statsLabel')} className={cn(containerClassName, 'grid grid-cols-3 py-6 lg:py-8')}>
        {statKeys.map((key) => (
          <div key={key} className="flex flex-col-reverse gap-1 border-l border-sand-border pl-4 first:border-0 first:pl-0 lg:items-center lg:pl-0">
            <dt className="text-[11px] leading-snug text-slate-ink sm:text-sm">
              <span className="lg:hidden">{t(`hero.stats.${key}.labelShort`)}</span>
              <span className="hidden lg:inline">{t(`hero.stats.${key}.label`)}</span>
            </dt>
            <dd className="text-[26px] font-bold leading-none tracking-tight text-solar lg:text-4xl">{t(`hero.stats.${key}.value`)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const VillaFilm = () => {
  const { t } = useTranslation('home');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoSource, setVideoSource] = useState('/videos/hero-villa-premium.mp4?v=2');
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const updatePreference = () => {
      setMotionAllowed(!preference.matches && !connection?.saveData);
      setVideoSource(desktop.matches ? '/videos/hero-villa-premium.mp4?v=2' : '/videos/hero-villa-premium-mobile.mp4?v=2');
    };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    desktop.addEventListener('change', updatePreference);
    return () => {
      preference.removeEventListener('change', updatePreference);
      desktop.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionAllowed) return;

    const bounds = video.getBoundingClientRect();
    let isVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
    const syncPlayback = () => {
      if (isVisible && !isPaused && !document.hidden) {
        void video.play().catch(() => {
          // Keep the poster and play control available if autoplay is blocked.
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncPlayback();
    });

    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [isPaused, motionAllowed, videoSource]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setIsPaused(false);
      void video.play().catch(() => {
        // Browsers that disallow playback keep showing the poster.
      });
    } else {
      setIsPaused(true);
      video.pause();
    }
  };

  return (
    <figure className="villa-film" aria-label={t('hero.film.label')}>
      <div className="villa-film__scene">
        <img
          src={heroPoster}
          alt={t('hero.imageAlt')}
          width={1672}
          height={941}
          loading="eager"
          fetchPriority="high"
          className="villa-film__media"
        />
        {motionAllowed && (
          <video
            key={videoSource}
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={heroPoster}
            aria-hidden="true"
            className="villa-film__media villa-film__video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        )}
        <div className="villa-film__equipment">
          {equipment.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              aria-label={t(`hero.film.equipment.${item.key}`)}
              className={cn('villa-hotspot', `villa-hotspot--${item.key}`)}
            >
              <span className="villa-hotspot__dot" aria-hidden="true" />
              <span className="villa-hotspot__label" aria-hidden="true">
                {t(`hero.film.equipment.${item.key}`)}
                <ArrowRightIcon className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="villa-film__shade" aria-hidden="true" />
      <div className="villa-film__footer">
        <figcaption className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 sm:text-xs">
          {t('hero.film.caption')}
        </figcaption>
        {motionAllowed && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={t(isPlaying ? 'hero.film.pause' : 'hero.film.play')}
            className="villa-film__control"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              {isPlaying ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="m5 3 8 5-8 5z" />}
            </svg>
          </button>
        )}
      </div>
    </figure>
  );
};

export const HeroSection = () => {
  const { t } = useTranslation('home');

  return (
    <>
      <section className="villa-hero relative isolate overflow-hidden bg-night" aria-labelledby="home-hero-title">
        <div data-hero-scroll-copy className={cn(containerClassName, 'relative z-10 pointer-events-none')}>
          <div className="villa-hero__heading pointer-events-auto flex flex-col items-start">
            <p className={cn(eyebrowClassName, 'flex items-center gap-2.5 motion-safe:animate-fade-up')}>
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-solar" />
              {t('hero.eyebrowShort')}
            </p>
            <h1 id="home-hero-title" className="mt-5 max-w-[620px] text-[38px] font-bold leading-[1.08] tracking-[-0.035em] text-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] sm:text-[48px] lg:mt-6 lg:text-[58px] xl:text-[64px]">
              {t('hero.title')}
            </h1>
          </div>
        </div>
        <VillaFilm />
        <div data-hero-scroll-copy className={cn(containerClassName, 'relative z-10 pointer-events-none')}>
          <div className="villa-hero__copy pointer-events-auto flex flex-col items-start">
            <p className="max-w-[480px] text-base leading-[1.65] text-slate-light motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[18px]">
              {t('hero.leadShort')}
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:w-auto sm:items-start lg:mt-8">
              <Link to={paths.simulator} className={cn(buttonVariants({ size: 'md' }), 'gap-3')}>
                {t('hero.simulate')}
                <ArrowRightIcon />
              </Link>
              <ContactLink kind={ContactFormKind.STUDY} href={`#${contactAnchor}`} className="inline-flex min-h-11 items-center justify-center gap-2.5 px-1 text-[15px] font-medium text-white/90 underline decoration-white/35 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar sm:justify-start">
                {t('hero.requestStudy')}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </ContactLink>
            </div>
            <ul aria-label={t('hero.trustLabel')} className="mt-6 flex max-w-[460px] flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-light motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:mt-8 lg:gap-x-6 lg:text-xs">
              {trustKeys.map((key) => (
                <li key={key} className="flex items-center gap-1.5">
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 text-solar" />
                  {t(`hero.trust.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <KeyFigures />
    </>
  );
};
