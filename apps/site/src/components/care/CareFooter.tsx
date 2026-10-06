import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { paths } from '@/routes/paths';
import { CareDiamondPattern } from '@/components/care/CareIcons';
import { CareLogo } from '@/components/care/CareLogo';

const footerLinks = [
  { labelKey: 'footer.enr', to: paths.home },
  { labelKey: 'footer.legalNotice', to: paths.legalNotice },
  { labelKey: 'footer.privacy', to: paths.privacy },
  { labelKey: 'footer.cookies', to: paths.cookies },
] as const;

export const CareFooter = () => {
  const { t } = useTranslation('care');

  return (
    <footer className="relative mt-auto overflow-hidden bg-care-forest text-sm text-care-pale lg:text-[15px]">
      <CareDiamondPattern id="care-footer-diamonds" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 lg:flex-row lg:justify-between lg:px-10 lg:py-12 desktop:px-20">
        <div className="flex flex-col gap-2">
          <CareLogo size="footer" />
          <p className="text-care-leaf">{t('footer.tagline')}</p>
          <p>{t('footer.address')}</p>
          <p>
            <a href={config.carePhoneHref} className="text-care-pale hover:text-white">
              {t('footer.phone')}
            </a>
          </p>
          <p className="text-care-fog">{t('footer.company')}</p>
        </div>
        <nav aria-label={t('footer.linksLabel')}>
          <ul className="flex flex-col gap-2 lg:items-end">
            {footerLinks.map((link) => (
              <li key={link.labelKey}>
                <Link to={link.to} className="text-care-pale hover:text-white">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
