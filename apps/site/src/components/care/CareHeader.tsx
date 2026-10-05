import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { SolianceMark } from '@/components/brand/SolianceLogo';
import { HorizonArrow } from '@/components/home/designs/horizon/HorizonParts';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { paths } from '@/routes/paths';

export const CareLogo = () => <span className="care-logo"><SolianceMark className="care-logo-mark" /><span>Soliance<span className="care-logo-suffix">care</span></span></span>;

const links = [{ id: 'accompagnement', key: 'service' }, { id: 'formules', key: 'plans' }, { id: 'reprise', key: 'takeover' }] as const;

export const CareHeader = () => {
  const { t } = useTranslation('care');
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { isScrolled } = useHeaderVisibility(isOpen);

  return (
    <header className="care-header" data-scrolled={isScrolled} data-menu-open={isOpen} onKeyDown={(event) => {
      if (event.key === 'Escape' && isOpen) { setIsOpen(false); toggleRef.current?.focus(); }
    }}>
      <div className="hz-container care-header-inner">
        <a href="#care-top" aria-label={t('nav.home')} onClick={() => setIsOpen(false)}><CareLogo /></a>
        <nav className="care-desktop-nav" aria-label={t('nav.label')}>
          {links.map(({ id, key }) => <a key={id} href={`#${id}`}>{t(`nav.${key}`)}</a>)}
        </nav>
        <a className="care-header-cta" href="#contact-care">{t('nav.contact')}<HorizonArrow diagonal /></a>
        <button ref={toggleRef} className="care-menu-toggle" type="button" aria-expanded={isOpen} aria-controls="care-mobile-nav" aria-label={t(isOpen ? 'nav.close' : 'nav.open')} onClick={() => setIsOpen(!isOpen)}>
          <span aria-hidden="true">{isOpen ? '×' : <><span /><span /></>}</span>
        </button>
      </div>
      <nav className="care-mobile-nav" id="care-mobile-nav" aria-label={t('nav.label')} hidden={!isOpen}>
        {links.map(({ id, key }) => <a key={id} href={`#${id}`} onClick={() => setIsOpen(false)}>{t(`nav.${key}`)}<HorizonArrow diagonal /></a>)}
        <a href="#contact-care" onClick={() => setIsOpen(false)}>{t('nav.contact')}<HorizonArrow diagonal /></a>
        <Link to={paths.home}>{t('nav.back')}<HorizonArrow diagonal /></Link>
      </nav>
    </header>
  );
};
