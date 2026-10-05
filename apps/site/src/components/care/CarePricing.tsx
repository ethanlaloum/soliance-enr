import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizonArrow, HorizonLabel } from '@/components/home/designs/horizon/HorizonParts';
import type { CareInterest } from './careRequestSchema';

export const CarePricing = ({ onChoose }: { onChoose: (interest: CareInterest) => void }) => {
  const { t, i18n } = useTranslation('care');
  const [annual, setAnnual] = useState(false);
  const price = (amount: number) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR' }).format(amount);
  const rows = t('plans.compareRows', { returnObjects: true }) as { name: string; price: string }[];

  return (
    <section className="care-pricing hz-section" id="formules" aria-labelledby="care-plans-title">
      <div className="hz-container">
        <div className="hz-section-heading"><div><HorizonLabel>{t('plans.eyebrow')}</HorizonLabel><h2 id="care-plans-title">{t('plans.title')}<br /><em>{t('plans.accent')}</em></h2></div><p className="hz-section-intro">{t('plans.intro')}</p></div>
        <div className="care-billing-row"><div className="care-billing" role="group" aria-label={t('plans.billing')}><button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>{t('plans.monthly')}</button><button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>{t('plans.annual')}</button></div><span>{t('plans.annualHint')}</span></div>
        <div className="care-plans-grid">
          {(['care', 'connect'] as const).map((plan) => <article className={`care-plan care-plan-${plan}`} key={plan}>
            <div className="care-plan-top"><span className="hz-overline">{t(`plans.${plan}Zone`)}</span>{plan === 'care' && <span className="care-founder">{t('plans.founder')}</span>}</div>
            <h3>{t(`plans.${plan}Title`)}</h3><p className="care-plan-lead">{t(`plans.${plan}Lead`)}</p>
            <div className="care-price" aria-live="polite"><strong>{price(plan === 'care' ? annual ? 219.89 : 19.99 : annual ? 49 : 4.99)}</strong><span>{t(annual ? 'plans.yearUnit' : 'plans.monthUnit')}</span></div>
            <p className="care-plan-payment">{t(`plans.${annual ? 'annual' : 'monthly'}${plan === 'care' ? 'Care' : 'Connect'}Note`)}</p>
            {plan === 'care' && <p className="care-founder-note">{t('plans.founderNote')}</p>}
            <ul>{(t(`plans.${plan}Features`, { returnObjects: true }) as string[]).map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
            <p className="care-plan-extra">{t(`plans.${plan}Extra`)}</p>
            <a href="#contact-care" className={plan === 'care' ? 'hz-button' : 'hz-button care-button-outline'} onClick={() => onChoose(plan === 'care' ? 'CARE' : 'CONNECT')}>{t(`plans.${plan}Cta`)}<HorizonArrow diagonal /></a>
          </article>)}
        </div>
        <p className="care-plan-terms">{t('plans.terms')}</p>
        <details className="care-comparison"><summary>{t('plans.compareTitle')}<span aria-hidden="true">+</span></summary><p>{t('plans.compareIntro')}</p><dl>{rows.map((row) => <div key={row.name}><dt>{row.name}</dt><dd>{row.price}</dd></div>)}</dl><p className="care-small">{t('plans.compareNote')}</p></details>
      </div>
    </section>
  );
};
