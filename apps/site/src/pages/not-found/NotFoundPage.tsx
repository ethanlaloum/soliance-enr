import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { contactAnchor, paths } from '@/routes/paths';
import { HorizonArrow, HorizonLabel, HorizonSun } from '@/components/home/designs/horizon/HorizonParts';

const destinations = [
  { key: 'solar', to: paths.solar },
  { key: 'heatPump', to: paths.heatPump },
  { key: 'projects', to: paths.projects },
] as const;

export const NotFoundPage = () => {
  const { t } = useTranslation('common');

  return (
    <div className="horizon hz-not-found">
      <section className="hz-lost-main hz-container" aria-labelledby="not-found-title">
        <div className="hz-lost-copy">
          <HorizonLabel>{t('notFound.eyebrow')}</HorizonLabel>
          <h1 id="not-found-title">{t('notFound.title')}<br /><em>{t('notFound.accent')}</em></h1>
          <p className="hz-lost-description">{t('notFound.description')}</p>
          <div className="hz-lost-actions">
            <Link to={paths.home} className="hz-button">{t('notFound.backHome')}<HorizonArrow /></Link>
            <Link to={`${paths.home}#${contactAnchor}`} className="hz-text-link">{t('notFound.contact')}<HorizonArrow diagonal /></Link>
          </div>
        </div>

        <div className="hz-lost-art" aria-hidden="true">
          <div className="hz-lost-orbit" />
          <div className="hz-lost-code"><span>4</span><HorizonSun className="hz-lost-sun" /><span>4</span></div>
          <div className="hz-lost-horizon" />
          <p>{t('notFound.sunshine')}</p>
        </div>
      </section>

      <nav className="hz-lost-paths hz-container" aria-labelledby="not-found-paths-title">
        <h2 id="not-found-paths-title">{t('notFound.findWay')}</h2>
        <div className="hz-lost-links">
          {destinations.map(({ key, to }, index) => (
            <Link key={key} to={to} className="hz-lost-link">
              <span className="hz-lost-number" aria-hidden="true">0{index + 1}</span>
              <span><span className="hz-lost-link-title">{t(`notFound.links.${key}.title`)}</span><span className="hz-lost-link-note">{t(`notFound.links.${key}.description`)}</span></span>
              <HorizonArrow diagonal />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
