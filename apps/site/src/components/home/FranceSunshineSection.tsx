import '@/lib/i18n/namespaces/sunshine';
import { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRightIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';
import { franceMetropolePath } from '@/components/home/france-metropole-path';
import { paths } from '@/routes/paths';
import './france-sunshine.css';

const climateSource = 'https://meteofrance.com/changement-climatique/le-climat-en-france-hexagonale-et-corse';
const geographySource = 'https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/';

const localCities = [
  { key: 'marseille', x: 417.49, y: 437.57 },
  { key: 'toulon', x: 436.35, y: 445.96 },
  { key: 'nice', x: 481.44, y: 417.44 },
] as const;

export const FranceSunshineSection = () => {
  const { t } = useTranslation('sunshine');
  const sectionRef = useRef<HTMLElement>(null);
  const svgId = `sunshine-${useId().replace(/:/g, '')}`;

  useGSAP(() => {
    const root = sectionRef.current;
    if (!root) return;

    gsap.registerPlugin(useGSAP, ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({
      desktop: '(min-width: 1024px)',
      mobile: '(max-width: 1023px)',
      wide: '(min-width: 768px)',
      wholeScene: '(min-width: 1024px) and (min-height: 800px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, wholeScene, reduceMotion } = context.conditions as { desktop: boolean; wholeScene: boolean; reduceMotion: boolean };
      if (reduceMotion) return;

      const stage = root.querySelector<HTMLElement>('[data-sunshine-stage]');
      if (!stage) return;

      // The height query rebuilds the pin when a wide viewport becomes short.
      // The matching CSS reserves room for copy, caption and section padding.
      const sectionFits = wholeScene && root.offsetHeight <= window.innerHeight + 1;
      const pinTarget = sectionFits ? root : stage;
      const canPin = sectionFits || pinTarget.offsetHeight <= window.innerHeight + 1;
      if (sectionFits) {
        gsap.set(root, { minHeight: '100svh', display: 'grid', alignItems: 'center' });
      }
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          id: 'france-sunshine',
          refreshPriority: 1,
          trigger: canPin ? pinTarget : root,
          pin: canPin ? pinTarget : false,
          start: canPin ? 'top top' : 'clamp(top 80%)',
          end: canPin ? `+=${desktop ? 1150 : 760}` : 'clamp(bottom 40%)',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const outline = root.querySelector<SVGPathElement>('[data-sunshine-outline]');
      const leader = root.querySelector<SVGPathElement>('[data-sunshine-leader]');
      if (outline) {
        const length = outline.getTotalLength();
        timeline.fromTo(outline, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.5, ease: 'none' }, 0);
      }

      timeline
        .fromTo('[data-sunshine-zone="north"]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0)
        .fromTo('[data-sunshine-zone="middle"]', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.65)
        .fromTo('[data-sunshine-zone="south"]', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 1.25)
        .fromTo('[data-sunshine-grid]', { opacity: 0 }, { opacity: 0.5, duration: 1.2 }, 1)
        .fromTo('[data-sunshine-sun]', { scale: 0.65, opacity: 0, svgOrigin: '500 96' }, { scale: 1, opacity: 1, duration: 1.3 }, 0.45)
        .to('[data-sunshine-rays]', { rotation: 70, svgOrigin: '500 96', duration: 3.3, ease: 'none' }, 0.5)
        .fromTo('[data-sunshine-halo]', { scale: 0.4, opacity: 0, transformOrigin: 'center center' }, { scale: 1, opacity: 1, duration: 1.8, stagger: 0.16 }, 1.4)
        .fromTo('[data-sunshine-city]', { scale: 0, opacity: 0, transformOrigin: 'center center' }, { scale: 1, opacity: 1, stagger: 0.13, duration: 0.65 }, 2.25);

      if (leader) {
        const length = leader.getTotalLength();
        timeline.fromTo(leader, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.85, ease: 'none' }, 2.7);
      }

      timeline
        .fromTo('[data-sunshine-local-label]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 3.15)
        .fromTo('[data-sunshine-legend-fill]', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 2.65, ease: 'none' }, 0.35)
        .to('[data-sunshine-cue]', { opacity: 0, duration: 0.5 }, 3.25);
    }, root);

    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="sunshine-section" data-france-sunshine aria-labelledby={`${svgId}-heading`}>
      <div className={`${containerClassName} sunshine-section__layout`}>
        <div className="sunshine-section__copy">
          <p className="sunshine-section__eyebrow">{t('eyebrow')}</p>
          <h2 id={`${svgId}-heading`} className="sunshine-section__title">
            {t('title')} <span>{t('titleAccent')}</span>
          </h2>
          <p className="sunshine-section__lead">{t('lead')}</p>
          <div className="sunshine-section__local">
            <span className="sunshine-section__local-line" aria-hidden="true" />
            <p>{t('localEyebrow')}</p>
            <h3>{t('localTitle')}</h3>
            <p className="sunshine-section__areas">{t('localAreas')}</p>
            <p className="sunshine-section__local-note">{t('localNote')}</p>
          </div>
          <Link to={paths.solar} className="sunshine-section__cta">
            {t('cta')} <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <figure className="sunshine-section__figure" data-sunshine-stage>
          <div className="sunshine-section__map-stage">
            <p className="sunshine-section__map-eyebrow">{t('mapEyebrow')}</p>
            <p className="sunshine-section__map-heading">{t('mapSequenceTitle')}</p>
            <svg className="sunshine-map" viewBox="0 0 640 650" role="img" aria-labelledby={`${svgId}-title ${svgId}-description`}>
              <title id={`${svgId}-title`}>{t('mapTitle')}</title>
              <desc id={`${svgId}-description`}>{t('mapDescription')}</desc>
              <defs>
                <clipPath id={`${svgId}-clip`}><path d={franceMetropolePath} /></clipPath>
                <radialGradient id={`${svgId}-north`}>
                  <stop stopColor="var(--home-light)" /><stop offset="1" stopColor="var(--home-light)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${svgId}-middle`}>
                  <stop stopColor="#ebc575" stopOpacity=".8" /><stop offset="1" stopColor="#ebc575" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${svgId}-south`}>
                  <stop stopColor="#e07b28" /><stop offset=".45" stopColor="#efaa50" stopOpacity=".92" /><stop offset="1" stopColor="#efaa50" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${svgId}-glow`}>
                  <stop stopColor="#e07b28" stopOpacity=".26" /><stop offset="1" stopColor="#e07b28" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`${svgId}-coast`} x1="380" y1="445" x2="515" y2="410" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e07b28" stopOpacity="0" /><stop offset=".5" stopColor="#e07b28" /><stop offset="1" stopColor="#e07b28" stopOpacity="0" />
                </linearGradient>
                <pattern id={`${svgId}-grid`} width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M25 0H0V25" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth=".65" />
                </pattern>
              </defs>

              <g aria-hidden="true">
                <circle cx="316" cy="288" r="239" className="sunshine-map__orbit" />
                <circle cx="316" cy="288" r="287" className="sunshine-map__orbit sunshine-map__orbit--outer" strokeDasharray="2 11" />
                <path d="M48 288h13m510 0h13M316 9v13m0 532v13" className="sunshine-map__axis" />
                <path d={franceMetropolePath} className="sunshine-map__base" />
                <g clipPath={`url(#${svgId}-clip)`}>
                  <ellipse data-sunshine-zone="north" cx="227" cy="156" rx="300" ry="205" fill={`url(#${svgId}-north)`} />
                  <ellipse data-sunshine-zone="middle" cx="328" cy="305" rx="321" ry="260" fill={`url(#${svgId}-middle)`} />
                  <ellipse data-sunshine-zone="south" cx="464" cy="469" rx="303" ry="275" fill={`url(#${svgId}-south)`} />
                  <path data-sunshine-grid d={franceMetropolePath} fill={`url(#${svgId}-grid)`} opacity=".5" />
                  <path d="M362 449c45-17 111-29 157-45" stroke={`url(#${svgId}-coast)`} strokeWidth="19" fill="none" opacity=".46" />
                </g>
                <path data-sunshine-outline d={franceMetropolePath} className="sunshine-map__outline" />

                <g data-sunshine-sun className="sunshine-map__sun">
                  <circle cx="500" cy="96" r="66" fill={`url(#${svgId}-glow)`} />
                  <circle cx="500" cy="96" r="28" className="sunshine-map__sun-disc" />
                  <g data-sunshine-rays className="sunshine-map__rays">
                    <path d="M500 49v9m0 76v9M453 96h9m76 0h9M467 63l6 6m54 54 6 6M467 129l6-6m54-54 6-6" />
                  </g>
                </g>

                <circle data-sunshine-halo cx="458" cy="431" r="79" fill={`url(#${svgId}-glow)`} />
                <circle data-sunshine-halo cx="458" cy="431" r="52" className="sunshine-map__local-ring" />
                <circle data-sunshine-halo cx="458" cy="431" r="36" className="sunshine-map__local-ring sunshine-map__local-ring--inner" />
                {localCities.map((city) => (
                  <g key={city.key} data-sunshine-city>
                    <circle cx={city.x} cy={city.y} r="9" className="sunshine-map__city-halo" />
                    <circle cx={city.x} cy={city.y} r={city.key === 'nice' ? '4' : '3'} className="sunshine-map__city" />
                  </g>
                ))}
                <path data-sunshine-leader d="M481.44 417.44C548 426 575 511 489 566H436" className="sunshine-map__leader" />
              </g>
            </svg>
            <div className="sunshine-section__map-label" data-sunshine-local-label aria-hidden="true">
              <span className="sunshine-section__map-label-dot" />
              <span><small>{t('mapLocalLabel')}</small><strong>{t('mapLocalTitle')}</strong></span>
            </div>
            <span className="sunshine-section__scroll-cue" data-sunshine-cue aria-hidden="true">
              <span /> {t('scrollCue')}
            </span>
          </div>

          <figcaption className="sunshine-section__caption">
            <div className="sunshine-section__legend">
              <span>{t('legendTitle')}</span>
              <div className="sunshine-section__legend-bar"><span data-sunshine-legend-fill /></div>
              <div><span>{t('legendLow')}</span><span>{t('legendHigh')}</span></div>
            </div>
            <p className="sunshine-section__source">
              {t('sourcePrefix')} <a href={climateSource} target="_blank" rel="noreferrer">{t('sourceName')}</a>
              <span>{t('geographyPrefix')} <a href={geographySource} target="_blank" rel="noreferrer">{t('geographyName')}</a></span>
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
