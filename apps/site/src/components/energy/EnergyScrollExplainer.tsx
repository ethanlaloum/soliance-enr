import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SolarEnergyIllustration } from './SolarEnergyIllustration';
import { ChargerEnergyIllustration } from './ChargerEnergyIllustration';
import './energy-premium.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { variant: 'solar' | 'charge' };
const chapters = ['capture', 'control', 'use'] as const;

export const EnergyScrollExplainer = ({ variant }: Props) => {
  const { t, i18n } = useTranslation(variant === 'solar' ? 'solar' : 'evCharger');
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = root.current;
    const panel = stage.current;
    if (!section || !panel) return;
    const select = gsap.utils.selector(section);
    const part = (name: string) => select(`[data-energy-part="${name}"]`);
    const descriptions = Array.from(section.querySelectorAll<HTMLElement>('[data-energy-chapter]'));
    const annotations = Array.from(section.querySelectorAll<SVGGElement>('[data-energy-annotation]'));
    const indicators = Array.from(section.querySelectorAll<HTMLElement>('[data-energy-indicator]'));
    const current = section.querySelector<HTMLElement>('[data-energy-current]');
    const media = gsap.matchMedia();

    media.add({
      desktop: '(min-width: 960px)',
      mobile: '(max-width: 959px)',
      desktopHeight: '(min-height: 540px)',
      mobileHeight: '(min-height: 640px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, desktopHeight, mobileHeight, reduceMotion } = context.conditions as Record<string, boolean>;
      if (reduceMotion || !(desktop ? desktopHeight : mobileHeight)) return;
      section.setAttribute('data-energy-enhanced', '');
      gsap.set(descriptions.slice(1), { autoAlpha: 0, y: 18 });
      gsap.set(annotations.slice(1), { autoAlpha: 0 });
      gsap.set('.energy-lab__progress-fill', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('[data-energy-line]', { strokeDasharray: 1, strokeDashoffset: 1 });
      let activeChapter = -1;
      const setChapter = (index: number) => {
        if (activeChapter === index) return;
        activeChapter = index;
        section.setAttribute('data-energy-phase', `${index}`);
        descriptions.forEach((description, chapterIndex) => description.setAttribute('aria-hidden', `${chapterIndex !== index}`));
        indicators.forEach((indicator, chapterIndex) => indicator.setAttribute('data-current', `${chapterIndex === index}`));
        if (current) current.textContent = `${index + 1}`.padStart(2, '0');
      };

      const timeline = gsap.timeline({
        defaults: { duration: 0.7, ease: 'power2.inOut' },
        onUpdate: () => setChapter(timeline.time() >= 2.8 ? 2 : timeline.time() >= 1.5 ? 1 : 0),
        scrollTrigger: {
          id: `${variant}-energy-explainer`, trigger: section, pin: panel,
          start: 'top top', end: () => `+=${Math.round(window.innerHeight * (desktop ? 2.6 : 2.3))}`,
          scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      setChapter(0);
      timeline.addLabel('open', 0).addLabel('convert', 1.5).addLabel('use', 2.8);
      timeline.to('.energy-lab__progress-fill', { scaleX: 1, duration: 4.25, ease: 'none' }, 0);
      timeline.to(descriptions[0], { autoAlpha: 0, y: -16, duration: 0.25 }, 1.35)
        .fromTo(descriptions[1], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.55)
        .to(descriptions[1], { autoAlpha: 0, y: -16, duration: 0.25 }, 2.65)
        .fromTo(descriptions[2], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.85)
        .to(annotations[0], { autoAlpha: 0, duration: 0.25 }, 1.3)
        .to(annotations[1], { autoAlpha: 1, duration: 0.35 }, 1.8)
        .to(annotations[1], { autoAlpha: 0, duration: 0.25 }, 2.65)
        .to(annotations[2], { autoAlpha: 1, duration: 0.35 }, 3.2);

      if (variant === 'solar') {
        gsap.set([...part('inverter'), ...part('battery'), ...part('home'), ...part('conversion-flow'), ...part('storage-flow'), ...part('sun-rays')], { autoAlpha: 0 });
        gsap.set([...part('inverter'), ...part('battery'), ...part('home')], { scale: 0.85, transformOrigin: 'center center' });
        timeline.to(part('glass'), { x: -18, y: -82, duration: 0.9 }, 0.12)
          .to(part('cells'), { x: -6, y: -27, duration: 0.9 }, 0.12)
          .to(part('backplate'), { x: 13, y: 32, duration: 0.9 }, 0.12)
          .to(part('sun-rays'), { autoAlpha: 1, duration: 0.6 }, 0.3)
          .to(part('sun-glow'), { scale: 1.1, duration: 1.2, transformOrigin: 'center center' }, 0)
          .to([...part('glass'), ...part('cells'), ...part('backplate')], { x: 0, y: 0, duration: 0.65 }, 1.4)
          .to(part('solar-panel'), { x: -95, y: -90, scale: 0.65, transformOrigin: '350px 250px', duration: 0.9 }, 1.4)
          .to(part('sun-rays'), { autoAlpha: 0, duration: 0.3 }, 1.35)
          .to(part('inverter'), { autoAlpha: 1, scale: 1, duration: 0.75 }, 1.55)
          .to(part('conversion-flow'), { autoAlpha: 1, duration: 0.3 }, 1.8)
          .to(select('[data-energy-part="conversion-flow"] [data-energy-line]'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 1.85)
          .to([...part('battery'), ...part('home')], { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12 }, 2.85)
          .to(part('storage-flow'), { autoAlpha: 1, duration: 0.3 }, 3.05)
          .to(select('[data-energy-part="storage-flow"] [data-energy-line]'), { strokeDashoffset: 0, duration: 0.85, ease: 'none' }, 3.1);
      } else {
        gsap.set([...part('solar-source'), ...part('charge-meter'), ...part('vehicle'), ...part('charge-flow'), ...part('vehicle-flow')], { autoAlpha: 0 });
        gsap.set([...part('solar-source'), ...part('charge-meter'), ...part('vehicle')], { scale: 0.85, transformOrigin: 'center center' });
        timeline.to(part('charger-cover'), { x: 108, y: -65, duration: 0.9 }, 0.12)
          .to(part('charger-board'), { x: 22, y: -13, duration: 0.9 }, 0.12)
          .to(part('charger-backplate'), { x: -64, y: 28, duration: 0.9 }, 0.12)
          .to(part('charger-cable'), { x: 76, y: 15, duration: 0.9 }, 0.12)
          .to([...part('charger-cover'), ...part('charger-board'), ...part('charger-backplate'), ...part('charger-cable')], { x: 0, y: 0, duration: 0.65 }, 1.4)
          .to(part('wallbox'), { scale: 0.88, x: -15, y: -12, transformOrigin: '390px 280px', duration: 0.9 }, 1.4)
          .to([...part('solar-source'), ...part('charge-meter')], { autoAlpha: 1, scale: 1, duration: 0.75, stagger: 0.1 }, 1.55)
          .to(part('charge-flow'), { autoAlpha: 1, duration: 0.3 }, 1.8)
          .to(select('[data-energy-part="charge-flow"] [data-energy-line]'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 1.85)
          .to(part('wallbox'), { scale: 0.75, x: -65, y: -40, duration: 0.85 }, 2.75)
          .to([...part('solar-source'), ...part('charge-meter')], { autoAlpha: 0.5, duration: 0.6 }, 2.75)
          .to(part('charge-flow'), { autoAlpha: 0.5, duration: 0.6 }, 2.75)
          .to(part('vehicle'), { autoAlpha: 1, scale: 1, duration: 0.85 }, 2.85)
          .to(part('vehicle-flow'), { autoAlpha: 1, duration: 0.3 }, 3.1)
          .to(select('[data-energy-part="vehicle-flow"] [data-energy-line]'), { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 3.15)
          .fromTo(part('vehicle-battery'), { opacity: 0.35 }, { opacity: 1, duration: 0.8 }, 3.25);
      }

      return () => {
        section.removeAttribute('data-energy-enhanced');
        section.removeAttribute('data-energy-phase');
        descriptions.forEach((description) => description.removeAttribute('aria-hidden'));
        indicators.forEach((indicator) => indicator.removeAttribute('data-current'));
        if (current) current.textContent = '01';
      };
    }, section);

    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, { scope: root, dependencies: [variant, i18n.resolvedLanguage], revertOnUpdate: true });

  const labels = Object.fromEntries(['glass', 'cells', 'frame', 'inverter', 'battery', 'home', 'shell', 'electronics', 'connector', 'solar', 'meter', 'vehicle'].map((key) => [key, t(`explainer.labels.${key}`)]));
  const source = variant === 'solar'
    ? 'https://www.enedis.fr/faq/autoconsom-mation-produire-et-consommer-son-electricite/autoconsommation-avec-le-photovoltaique'
    : 'https://support.wallbox.com/fr/knowledge-base/comment-activer-et-utiliser-eco-smart/';

  return (
    <section ref={root} id={`${variant}-energy-story`} className={`energy-lab energy-lab--${variant}`} aria-labelledby={`${variant}-energy-title`}>
      <div ref={stage} className="energy-lab__stage">
        <header className="energy-lab__header">
          <p className="energy-lab__eyebrow"><span />{t('explainer.eyebrow')}</p>
          <h2 id={`${variant}-energy-title`}>{t('explainer.title')} <span>{t('explainer.accent')}</span></h2>
          <p className="energy-lab__scroll-hint">{t('explainer.scroll')}<span aria-hidden="true">↓</span></p>
          <a href={variant === 'solar' ? '#solar-sizes-title' : '#usages-title'} className="energy-lab__skip">{t('explainer.skip')}<span aria-hidden="true">↘</span></a>
        </header>
        <div className="energy-lab__body">
          <div className="energy-lab__visual">
            {variant === 'solar' ? <SolarEnergyIllustration labels={labels} /> : <ChargerEnergyIllustration labels={labels} />}
            <span className="energy-lab__visual-note">{t('explainer.diagramNote')}</span>
          </div>
          <div className="energy-lab__story">
            {chapters.map((key, index) => (
              <article key={key} className="energy-lab__chapter" data-energy-chapter>
                <p className="energy-lab__chapter-label"><span>{`${index + 1}`.padStart(2, '0')}</span>{t(`explainer.chapters.${key}.label`)}</p>
                <h3>{t(`explainer.chapters.${key}.title`)}</h3>
                <p className="energy-lab__chapter-text">{t(`explainer.chapters.${key}.body`)}</p>
                <div className="energy-lab__chapter-detail"><span aria-hidden="true">↗</span>{t(`explainer.chapters.${key}.detail`)}</div>
              </article>
            ))}
          </div>
        </div>
        <footer className="energy-lab__footer">
          <div className="energy-lab__steps" aria-hidden="true">{chapters.map((key) => <span key={key} data-energy-indicator>{t(`explainer.chapters.${key}.label`)}</span>)}</div>
          <div className="energy-lab__progress" aria-hidden="true"><span className="energy-lab__progress-fill" /></div>
          <span className="energy-lab__count" aria-hidden="true"><strong data-energy-current>01</strong> / 03</span>
          <a href={source} target="_blank" rel="noreferrer" className="energy-lab__source">{t('explainer.source')}<span aria-hidden="true">↗</span></a>
        </footer>
      </div>
    </section>
  );
};
