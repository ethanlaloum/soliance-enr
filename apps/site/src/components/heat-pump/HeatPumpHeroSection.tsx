import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const trustKeys = ['qualipac', 'daikin', 'installation'] as const;

export const HeatPumpHeroSection = () => {
  const { t } = useTranslation('heatPump');
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-heat-hero-copy]', {
        y: 28,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
      gsap.to('.heat-hero__image', {
        yPercent: 7,
        scale: 1.07,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'clamp(top top)',
          end: 'clamp(bottom top)',
          scrub: 0.8,
        },
      });
    });
    return () => media.revert();
  }, { scope: heroRef });

  return (
    <section ref={heroRef} aria-labelledby="heat-pump-hero-title" className="heat-hero">
      <div className={cn(containerClassName, 'heat-hero__layout')}>
        <div className="heat-hero__copy">
          <Breadcrumb items={[{ label: t('breadcrumb') }]} className="mb-8 lg:mb-12" />
          <p data-heat-hero-copy className="heat-premium-eyebrow">{t('hero.eyebrow')}</p>
          <h1 data-heat-hero-copy id="heat-pump-hero-title" className="heat-hero__title">
            {t('hero.title')} <span>{t('hero.titleAccent')}</span>
          </h1>
          <p data-heat-hero-copy className="heat-hero__lead">{t('hero.lead')}</p>
          <div data-heat-hero-copy className="heat-hero__actions">
            <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} className={buttonVariants({ size: 'md' })}>
              {t('hero.requestStudy')}
            </ContactLink>
            <a href="#comprendre-la-pac" className="heat-hero__discover">
              {t('hero.discover')}
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" /></svg>
            </a>
          </div>
          <ul data-heat-hero-copy aria-label={t('hero.trustLabel')} className="heat-hero__trust">
            {trustKeys.map((key) => <li key={key}>{t(`hero.trust.${key}`)}</li>)}
          </ul>
        </div>
        <figure className="heat-hero__visual">
          <img
            src="/images/heat-pump-premium.webp"
            alt={t('hero.imageAlt')}
            width={1536}
            height={1024}
            fetchPriority="high"
            className="heat-hero__image"
          />
          <div aria-hidden="true" className="heat-hero__image-shade" />
          <figcaption className="heat-hero__caption">
            <span className="heat-hero__caption-dot" aria-hidden="true" />
            <span>{t('hero.imageCaption')}</span>
          </figcaption>
        </figure>
      </div>
      <div className="heat-hero__baseline">
        <div className={cn(containerClassName, 'heat-hero__baseline-inner')}>
          <span>{t('hero.baseline')}</span>
          <span className="heat-hero__baseline-line" aria-hidden="true" />
          <span>{t('hero.baselineEnd')}</span>
        </div>
      </div>
    </section>
  );
};
