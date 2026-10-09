import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons/Icons';
import { EnergyGlyph } from '@/components/home/EnergyGlyph';
import { containerClassName } from '@/components/home/containerClassName';
import { paths } from '@/routes/paths';

const branches = [
  { key: 'heatPump', x: 145, path: 'M400 300V332Q400 356 376 356H169Q145 356 145 380V399', to: paths.heatPump },
  { key: 'battery', x: 400, path: 'M400 300V399', to: paths.solar },
  { key: 'evCharger', x: 655, path: 'M400 300V332Q400 356 424 356H631Q655 356 655 380V399', to: paths.evCharger },
] as const;

export const EnergyFlowSection = () => {
  const { t } = useTranslation('home');

  return (
    <section className="energy-story" data-energy-story aria-labelledby="energy-story-title">
      <div className={`${containerClassName} energy-story__layout`}>
        <div className="energy-story__copy">
          <p className="home-kicker" data-reveal>{t('flow.eyebrow')}</p>
          <h2 id="energy-story-title" className="energy-story__title" data-reveal>
            {t('flow.title')} <span>{t('flow.titleAccent')}</span>
          </h2>
          <p className="energy-story__lead" data-reveal>{t('flow.lead')}</p>
          <div className="energy-story__signature" aria-hidden="true">
            <span className="energy-story__signature-line"><span data-energy-signature /></span>
            <span>{t('flow.signature')}</span>
          </div>
        </div>
        <div className="energy-story__system">
          <p className="energy-story__mobile-heading" aria-hidden="true">{t('flow.stageTitle')}</p>
          <svg className="energy-diagram" viewBox="0 0 800 490" fill="none" aria-hidden="true">
            <circle cx="400" cy="260" r="232" className="energy-diagram__orbit" />
            <circle cx="400" cy="260" r="182" className="energy-diagram__orbit" strokeDasharray="2 12" />
            <g data-energy-sun className="energy-diagram__sun">
              <circle cx="123" cy="94" r="29" /><circle cx="123" cy="94" r="42" opacity=".2" />
              <path d="M123 35v9m0 100v9M64 94h9m100 0h9M81 52l7 7m70 70 7 7M81 136l7-7m70-70 7-7" />
            </g>
            <path d="M153 94C241 27 352 48 400 161" className="energy-diagram__track" />
            <path data-energy-path="source" d="M153 94C241 27 352 48 400 161" className="energy-diagram__current energy-diagram__current--solar" />
            <g className="energy-diagram__house" data-energy-house>
              <path d="M248 220 400 117l152 103M270 221v102h260V221" />
              <path d="M281 230h238M294 323v-70h47v70m118-64h47v43h-47zM482 259v43m-23-21h47" />
              <path d="m350 189 50-34 58 40-51 34z" className="energy-diagram__panels" />
              <path d="m367 178 57 40m-40-52 57 40m-74-5 51-34m-33 47 50-34" className="energy-diagram__panels" />
              <path d="M552 323h33m-370 0h33" opacity=".4" />
            </g>
            <path d="M400 229v71" className="energy-diagram__track" />
            <path data-energy-path="home" d="M400 229v71" className="energy-diagram__current energy-diagram__current--solar" />
            <circle cx="400" cy="300" r="5" className="energy-diagram__junction" />
            {branches.map((branch) => (
              <g key={branch.key}>
                <path d={branch.path} className="energy-diagram__track" />
                <path data-energy-path={branch.key === 'battery' ? 'storage' : 'use'} d={branch.path} className="energy-diagram__current" />
                <g data-energy-node={branch.key} transform={`translate(${branch.x} 430)`}>
                  <circle r="31" className="energy-diagram__node" />
                  <svg x="-18" y="-18" width="36" height="36" viewBox="0 0 48 48"><EnergyGlyph kind={branch.key} /></svg>
                </g>
              </g>
            ))}
          </svg>
          <div className="energy-story__uses">
            {branches.map((branch) => (
              <Link key={branch.key} to={branch.to} className="energy-story__use" data-energy-use>
                <span>{t(`flow.uses.${branch.key}.title`)}</span>
                <span>{t(`flow.uses.${branch.key}.description`)} <ArrowRightIcon className="h-3 w-3" /></span>
              </Link>
            ))}
          </div>
          <ol className="energy-story__phases" aria-label={t('flow.phaseLabel')}>
            {['produce', 'store', 'use'].map((phase) => <li key={phase} data-energy-phase><span aria-hidden="true" />{t(`flow.phases.${phase}`)}</li>)}
          </ol>
          <p className="energy-story__cue" data-energy-cue aria-hidden="true"><span>↓</span> {t('flow.scrollCue')}</p>
          <p className="energy-story__note">{t('flow.note')}</p>
        </div>
      </div>
    </section>
  );
};
