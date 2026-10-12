import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';
import { contactAnchor, paths } from '@/routes/paths';
import { ArrowUpRightIcon } from '@/components/icons/Icons';
import './energy-premium.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type EnergyPremiumHeroProps = {
  variant: 'solar' | 'charge' | 'pro' | 'projects' | 'resources';
  compact?: boolean;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  primaryLabel: string;
  primaryKind?: ContactFormKind;
  primaryHref?: string;
  secondaryLabel: string;
  secondaryHref: string;
  caption: string;
  learnLabel: string;
  learnHref?: string;
  trust: string[];
};

export const EnergyPremiumHero = ({
  variant, compact = false, breadcrumb, eyebrow, title, accent, lead, image, imageWidth, imageHeight, imageAlt,
  primaryLabel, primaryKind = ContactFormKind.STUDY, primaryHref = `${paths.home}#${contactAnchor}`,
  secondaryLabel, secondaryHref, caption, learnLabel, learnHref = `#${variant}-energy-story`, trust,
}: EnergyPremiumHeroProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-energy-intro]', { y: 24, opacity: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out' });
      gsap.to('.energy-hero__photograph', {
        yPercent: 7, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.energy-hero__copy', {
        y: -38, opacity: 0.62, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <section ref={root} className={cn('energy-hero', `energy-hero--${variant}`, compact && 'energy-hero--compact')} aria-labelledby={`${variant}-premium-title`}>
      <div className="energy-hero__photograph" aria-hidden="true">
        <img src={image} alt="" width={imageWidth} height={imageHeight} fetchPriority="high" />
      </div>
      <div className="energy-hero__veil" />
      <div className="energy-hero__inner">
        <div className="energy-hero__copy">
          <Breadcrumb items={[{ label: breadcrumb }]} tone="dark" className="energy-hero__breadcrumb" />
          <p className="energy-hero__eyebrow" data-energy-intro><span />{eyebrow}</p>
          <h1 id={`${variant}-premium-title`} data-energy-intro>{title}<br /><span>{accent}</span></h1>
          <p className="energy-hero__lead" data-energy-intro>{lead}</p>
          <div className="energy-hero__actions" data-energy-intro>
            <ContactLink kind={primaryKind} href={primaryHref} className="energy-hero__primary">{primaryLabel}<span aria-hidden="true"><ArrowUpRightIcon className="h-[0.8em] w-[0.8em]" /></span></ContactLink>
            {secondaryHref.startsWith('#') ? (
              <a href={secondaryHref} className="energy-hero__secondary">{secondaryLabel}</a>
            ) : (
              <Link to={secondaryHref} className="energy-hero__secondary">{secondaryLabel}</Link>
            )}
          </div>
          <ul className="energy-hero__trust" data-energy-intro>{trust.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <p className="sr-only">{imageAlt}</p>
        <div className="energy-hero__footer">
          <a href={learnHref} className="energy-hero__learn"><span aria-hidden="true">↓</span>{learnLabel}</a>
          <span className="energy-hero__caption">{caption}</span>
        </div>
      </div>
    </section>
  );
};
