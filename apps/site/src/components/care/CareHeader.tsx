import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { CloseIcon, MenuIcon } from '@/components/icons/Icons';
import { careAnchors } from '@/components/care/careAnchors';
import { CareLogo } from '@/components/care/CareLogo';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { buttonVariants } from '@/components/ui/buttonVariants';

const navItems = [
  { anchor: careAnchors.howItWorks, labelKey: 'nav.howItWorks' },
  { anchor: careAnchors.plans, labelKey: 'nav.plans' },
  { anchor: careAnchors.takeover, labelKey: 'nav.takeover' },
  { anchor: careAnchors.business, labelKey: 'nav.business' },
] as const;

const navLinkClassName = 'whitespace-nowrap text-care-pale transition-colors hover:text-white';

export const CareHeader = () => {
  const { t } = useTranslation('care');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-care-forest">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-[84px] lg:px-10 desktop:px-20">
        <a href={`#${careAnchors.top}`} aria-label={t('brand.homeLink')} onClick={closeMenu} className="shrink-0">
          <CareLogo />
        </a>

        <nav aria-label={t('nav.label')} className="hidden items-center gap-9 text-base font-medium xl:flex">
          {navItems.map((item) => (
            <a key={item.anchor} href={`#${item.anchor}`} className={navLinkClassName}>
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CareRequestLink
            requestType={CareRequestType.SUBSCRIBE_CARE}
            onClick={closeMenu}
            className={cn(buttonVariants({ size: 'sm' }), 'hidden px-5 sm:inline-flex')}
          >
            {t('nav.subscribe')}
          </CareRequestLink>
          <button
            type="button"
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="care-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-care-moss text-white xl:hidden"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="care-mobile-menu" hidden={!isMenuOpen} className="border-t border-care-moss bg-care-forest px-5 pb-6 pt-2 lg:px-10 xl:hidden">
        <nav aria-label={t('nav.label')} className="flex flex-col text-lg font-medium">
          {navItems.map((item) => (
            <a key={item.anchor} href={`#${item.anchor}`} onClick={closeMenu} className={cn(navLinkClassName, 'border-b border-care-moss py-3.5')}>
              {t(item.labelKey)}
            </a>
          ))}
          <Link to={paths.home} className="py-3.5 text-care-leaf hover:text-white">
            {t('nav.backToEnr')}
          </Link>
        </nav>
        <CareRequestLink
          requestType={CareRequestType.SUBSCRIBE_CARE}
          onClick={closeMenu}
          className={cn(buttonVariants({ size: 'md' }), 'mt-3 w-full sm:hidden')}
        >
          {t('nav.subscribe')}
        </CareRequestLink>
      </div>
    </header>
  );
};
