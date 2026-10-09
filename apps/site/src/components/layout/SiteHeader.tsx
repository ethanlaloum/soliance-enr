import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { SolianceLogo } from '@/components/brand/SolianceLogo';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { PhoneIcon } from '@/components/icons/Icons';

gsap.registerPlugin(useGSAP);

const navItems = [
  { to: paths.solar, labelKey: 'nav.solar' },
  { to: paths.heatPump, labelKey: 'nav.heatPump' },
  { to: paths.evCharger, labelKey: 'nav.evCharger' },
  { to: paths.professionals, labelKey: 'nav.professionals' },
  { to: paths.projects, labelKey: 'nav.projects' },
  { to: paths.resources, labelKey: 'nav.resources' },
] as const;

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn('whitespace-nowrap transition-colors hover:text-white', isActive ? 'text-white' : 'text-slate-light');

const careLinkClassName = 'whitespace-nowrap rounded-[20px] border border-care px-3 py-1.5 text-[13px] text-care-mint transition-colors hover:bg-care/20 hover:text-care-mint';

export const SiteHeader = () => {
  const { t } = useTranslation('common');
  const { key: locationKey } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const closeMenu = () => setIsMenuOpen(false);

  useGSAP(() => {
    if (!menu.current) return;
    gsap.set(menu.current, { autoAlpha: 0, y: -12, clipPath: 'inset(0% 0% 100% 0%)' });
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    timeline.to(menu.current, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.48 }, 0)
      .fromTo('[data-menu-entry]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.035 }, 0.1)
      .to('[data-menu-bar="top"]', { y: 8, rotation: 45, duration: 0.3, transformOrigin: 'center center' }, 0)
      .to('[data-menu-bar="middle"]', { scaleX: 0.2, autoAlpha: 0, duration: 0.2 }, 0)
      .to('[data-menu-bar="bottom"]', { y: -8, rotation: -45, duration: 0.3, transformOrigin: 'center center' }, 0);
    menuTimeline.current = timeline;
    return () => { menuTimeline.current = null; };
  }, { scope: header });

  useGSAP(() => {
    const timeline = menuTimeline.current;
    if (!timeline) return;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const synchronize = () => {
      if (motionPreference.matches) {
        timeline.progress(isMenuOpen ? 1 : 0).pause();
      } else if (isMenuOpen) {
        timeline.timeScale(1).play();
      } else {
        timeline.timeScale(1.6).reverse();
      }
    };
    synchronize();
    motionPreference.addEventListener('change', synchronize);
    return () => motionPreference.removeEventListener('change', synchronize);
  }, { scope: header, dependencies: [isMenuOpen], revertOnUpdate: true });

  useEffect(() => { setIsMenuOpen(false); }, [locationKey]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const restoreFocus = menu.current?.contains(document.activeElement) || document.activeElement === menuButton.current;
      setIsMenuOpen(false);
      if (restoreFocus) menuButton.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      ref={header}
      className="relative z-50 bg-night"
      onBlur={(event) => {
        if (isMenuOpen && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-[84px] lg:px-10">
        <Link to={paths.home} aria-label={t('brand.homeLink')} onClick={closeMenu} className="shrink-0">
          <SolianceLogo name={t('brand.name')} />
        </Link>

        <nav aria-label={t('nav.label')} className="hidden items-center gap-4 text-[15px] font-medium desktop:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName}>
              {t(item.labelKey)}
            </NavLink>
          ))}
          <NavLink to={paths.care} className={careLinkClassName}>
            {t('nav.care')}
          </NavLink>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 desktop:flex">
          <a
            href={config.salesPhoneHref}
            aria-label={t('header.callLabel')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-night-line text-white hover:text-solar"
          >
            <PhoneIcon />
          </a>
          <Link to={paths.simulator} className={cn(buttonVariants({ size: 'sm' }), 'whitespace-nowrap px-4 text-sm')}>
            {t('header.simulate')}
          </Link>
        </div>

        <div className="flex gap-2 desktop:hidden">
          <a
            href={config.salesPhoneHref}
            aria-label={t('header.callLabel')}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-night-line text-white"
          >
            <PhoneIcon />
          </a>
          <button
            ref={menuButton}
            type="button"
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-night-line text-white transition-colors hover:border-solar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-night"
          >
            <span aria-hidden="true" className="relative block h-[18px] w-5">
              <span data-menu-bar="top" className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current" />
              <span data-menu-bar="middle" className="absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current" />
              <span data-menu-bar="bottom" className="absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={menu}
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        data-lenis-prevent
        style={{ opacity: 0, visibility: 'hidden' }}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain border-t border-night-line bg-night px-5 pb-6 pt-2 shadow-float lg:max-h-[calc(100dvh-84px)] desktop:hidden"
      >
        <nav aria-label={t('nav.label')} className="flex flex-col text-lg font-medium">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} data-menu-entry onClick={closeMenu} className={({ isActive }) => cn(navLinkClassName({ isActive }), 'border-b border-night-line py-3.5')}>
              {t(item.labelKey)}
            </NavLink>
          ))}
          <Link to={paths.care} data-menu-entry onClick={closeMenu} className="py-3.5 text-care-mint hover:text-care-mint">
            {t('nav.care')}
          </Link>
        </nav>
        <Link to={paths.simulator} data-menu-entry onClick={closeMenu} className={cn(buttonVariants({ size: 'md' }), 'mt-3 w-full')}>
          {t('header.simulate')}
        </Link>
      </div>
    </header>
  );
};
