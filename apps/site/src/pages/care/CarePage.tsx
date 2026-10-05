import '@/lib/i18n/namespaces/care';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { HorizonArrow, HorizonLabel, HorizonSun } from '@/components/home/designs/horizon/HorizonParts';
import { CareHeader, CareLogo } from '@/components/care/CareHeader';
import { CareMonitor } from '@/components/care/CareMonitor';
import { CarePricing } from '@/components/care/CarePricing';
import { CareRequestForm } from '@/components/care/CareRequestForm';
import { useCareMotion } from '@/components/care/useCareMotion';
import type { CareInterest } from '@/components/care/careRequestSchema';
import { FaqList, type FaqItem } from '@/components/page/FaqList';
import { useScrollOnNavigation } from '@/hooks/useScrollOnNavigation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { config } from '@/config';
import { paths } from '@/routes/paths';

type ServiceItem = { number: string; title: string; body: string; detail: string };
type Step = { title: string; body: string };

export const CarePage = () => {
  const { t } = useTranslation('care');
  const [interest, setInterest] = useState<CareInterest>('HEALTH_CHECK');
  const [motionPaused, setMotionPaused] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  useCareMotion(scope, motionPaused);
  useScrollOnNavigation();
  useScrollReveal();
  const services = t('service.items', { returnObjects: true }) as ServiceItem[];
  const steps = t('monitor.steps', { returnObjects: true }) as Step[];

  return (
    <div ref={scope} className="horizon horizon-site care-page" id="care-top">
      <a className="care-skip" href="#care-main">{t('nav.skip')}</a>
      <CareHeader />
      <main id="care-main">
        <section className="hz-hero care-hero" aria-labelledby="care-hero-title">
          <div className="hz-container hz-hero-inner">
            <div className="hz-hero-copy"><HorizonLabel>{t('hero.eyebrow')}</HorizonLabel><h1 id="care-hero-title"><span>{t('hero.line1')}</span><span>{t('hero.line2')}</span><em>{t('hero.line3')}</em></h1><p className="hz-hero-lead">{t('hero.lead')}</p><div className="hz-hero-actions"><a className="hz-button" href="#contact-care" onClick={() => setInterest('HEALTH_CHECK')}>{t('hero.cta')}<HorizonArrow diagonal /></a><span>{t('hero.note')}</span></div></div>
            <div className="care-hero-visual"><div className="care-hero-art" aria-hidden="true"><div className="care-hero-orbit care-hero-orbit-outer" /><div className="care-hero-orbit care-hero-orbit-inner" /><div className="care-hero-satellite"><div className="care-hero-orbit-dot" /></div><HorizonSun className="care-hero-sun" /><div className="care-hero-vigilance"><span>24/7</span><p>{t('hero.watch')}</p></div><span className="care-hero-art-note">{t('hero.artNote')}</span></div><button type="button" className="care-motion-toggle" aria-label={t(motionPaused ? 'hero.resumeMotion' : 'hero.pauseMotion')} title={t(motionPaused ? 'hero.resumeMotion' : 'hero.pauseMotion')} onClick={() => setMotionPaused(!motionPaused)}><svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">{motionPaused ? <path d="m5 3 8 5-8 5Z" /> : <path d="M4 3h2v10H4zm6 0h2v10h-2z" />}</svg></button></div>
          </div>
          <div className="hz-container hz-hero-footer"><a href="#accompagnement" className="hz-explore"><span className="hz-explore-icon"><HorizonArrow /></span>{t('hero.explore')}</a><div className="care-hero-caption"><span className="hz-photo-kicker">{t('hero.location')}</span><span className="hz-photo-caption">{t('hero.caption')}</span></div></div>
        </section>

        <section className="hz-proof" aria-label={t('proof.label')}><div className="hz-container hz-proof-inner"><p className="hz-proof-intro"><HorizonSun />{t('proof.intro')}</p><dl>{(['monitor', 'clean', 'area'] as const).map((key) => <div key={key}><dt>{t(`proof.${key}`)}</dt><dd>{t(`proof.${key}Value`)}</dd></div>)}</dl></div></section>

        <section className="hz-section care-services" id="accompagnement" aria-labelledby="care-services-title"><div className="hz-container">
          <div className="hz-section-heading" data-reveal><div><HorizonLabel>{t('service.eyebrow')}</HorizonLabel><h2 id="care-services-title">{t('service.title')}<br /><em>{t('service.accent')}</em></h2></div><p className="hz-section-intro">{t('service.intro')}</p></div>
          <div className="care-services-grid">{services.map((service, index) => <article className="care-service" key={service.number} data-reveal>
            <div className={`care-service-visual care-service-visual-${index}`}>
              {index === 0 ? <div className="care-watch-visual" aria-hidden="true"><div className="care-watch-ring" /><div className="care-watch-ring care-watch-ring-two" /><HorizonSun /><span>24/7</span></div> : <img src={index === 1 ? '/images/solar/care-maintenance.webp' : '/images/team-showroom-enhanced.webp'} alt={t(index === 1 ? 'service.maintenanceAlt' : 'service.teamAlt')} width={index === 1 ? 800 : 1857} height={index === 1 ? 800 : 847} loading="lazy" />}
              <span className="care-service-number">{service.number}</span>
            </div><p className="hz-overline">{service.detail}</p><h3>{service.title}</h3><p className="care-body">{service.body}</p>
          </article>)}</div>
          <p className="care-service-note">{t('service.note')}</p>
        </div></section>

        <section className="care-monitor-section hz-section" aria-labelledby="care-monitor-title"><div className="hz-container care-split">
          <div data-reveal><HorizonLabel>{t('monitor.eyebrow')}</HorizonLabel><h2 id="care-monitor-title">{t('monitor.title')}<br /><em>{t('monitor.accent')}</em></h2><p className="care-section-lead">{t('monitor.body')}</p><ol className="care-process">{steps.map((step, index) => <li key={step.title}><span>{`0${index + 1}`}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></div>
          <div className="care-monitor-wrap" data-reveal><CareMonitor /><p className="care-monitor-note"><HorizonSun />{t('monitor.report')}</p></div>
          <div className="care-brands"><span className="hz-overline">{t('monitor.brands')}</span><p>{t('monitor.brandsNote')}</p></div>
        </div></section>

        <CarePricing onChoose={setInterest} />

        <section className="care-takeover hz-section" id="reprise" aria-labelledby="care-takeover-title"><div className="hz-container care-split">
          <div className="care-takeover-photo" data-reveal><img src="/images/projects/saint-jeannet-villa-6-kwc-villa-drone.webp" alt={t('takeover.photoAlt')} width="1280" height="960" loading="lazy" /><span className="care-photo-label">Saint-Jeannet · 06</span></div>
          <div data-reveal><HorizonLabel>{t('takeover.eyebrow')}</HorizonLabel><h2 id="care-takeover-title">{t('takeover.title')}<br /><em>{t('takeover.accent')}</em></h2><p className="care-section-lead">{t('takeover.body')}</p><div className="care-audit"><strong>{t('takeover.audit')}</strong><span>{t('takeover.auditLabel')}</span></div><p className="care-body">{t('takeover.subscription')}</p><p className="care-small">{t('takeover.note')}</p><a href="#contact-care" className="hz-button" onClick={() => setInterest('TAKEOVER')}>{t('takeover.cta')}<HorizonArrow diagonal /></a></div>
        </div></section>

        <section className="care-warranty hz-section" aria-labelledby="care-warranty-title"><div className="hz-container care-split">
          <div data-reveal><HorizonLabel>{t('warranty.eyebrow')}</HorizonLabel><h2 id="care-warranty-title">{t('warranty.title')}<br /><em>{t('warranty.accent')}</em></h2><p className="care-section-lead">{t('warranty.body')}</p></div>
          <div data-reveal><ol className="care-warranty-steps">{(t('warranty.steps', { returnObjects: true }) as string[]).map((step, index) => <li key={step}><span>{`0${index + 1}`}</span><p>{step}</p><HorizonArrow /></li>)}</ol><p className="care-small">{t('warranty.note')}</p></div>
        </div></section>

        <section className="care-business hz-section" aria-label={t('business.eyebrow')}><div className="hz-container"><HorizonLabel>{t('business.eyebrow')}</HorizonLabel><div className="care-business-grid">{(['pro', 'partner'] as const).map((key) => <article key={key}><h2>{t(`business.${key}Title`)}</h2><p className="care-body">{t(`business.${key}Body`)}</p><a href="#contact-care" className="hz-text-link" onClick={() => setInterest(key === 'pro' ? 'PRO' : 'PARTNER')}>{t(`business.${key}Cta`)}<HorizonArrow diagonal /></a></article>)}</div></div></section>

        <section className="care-faq hz-section" aria-labelledby="care-faq-title"><div className="hz-container care-split"><div><HorizonLabel>{t('faq.eyebrow')}</HorizonLabel><h2 id="care-faq-title">{t('faq.title')}<br /><em>{t('faq.accent')}</em></h2></div><FaqList items={t('faq.items', { returnObjects: true }) as FaqItem[]} className="care-faq-list" accentClassName="care-faq-plus" /></div></section>

        <section className="care-contact hz-section" id="contact-care" aria-labelledby="care-contact-title"><div className="hz-container care-split"><div><HorizonLabel>{t('contact.eyebrow')}</HorizonLabel><h2 id="care-contact-title">{t('contact.title')}<br /><em>{t('contact.accent')}</em></h2><p className="care-section-lead">{t('contact.body')}</p><div className="care-contact-details"><span className="hz-overline">{t('contact.team')}</span><a className="care-contact-phone" href={config.carePhoneHref}>{t('contact.phone')}</a><a href={`mailto:${config.careEmail}`}>{config.careEmail}</a><address>{t('contact.address')}</address></div><HorizonSun className="care-contact-sun" /></div><CareRequestForm interest={interest} onInterestChange={setInterest} /></div></section>
      </main>

      <footer className="care-footer"><div className="hz-container"><div className="care-footer-top"><div><CareLogo /><p>{t('footer.tagline')}</p></div><Link to={paths.home} className="hz-text-link">{t('footer.back')}<HorizonArrow diagonal /></Link><a href="#care-top" className="care-back-top" aria-label={t('footer.top')}><HorizonArrow /></a></div><div className="care-footer-bottom"><p>{t('footer.legal')}<br />{t('footer.address')}</p><a href={`mailto:${config.careEmail}`}>{t('footer.contact')}<HorizonArrow diagonal /></a></div></div></footer>
    </div>
  );
};
