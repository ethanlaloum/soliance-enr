import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { SolianceLogo } from '@/components/brand/SolianceLogo';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/icons/Icons';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-20 bg-night">
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
            type="button"
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-night-line text-white"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!isMenuOpen} className="border-t border-night-line bg-night px-5 pb-6 pt-2 desktop:hidden">
        <nav aria-label={t('nav.label')} className="flex flex-col text-lg font-medium">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenu} className={({ isActive }) => cn(navLinkClassName({ isActive }), 'border-b border-night-line py-3.5')}>
              {t(item.labelKey)}
            </NavLink>
          ))}
          <Link to={paths.care} onClick={closeMenu} className="py-3.5 text-care-mint hover:text-care-mint">
            {t('nav.care')}
          </Link>
        </nav>
        <Link to={paths.simulator} onClick={closeMenu} className={cn(buttonVariants({ size: 'md' }), 'mt-3 w-full')}>
          {t('header.simulate')}
        </Link>
      </div>
    </header>
  );
};
