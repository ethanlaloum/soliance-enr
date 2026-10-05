import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { SolianceLogo } from '@/components/brand/SolianceLogo';
import { PhoneIcon } from '@/components/icons/Icons';

const navItems = [
  { to: paths.solar, labelKey: 'nav.solar' },
  { to: paths.heatPump, labelKey: 'nav.heatPump' },
  { to: paths.evCharger, labelKey: 'nav.evCharger' },
  { to: paths.professionals, labelKey: 'nav.professionals' },
  { to: paths.projects, labelKey: 'nav.projects' },
  { to: paths.resources, labelKey: 'nav.resources' },
] as const;

const focusRingClassName = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar';

const desktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn('site-nav-link group relative whitespace-nowrap py-2 transition-colors duration-300 hover:text-white', focusRingClassName, isActive ? 'text-white' : 'text-slate-light');

const LinkUnderline = ({ isActive }: { isActive: boolean }) => (
  <span
    aria-hidden="true"
    className={cn(
      'absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-solar transition-transform duration-300 ease-out-expo motion-reduce:transition-none',
      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
    )}
  />
);

const careLinkClassName = cn(
  'site-care-link whitespace-nowrap rounded-full border border-care px-3.5 py-1.5 text-[13px] font-medium text-care-mint transition-colors duration-300 hover:border-care-mint hover:bg-care/25 hover:text-care-mint',
  focusRingClassName,
);

const iconButtonClassName = cn(
  'flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/15 text-white transition-colors duration-300 hover:border-solar hover:text-solar',
  focusRingClassName,
);

const simulateClassName = cn(
  'site-simulate-link inline-flex h-11 items-center whitespace-nowrap rounded-[10px] bg-solar px-5 text-[15px] font-semibold text-night transition-colors duration-300 hover:bg-ivory hover:text-night',
  focusRingClassName,
);

const menuEntryStyle = (index: number, isOpen: boolean) => ({ transitionDelay: isOpen ? `${90 + index * 45}ms` : '0ms' }) as CSSProperties;

const NavigationArrow = () => (
  <svg className="site-nav-arrow hidden" aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19 19 5M5 5h14v14" />
  </svg>
);

export const SiteHeader = () => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasFocusInside, setHasFocusInside] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { isScrolled, isHidden } = useHeaderVisibility(isMenuOpen || hasFocusInside);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (menuButtonRef.current?.offsetParent === null) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [isMenuOpen]);

  const menuEntryClassName = cn(
    'transition-[opacity,transform] duration-500 ease-out-expo motion-reduce:transition-none',
    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
  );

  return (
    <>
      <header
        data-scrolled={isScrolled}
        data-menu-open={isMenuOpen}
        onFocusCapture={() => setHasFocusInside(true)}
        onBlurCapture={() => setHasFocusInside(false)}
        className={cn(
          'site-header sticky top-0 z-40 transition-[transform,background-color,box-shadow] duration-500 ease-out-expo motion-reduce:transition-none',
          isHidden && '-translate-y-full',
          isScrolled || isMenuOpen ? 'bg-night/90 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md' : 'bg-night',
        )}
      >
        <div className="site-header-inner mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-[84px] lg:px-10">
          <Link to={paths.home} aria-label={t('brand.homeLink')} onClick={closeMenu} className={cn('shrink-0 rounded-sm', focusRingClassName)}>
            <SolianceLogo name={t('brand.name')} />
          </Link>

          <nav aria-label={t('nav.label')} className="hidden items-center gap-6 text-[15px] font-medium desktop:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLinkClassName}>
                {({ isActive }) => (
                  <>
                    {t(item.labelKey)}
                    <LinkUnderline isActive={isActive} />
                  </>
                )}
              </NavLink>
            ))}
            <a href={config.careUrl} className={careLinkClassName}>
              {t('nav.care')}
            </a>
          </nav>

          <div className="site-header-actions hidden shrink-0 items-center gap-3 desktop:flex">
            <a href={config.salesPhoneHref} aria-label={t('header.callLabel')} className={iconButtonClassName}>
              <PhoneIcon />
            </a>
            <Link to={paths.simulator} className={simulateClassName}>
              {t('header.simulate')}
              <NavigationArrow />
            </Link>
          </div>

          <div className="site-header-mobile flex gap-2 desktop:hidden">
            <a href={config.salesPhoneHref} aria-label={t('header.callLabel')} className={iconButtonClassName}>
              <PhoneIcon />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={cn(iconButtonClassName, 'relative', isMenuOpen && 'border-solar')}
            >
              <span aria-hidden="true" className="relative block h-3.5 w-5">
                <span
                  className={cn(
                    'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out-expo motion-reduce:transition-none',
                    isMenuOpen ? 'top-1.5 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn('absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200', isMenuOpen ? 'opacity-0' : 'opacity-100')}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out-expo motion-reduce:transition-none',
                    isMenuOpen ? 'top-1.5 -rotate-45' : 'top-3',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        data-menu-open={isMenuOpen}
        inert={!isMenuOpen}
        data-lenis-prevent
        className={cn(
          'fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-night px-5 pb-10 pt-4 transition-[opacity,visibility] duration-300 motion-reduce:transition-none desktop:hidden lg:top-[84px] lg:px-10',
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="mx-auto flex min-h-full max-w-[1440px] flex-col">
          <p className="site-menu-caption hidden">{t('nav.label')}</p>
          <nav aria-label={t('nav.label')} className="flex flex-col">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                style={menuEntryStyle(index, isMenuOpen)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between border-b border-white/10 py-4 text-[26px] font-semibold tracking-[-0.02em] hover:text-white sm:text-[32px]',
                    focusRingClassName,
                    menuEntryClassName,
                    isActive ? 'text-white' : 'text-slate-light',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="site-menu-number hidden" aria-hidden="true">0{index + 1}</span>
                    <span className="site-menu-label">{t(item.labelKey)}</span>
                    <NavigationArrow />
                    <span aria-hidden="true" className={cn('site-menu-active-mark h-2.5 w-2.5 rotate-45 bg-solar transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
                  </>
                )}
              </NavLink>
            ))}
            <a
              href={config.careUrl}
              style={menuEntryStyle(navItems.length, isMenuOpen)}
              className={cn('site-menu-care py-4 text-[26px] font-semibold tracking-[-0.02em] text-care-mint hover:text-care-mint sm:text-[32px]', focusRingClassName, menuEntryClassName)}
            >
              {t('nav.care')}
            </a>
          </nav>
          <Link
            to={paths.simulator}
            onClick={closeMenu}
            style={menuEntryStyle(navItems.length + 1, isMenuOpen)}
            className={cn(simulateClassName, menuEntryClassName, 'mt-auto h-14 w-full justify-center text-[17px]')}
          >
            {t('header.simulate')}
            <NavigationArrow />
          </Link>
        </div>
      </div>
    </>
  );
};
