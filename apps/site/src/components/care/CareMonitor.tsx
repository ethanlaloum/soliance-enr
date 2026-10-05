import { useTranslation } from 'react-i18next';
import { HorizonSun } from '@/components/home/designs/horizon/HorizonParts';

export const CareMonitor = () => {
  const { t } = useTranslation('care');
  return (
    <figure className="care-monitor">
      <div className="care-monitor-heading"><span className="hz-overline">Soliance care</span><HorizonSun /></div>
      <h3>{t('monitor.chartTitle')}</h3>
      <svg className="care-chart" viewBox="0 0 440 190" role="img" aria-label={t('monitor.chartLabel')}>
        <g fill="none" stroke="currentColor" strokeOpacity=".14"><path d="M12 40h416M12 90h416M12 140h416M12 180h416" /></g>
        <path d="M12 175C75 175 94 159 130 115S187 22 220 24 260 54 295 107 367 175 428 175" fill="none" stroke="#b6ada0" strokeWidth="2" strokeDasharray="5 6" />
        <path d="M12 177C75 177 99 161 132 123S187 33 220 35 265 63 296 113 367 177 428 177L428 180H12Z" fill="#bc502d" fillOpacity=".09" />
        <path className="care-chart-line" pathLength="1" d="M12 177C75 177 99 161 132 123S187 33 220 35 265 63 296 113 367 177 428 177" fill="none" stroke="#bc502d" strokeWidth="2.5" />
        <circle cx="220" cy="35" r="5" fill="#bc502d" stroke="#f7f4ee" strokeWidth="3" />
      </svg>
      <div className="care-chart-hours" aria-hidden="true"><span>06:00</span><span>12:00</span><span>18:00</span></div>
      <div className="care-chart-legend"><span>{t('monitor.actual')}</span><span>{t('monitor.expected')}</span></div>
      <figcaption>{t('monitor.example')}</figcaption>
    </figure>
  );
};
