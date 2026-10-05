import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { contactAnchor, paths, projectPath } from '@/routes/paths';
import { StudyRequestForm } from '@/components/home/StudyRequestForm';
import { stepKeys } from '@/components/home/designs/homeContent';
import { HorizonArrow, HorizonLabel, HorizonSun } from './HorizonParts';
import { HorizonSolutions } from './HorizonSolutions';
import { useHorizonMotion } from './useHorizonMotion';

const featuredProjects = [
  { key: 'first', to: projectPath('saint-jeannet-villa-6-kwc'), image: '/images/projects/saint-jeannet-villa-6-kwc-villa-drone.webp', objectPosition: '42% 60%' },
  { key: 'second', to: `${paths.projects}#project-roquebrune-sur-argens-villa-10-kwc`, image: '/images/projects/roquebrune-sur-argens-villa-10-kwc-pool-sea.webp', objectPosition: '50% 50%' },
] as const;

const EnergyDiagram = () => {
  const { t } = useTranslation('home');
  return (
    <div className="hz-energy-diagram" role="img" aria-label={t('horizon.simulator.diagramLabel')}>
      <div className="hz-orbit hz-orbit-one" /><div className="hz-orbit hz-orbit-two" /><div className="hz-orbit hz-orbit-three" />
      <HorizonSun className="hz-diagram-sun" />
      <div className="hz-energy-line" />
      <div className="hz-energy-home">
        <svg aria-hidden="true" viewBox="0 0 180 160" fill="none">
          <path pathLength="1" d="m20 73 70-49 70 49v72H20V73Z" stroke="currentColor" strokeWidth="1.5" />
          <path pathLength="1" d="m5 76 85-60 85 60M75 145v-40h30v40M40 90h20v20H40zM120 90h20v20h-20z" stroke="currentColor" strokeWidth="1.5" />
          <path pathLength="1" d="m92 36 34 24-24 17-34-24 24-17Zm-12 9 34 24m-29-4 24-17" stroke="#F2A47C" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="hz-energy-stages"><span>01 / {t('horizon.simulator.sun')}</span><span>02 / {t('horizon.simulator.battery')}</span><span>03 / {t('horizon.simulator.home')}</span></div>
      <p>{t('horizon.simulator.diagramNote')}</p>
    </div>
  );
};

export const HorizonHome = () => {
  const { t } = useTranslation('home');
  const rootRef = useRef<HTMLDivElement>(null);
  useHorizonMotion(rootRef);

  return (
    <div ref={rootRef} className="horizon">
      <section className="hz-hero" aria-labelledby="hz-hero-title">
        <div className="hz-hero-photo">
          <div className="hz-hero-image-drift" data-hz-parallax><img src="/images/hero-villa-contemporaine-enhanced.webp" alt={t('horizon.hero.photoAlt')} width="1672" height="941" fetchPriority="high" /></div>
        </div>
        <div className="hz-hero-inner hz-container">
          <div className="hz-hero-copy">
          <HorizonLabel>{t('horizon.hero.eyebrow')}</HorizonLabel>
          <h1 id="hz-hero-title">
            <span>{t('horizon.hero.line1')}</span>
            <span>{t('horizon.hero.line2')}</span>
            <em>{t('horizon.hero.line3')}</em>
          </h1>
          <p className="hz-hero-lead">{t('horizon.hero.lead')}</p>
          <div className="hz-hero-actions"><a href={`#${contactAnchor}`} className="hz-button">{t('horizon.hero.cta')}<HorizonArrow diagonal /></a><span>{t('horizon.hero.note')}</span></div>
          </div>
        </div>
        <div className="hz-hero-footer hz-container">
          <a href="#horizon-solutions" className="hz-explore"><span className="hz-explore-icon"><HorizonArrow /></span>{t('horizon.hero.secondary')}</a>
          <Link to={paths.projects} className="hz-hero-project" aria-label={t('horizon.projects.all')}><span><span className="hz-photo-kicker">{t('horizon.hero.location')}</span><span className="hz-photo-caption">{t('horizon.hero.photoLabel')}</span></span><span className="hz-project-visit"><HorizonArrow diagonal /></span></Link>
        </div>
      </section>

      <section className="hz-proof" aria-label={t('hero.statsLabel')}>
        <div className="hz-container hz-proof-inner">
          <p className="hz-proof-intro"><HorizonSun />{t('horizon.proof.intro')}</p>
          <dl><div><dt>{t('horizon.proof.installations')}</dt><dd>{t('hero.stats.installations.value')}</dd></div><div><dt>{t('horizon.proof.teamLabel')}</dt><dd>{t('horizon.proof.teamValue')}</dd></div><div><dt>{t('horizon.proof.careLabel')}</dt><dd>{t('horizon.proof.careValue')}</dd></div></dl>
        </div>
      </section>

      <HorizonSolutions />

      <section className="hz-projects hz-section" aria-labelledby="hz-projects-title">
        <div className="hz-container">
          <div className="hz-section-heading" data-hz-reveal><div><HorizonLabel>{t('horizon.projects.eyebrow')}</HorizonLabel><h2 id="hz-projects-title">{t('horizon.projects.title')}<br /><em>{t('horizon.projects.accent')}</em></h2></div><Link to={paths.projects} className="hz-text-link">{t('horizon.projects.all')}<HorizonArrow diagonal /></Link></div>
          <div className="hz-project-grid">
            {featuredProjects.map((project) => (
              <Link to={project.to} className="hz-project" key={project.key} data-hz-reveal>
                <div className="hz-project-photo"><div className="hz-project-image-drift" data-hz-parallax><img src={project.image} alt={t(`horizon.projects.${project.key}Alt`)} width="1280" height="720" style={{ objectPosition: project.objectPosition }} loading="lazy" /></div><span className="hz-project-tag">{t(`horizon.projects.${project.key}Tag`)}</span><span className="hz-project-arrow"><HorizonArrow diagonal /></span></div>
                <div className="hz-project-caption"><div><p>{t(`horizon.projects.${project.key}Location`)}</p><h3>{t(`horizon.projects.${project.key}Title`)}</h3></div><span aria-hidden="true">↗</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hz-simulator" aria-labelledby="hz-simulator-title">
        <div className="hz-container hz-simulator-inner">
          <div className="hz-simulator-copy" data-hz-reveal><HorizonLabel>{t('horizon.simulator.eyebrow')}</HorizonLabel><h2 id="hz-simulator-title">{t('horizon.simulator.title')}<br /><em>{t('horizon.simulator.accent')}</em></h2><p>{t('horizon.simulator.lead')}</p><Link to={paths.simulator} className="hz-button hz-button-light">{t('horizon.simulator.cta')}<HorizonArrow diagonal /></Link><span className="hz-small-note">{t('horizon.simulator.note')}</span></div>
          <EnergyDiagram />
        </div>
      </section>

      <section className="hz-team hz-section hz-container" aria-labelledby="hz-team-title">
        <div className="hz-section-heading" data-hz-reveal><div><HorizonLabel>{t('horizon.team.eyebrow')}</HorizonLabel><h2 id="hz-team-title">{t('horizon.team.title')}<br /><em>{t('horizon.team.accent')}</em></h2></div></div>
        <div className="hz-team-grid">
          <figure className="hz-team-photo" data-hz-reveal><img src="/images/team-showroom-enhanced.webp" alt={t('horizon.team.imageAlt')} width="1857" height="847" loading="lazy" /><figcaption><span>{t('horizon.team.caption')}</span><span>06 — Saint-Laurent-du-Var</span></figcaption></figure>
          <div className="hz-team-copy" data-hz-reveal><p className="hz-team-lead">{t('horizon.team.lead')}</p><div className="hz-commitment"><span className="hz-overline">{t('horizon.team.commitment')}</span><p>{t('horizon.team.statement')}</p></div><ul className="hz-trust"><li><span aria-hidden="true">✓</span>{t('hero.trust.rge')}</li><li><span aria-hidden="true">✓</span>{t('hero.trust.decennial')}</li><li><span aria-hidden="true">✓</span>{t('horizon.team.since')}</li></ul><a href={config.showroomMapUrl} target="_blank" rel="noopener noreferrer" className="hz-text-link">{t('horizon.team.visit')}<HorizonArrow diagonal /></a></div>
        </div>
        <div className="hz-process" data-hz-reveal><div><h2>{t('horizon.steps.title')}</h2><p>{t('horizon.steps.intro')}</p></div><ol>{stepKeys.map((key, index) => <li key={key}><details open={index === 0}><summary><span>0{index + 1}</span><h3>{t(`steps.${key}.titleShort`)}</h3><span className="hz-step-toggle" aria-hidden="true" /></summary><p>{t(`steps.${key}.description`)}</p></details></li>)}</ol></div>
      </section>

      <aside className="hz-care hz-container"><HorizonSun /><div><span className="hz-overline">{t('horizon.care.label')}</span><h2>{t('horizon.care.title')}</h2><p>{t('horizon.care.body')}</p></div><a href={config.careUrl} className="hz-text-link">{t('horizon.care.cta')}<HorizonArrow diagonal /></a></aside>

      <section id={contactAnchor} className="hz-contact hz-section" aria-labelledby="hz-contact-title">
        <div className="hz-container hz-contact-inner"><div className="hz-contact-copy" data-hz-reveal><HorizonLabel>{t('horizon.contact.eyebrow')}</HorizonLabel><h2 id="hz-contact-title">{t('horizon.contact.title')}<br /><em>{t('horizon.contact.accent')}</em></h2><p>{t('horizon.contact.lead')}</p><div className="hz-contact-phone"><span className="hz-overline">{t('horizon.contact.phoneLabel')}</span><a href={config.salesPhoneHref}>{t('contact.sales.phone')}<HorizonArrow diagonal /></a></div><div className="hz-contact-address"><span className="hz-overline">{t('horizon.contact.addressLabel')}</span><a href={config.showroomMapUrl} target="_blank" rel="noopener noreferrer">{t('contact.showroom.value')}</a><span>{t('contact.hours.value')}</span></div></div><div className="hz-contact-form"><p className="hz-form-note">{t('horizon.contact.formNote')}</p><StudyRequestForm cardClassName="hz-form" titleClassName="hz-form-title" submitClassName="hz-form-submit" /></div></div>
      </section>
      <div className="hz-signature hz-container" aria-hidden="true"><span>soliance</span><HorizonSun /></div>
    </div>
  );
};
