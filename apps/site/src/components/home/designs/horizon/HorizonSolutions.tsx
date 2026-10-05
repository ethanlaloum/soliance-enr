import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { solutionEntries } from '@/components/home/designs/homeContent';
import { HorizonArrow, HorizonLabel } from './HorizonParts';

const horizonSolutions = solutionEntries.map((entry) => entry.key === 'solar'
  ? { ...entry, image: '/images/projects/vence-villa-16-kwc-panels-hills.webp', imageHeight: 600, objectPosition: '60% 65%' }
  : entry);

export const HorizonSolutions = () => {
  const { t } = useTranslation('home');
  const [selected, setSelected] = useState(0);

  return (
    <section id="horizon-solutions" className="hz-section hz-solutions hz-container" aria-labelledby="hz-solutions-title">
      <div className="hz-section-heading" data-hz-reveal>
        <div>
          <HorizonLabel>{t('horizon.solutions.eyebrow')}</HorizonLabel>
          <h2 id="hz-solutions-title">{t('horizon.solutions.title')}<br /><em>{t('horizon.solutions.accent')}</em></h2>
        </div>
        <p className="hz-section-intro">{t('horizon.solutions.intro')}</p>
      </div>
      <div className="hz-solution-layout" data-hz-reveal>
        <div className="hz-solution-photos" aria-hidden="true">
          {horizonSolutions.map((entry, index) => (
            <img key={entry.key} src={entry.image} alt="" width="900" height={entry.imageHeight} loading="lazy" className={index === selected ? 'is-active' : ''} style={{ objectPosition: entry.objectPosition }} />
          ))}
          <span className="hz-photo-counter">0{selected + 1}<span> / 03</span></span>
        </div>
        <div className="hz-solution-list">
          {horizonSolutions.map((entry, index) => (
            <div className={`hz-solution-item ${selected === index ? 'is-active' : ''}`} key={entry.key}>
              <h3>
                <button type="button" id={`hz-solution-${entry.key}`} aria-expanded={selected === index} aria-controls={`hz-solution-panel-${entry.key}`} onClick={() => setSelected(index)}>
                  <span className="hz-solution-number">0{index + 1}</span>
                  <span><span className="hz-solution-title">{t(`horizon.solutions.${entry.key}.title`)}</span><span className="hz-solution-subtitle">{t(`horizon.solutions.${entry.key}.subtitle`)}</span></span>
                  <span className="hz-toggle" aria-hidden="true">{selected === index ? '−' : '+'}</span>
                </button>
              </h3>
              <div id={`hz-solution-panel-${entry.key}`} role="region" aria-labelledby={`hz-solution-${entry.key}`} hidden={selected !== index} className="hz-solution-panel">
                <p>{t(`horizon.solutions.${entry.key}.description`)}</p>
                <p className="hz-solution-detail">{t(`horizon.solutions.${entry.key}.detail`)}</p>
                <Link to={entry.to} className="hz-text-link">{t('horizon.solutions.discover')}<HorizonArrow diagonal /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
