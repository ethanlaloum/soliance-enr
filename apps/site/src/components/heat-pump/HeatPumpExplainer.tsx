import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { HeatPumpDiagram } from '@/components/heat-pump/HeatPumpDiagram';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const phases = ['capture', 'compress', 'comfort'] as const;

export const HeatPumpExplainer = () => {
  const { t } = useTranslation('heatPump');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 1024px)',
      mobile: '(max-width: 1023px)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, context => {
      if (context.conditions?.reduce) return;
      const desktop = Boolean(context.conditions?.desktop);
      const stage = section.querySelector<HTMLElement>('[data-heat-stage]');
      if (!stage) return;
      stage.dataset.motion = 'enhanced';

      const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-heat-phase]'));
      const meters = Array.from(section.querySelectorAll<HTMLElement>('[data-heat-phase-meter]'));
      const routes = Array.from(section.querySelectorAll<SVGPathElement>('[data-heat-cold-route], [data-heat-warm-route], [data-heat-return-route], [data-heat-air-stream]'));
      const lengths = routes.map(path => path.getTotalLength());

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 18 });
      gsap.set(meters, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('[data-heat-part-labels], [data-heat-house], [data-heat-cycle], [data-heat-air]', { autoAlpha: 0 });
      routes.forEach((path, index) => gsap.set(path, { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] }));
      gsap.set('[data-heat-energy-particle]', { autoAlpha: 0, x: 691, y: 411 });

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          id: 'heat-pump-exploded-view',
          trigger: stage,
          start: 'top 20px',
          end: () => `+=${desktop ? Math.max(1500, window.innerHeight * 2.15) : Math.max(1050, window.innerHeight * 1.7)}`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel('capture', 0)
        .to('[data-heat-shell-front]', { x: -126, y: 122, rotation: -4, svgOrigin: '310 457', opacity: 0.12, duration: 1 }, 'capture')
        .to('[data-heat-shell-top]', { x: 35, y: -145, opacity: 0.22, duration: 1 }, 'capture')
        .to('[data-heat-shell-side]', { x: 140, y: 118, opacity: 0.16, duration: 1 }, 'capture')
        .to('[data-heat-fan]', { x: -105, y: 30, duration: 1 }, 'capture')
        .to('[data-heat-evaporator]', { x: -5, y: -102, duration: 1 }, 'capture')
        .to('[data-heat-compressor]', { x: 102, y: 80, duration: 1 }, 'capture')
        .to('[data-heat-condenser]', { x: 138, y: -80, duration: 1 }, 'capture')
        .to('[data-heat-base]', { opacity: 0.2, duration: 0.8 }, 'capture')
        .to('[data-heat-shadow]', { scaleX: 1.2, transformOrigin: 'center', opacity: 0.6, duration: 1 }, 'capture')
        .to('[data-heat-fan-blades]', { rotation: 720, svgOrigin: '424 339', duration: 4.3, ease: 'none' }, 'capture')
        .to('[data-heat-air]', { autoAlpha: 1, duration: 0.35 }, 0.45)
        .to('[data-heat-air-stream]', { strokeDashoffset: 0, duration: 0.75, stagger: 0.08 }, 0.55)
        .to('[data-heat-part-labels]', { autoAlpha: 1, duration: 0.35 }, 0.8)
        .to(meters[0], { scaleX: 1, duration: 1.35, ease: 'none' }, 0)
        .addLabel('compress', 1.4)
        .to(panels[0], { autoAlpha: 0, y: -16, duration: 0.22 }, 'compress')
        .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.35 }, 'compress+=0.12')
        .to('[data-heat-cycle]', { autoAlpha: 1, duration: 0.3 }, 'compress')
        .to('[data-heat-cold-route]', { strokeDashoffset: 0, duration: 0.75, ease: 'none' }, 'compress+=0.15')
        .to('[data-heat-compressor-light]', { scale: 2.4, transformOrigin: 'center', fill: '#e0a161', duration: 0.5, repeat: 1, yoyo: true }, 'compress+=0.1')
        .to(meters[1], { scaleX: 1, duration: 1.25, ease: 'none' }, 'compress')
        .addLabel('comfort', 2.8)
        .to(panels[1], { autoAlpha: 0, y: -16, duration: 0.22 }, 'comfort')
        .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.35 }, 'comfort+=0.12')
        .to('[data-heat-house]', { autoAlpha: 1, duration: 0.55 }, 'comfort')
        .to('[data-heat-warm-route]', { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 'comfort')
        .to('[data-heat-return-route]', { strokeDashoffset: 0, duration: 0.8, ease: 'none' }, 'comfort+=0.45')
        .to('[data-heat-energy-particle]', { autoAlpha: 1, duration: 0.1 }, 'comfort+=0.1')
        .to('[data-heat-energy-particle]', { x: 691, y: 214, duration: 0.4, ease: 'none' }, 'comfort+=0.2')
        .to('[data-heat-energy-particle]', { x: 787, y: 214, duration: 0.3, ease: 'none' }, 'comfort+=0.6')
        .to('[data-heat-energy-particle]', { x: 787, y: 285, duration: 0.18, ease: 'none' }, 'comfort+=0.9')
        .to('[data-heat-energy-particle]', { autoAlpha: 0, duration: 0.15 }, 'comfort+=1.23')
        .to(meters[2], { scaleX: 1, duration: 1.4, ease: 'none' }, 'comfort')
        .to({}, { duration: 0.35 });

      return () => { delete stage.dataset.motion; };
    }, section);
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="comprendre-la-pac" aria-labelledby="heat-pump-explainer-title" className="heat-explainer">
      <div className={cn(containerClassName, 'heat-explainer__inner')}>
        <div data-heat-stage className="heat-explainer__stage">
          <div className="heat-explainer__header">
            <div>
              <p className="heat-premium-eyebrow">{t('explainer.eyebrow')}</p>
              <h2 id="heat-pump-explainer-title">{t('explainer.title')} <span>{t('explainer.titleAccent')}</span></h2>
            </div>
            <a href="#heat-pump-solutions-title" className="heat-explainer__skip">{t('explainer.skip')} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="heat-explainer__body">
            <div className="heat-explainer__visual">
              <div className="heat-explainer__grid" aria-hidden="true" />
              <HeatPumpDiagram />
              <p className="heat-explainer__diagram-note">{t('explainer.diagramNote')}</p>
            </div>
            <div className="heat-explainer__story">
              <div className="heat-explainer__phases">
                {phases.map((phase, index) => (
                  <article key={phase} data-heat-phase className="heat-explainer__phase">
                    <p className="heat-explainer__phase-index">0{index + 1} <span>{t(`explainer.phases.${phase}.label`)}</span></p>
                    <h3>{t(`explainer.phases.${phase}.title`)}</h3>
                    <p>{t(`explainer.phases.${phase}.description`)}</p>
                    <div className="heat-explainer__phase-chip"><span aria-hidden="true" />{t(`explainer.phases.${phase}.chip`)}</div>
                  </article>
                ))}
              </div>
              <div className="heat-explainer__progress" aria-hidden="true">
                {phases.map(phase => <span key={phase}><i data-heat-phase-meter /></span>)}
              </div>
              <p className="heat-explainer__scroll-hint"><span aria-hidden="true">↓</span>{t('explainer.scrollHint')}</p>
            </div>
          </div>
          <a className="heat-explainer__source" href="https://agirpourlatransition.ademe.fr/particuliers/amenager-maison/chauffer/pompe-chaleur" target="_blank" rel="noreferrer">{t('explainer.source')} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
};
