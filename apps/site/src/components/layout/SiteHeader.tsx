import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { SolianceLogo } from '@/components/brand/SolianceLogo';
import { ArrowRightIcon, ArrowUpRightIcon, PhoneIcon } from '@/components/icons/Icons';
import './site-header.css';

gsap.registerPlugin(useGSAP);

const solutions = [
  { key: 'solar', to: paths.solar, image: '/images/solution-solar.webp' },
  { key: 'heatPump', to: paths.heatPump, image: '/images/solution-heat-pump.webp' },
  { key: 'evCharger', to: paths.evCharger, image: '/images/solution-ev-charger.webp' },
] as const;

const navItems = [
  { to: paths.professionals, labelKey: 'nav.professionals' },
  { to: paths.projects, labelKey: 'nav.projects' },
  { to: paths.resources, labelKey: 'nav.resources' },
  { to: paths.referral, labelKey: 'nav.referral' },
] as const;

const ChevronIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CareIcon = () => (
  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

const GiftIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v9h16v-9M12 7v14" />
    <rect x="3" y="7" width="18" height="5" rx="1" />
    <path d="M12 7H8a2.5 2.5 0 1 1 2.5-2.5L12 7Zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 7Z" />
  </svg>
);

const SolutionIcon = ({ kind }: { kind: typeof solutions[number]['key'] }) => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'solar' && <path d="m5 5-3 12h20L19 5H5ZM4 11h16M9 5l-1 12M15 5l1 12M12 17v4M8 21h8" />}
    {kind === 'heatPump' && <><rect x="3" y="4" width="18" height="15" rx="3" /><circle cx="10" cy="11.5" r="4" /><path d="m10 7.5 1 4-4.5 2M10 11.5l2.5 3M17 8h1M17 11h1M7 19v2M17 19v2" /></>}
    {kind === 'evCharger' && <><rect x="5" y="3" width="12" height="18" rx="2" /><path d="m12 7-3 5h4l-2 5M17 7h2l2 3v6a2 2 0 0 1-4 0" /></>}
  </svg>
);

const SolutionLinks = ({ onNavigate }: { onNavigate: () => void }) => {
  const { t } = useTranslation('common');

  return (
    <div className="site-header__solutions-grid">
      {solutions.map((solution) => (
        <NavLink
          key={solution.key}
          to={solution.to}
          onClick={onNavigate}
          data-nav-entry
          className={({ isActive }) => cn('site-header__solution', `site-header__solution--${solution.key}`, isActive && 'is-active')}
        >
          <div className="site-header__solution-image" aria-hidden="true">
            <img src={solution.image} alt="" width="400" height="240" loading="lazy" />
            <span className="site-header__solution-tag">{t(`header.solutions.${solution.key}.tag`)}</span>
          </div>
          <span className="site-header__solution-icon"><SolutionIcon kind={solution.key} /></span>
          <span className="site-header__solution-copy">
            <span className="site-header__solution-title">{t(`nav.${solution.key}`)}</span>
            <span className="site-header__solution-description">{t(`header.solutions.${solution.key}.description`)}</span>
          </span>
          <span className="site-header__solution-arrow"><ArrowUpRightIcon /></span>
        </NavLink>
      ))}
    </div>
  );
};

export const SiteHeader = () => {
  const { t } = useTranslation('common');
  const { key: locationKey, pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const solutionsPanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const solutionsButton = useRef<HTMLButtonElement>(null);
  const isAnyMenuOpen = isMenuOpen || isSolutionsOpen;
  const isSolutionActive = solutions.some(({ to }) => pathname === to || pathname.startsWith(`${to}/`));
  const closeMenus = () => { setIsMenuOpen(false); setIsSolutionsOpen(false); };

  useGSAP(() => {
    const panel = isMenuOpen ? menu.current : isSolutionsOpen ? solutionsPanel.current : null;
    if (!panel) return;

    const media = gsap.matchMedia();
    media.add({ reduceMotion: '(prefers-reduced-motion: reduce)', allowMotion: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (context.conditions?.reduceMotion) return;
      gsap.fromTo(panel, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power3.out' });
      gsap.fromTo(panel.querySelectorAll('[data-nav-entry]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.035, ease: 'power3.out' });
    });
    return () => media.revert();
  }, { scope: header, dependencies: [isMenuOpen, isSolutionsOpen], revertOnUpdate: true });

  useEffect(() => { setIsMenuOpen(false); setIsSolutionsOpen(false); }, [locationKey]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1200px)');
    const onBreakpointChange = () => { setIsMenuOpen(false); setIsSolutionsOpen(false); };
    desktop.addEventListener('change', onBreakpointChange);
    return () => desktop.removeEventListener('change', onBreakpointChange);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isAnyMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const restoreFocus = header.current?.contains(document.activeElement);
      setIsMenuOpen(false);
      setIsSolutionsOpen(false);
      if (restoreFocus) (isMenuOpen ? menuButton : solutionsButton).current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setIsMenuOpen(false);
        setIsSolutionsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isAnyMenuOpen, isMenuOpen]);

  return (
    <header
      ref={header}
      className="site-header"
      onBlur={(event) => {
        if (isAnyMenuOpen && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) closeMenus();
      }}
    >
      <div className="site-header__bar">
        <Link to={paths.home} aria-label={t('brand.homeLink')} onClick={closeMenus} className="site-header__brand">
          <SolianceLogo name={t('brand.name')} />
          <span className="site-header__brand-caption">{t('header.brandCaption')}</span>
        </Link>

        <nav aria-label={t('nav.label')} className="site-header__desktop-nav">
          <button
            ref={solutionsButton}
            type="button"
            aria-expanded={isSolutionsOpen}
            aria-controls="solutions-menu"
            className={cn('site-header__nav-link site-header__solutions-trigger', (isSolutionActive || isSolutionsOpen) && 'is-active')}
            onClick={() => setIsSolutionsOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown') return;
              event.preventDefault();
              setIsSolutionsOpen(true);
              requestAnimationFrame(() => solutionsPanel.current?.querySelector('a')?.focus());
            }}
          >
            {t('header.ourSolutions')}<ChevronIcon />
          </button>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenus} className={({ isActive }) => cn('site-header__nav-link', item.to === paths.referral && 'site-header__referral-link', isActive && 'is-active')}>
              {item.to === paths.referral && <GiftIcon />}
              {t(item.labelKey)}
            </NavLink>
          ))}
          <Link to={paths.care} onClick={closeMenus} className="site-header__care-link"><CareIcon />{t('nav.care')}</Link>
        </nav>

        <div className="site-header__actions">
          <a href={config.salesPhoneHref} aria-label={t('header.callLabel')} className="site-header__phone" title={t('header.phoneDisplay')}><PhoneIcon /></a>
          <Link to={paths.simulator} onClick={closeMenus} className="site-header__cta site-header__desktop-cta">{t('header.simulate')}<ArrowUpRightIcon /></Link>
          <Link to={paths.simulator} onClick={closeMenus} className="site-header__cta site-header__compact-cta">{t('header.myProject')}<ArrowUpRightIcon /></Link>
          <button
            ref={menuButton}
            type="button"
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={cn('site-header__menu-button', isMenuOpen && 'is-open')}
          >
            <span className="site-header__menu-label">{t('header.menu')}</span>
            <span aria-hidden="true" className="site-header__menu-glyph"><span /><span /></span>
          </button>
        </div>
      </div>

      {isAnyMenuOpen && <div className="site-header__backdrop" aria-hidden="true" data-lenis-prevent onClick={closeMenus} />}

      {isSolutionsOpen && (
        <div ref={solutionsPanel} id="solutions-menu" className="site-header__solutions-panel" data-lenis-prevent>
          <div className="site-header__panel-heading">
            <div><p className="site-header__eyebrow">{t('header.forYourHome')}</p><h2>{t('header.solutionsTitle')}</h2></div>
            <span className="site-header__expertise">{t('header.expertise')}</span>
          </div>
          <nav aria-label={t('header.ourSolutions')}><SolutionLinks onNavigate={closeMenus} /></nav>
          <div className="site-header__panel-footer">
            <span>{t('header.needAdvice')}</span>
            <a href={config.salesPhoneHref}>{t('header.talkToAdvisor')}<ArrowRightIcon /></a>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div ref={menu} id="mobile-menu" className="site-header__mobile-panel">
          <div className="site-header__mobile-scroll" data-lenis-prevent>
            <nav aria-label={t('nav.label')}>
              <p className="site-header__eyebrow site-header__mobile-heading">{t('header.ourSolutions')}</p>
              <SolutionLinks onNavigate={closeMenus} />
              <div className="site-header__mobile-links">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} data-nav-entry onClick={closeMenus} className={({ isActive }) => cn('site-header__mobile-link', item.to === paths.referral && 'site-header__referral-link', isActive && 'is-active')}>
                    <span className="site-header__referral-label">{item.to === paths.referral && <GiftIcon />}{t(item.labelKey)}</span><ArrowUpRightIcon />
                  </NavLink>
                ))}
              </div>
              <Link to={paths.care} data-nav-entry onClick={closeMenus} className="site-header__mobile-care">
                <span className="site-header__care-icon"><CareIcon /></span>
                <span><span className="site-header__solution-title">{t('nav.care')}</span><span className="site-header__solution-description">{t('header.careDescription')}</span></span>
                <ArrowUpRightIcon />
              </Link>
            </nav>
          </div>
          <div className="site-header__mobile-footer">
            <Link to={paths.simulator} onClick={closeMenus} className="site-header__cta">{t('header.simulate')}<ArrowUpRightIcon /></Link>
            <a href={config.salesPhoneHref} className="site-header__mobile-phone"><PhoneIcon />{t('header.phoneDisplay')}</a>
          </div>
        </div>
      )}
    </header>
  );
};
