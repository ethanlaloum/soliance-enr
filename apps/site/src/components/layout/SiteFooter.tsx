import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { config } from '@/config';
import { contactAnchor, paths } from '@/routes/paths';
import { SolianceLogo } from '@/components/brand/SolianceLogo';

type FooterLink = { labelKey: string; to?: string; href?: string };

const columns: { titleKey: string; links: FooterLink[] }[] = [
  {
    titleKey: 'footer.solutionsTitle',
    links: [
      { labelKey: 'nav.solar', to: paths.solar },
      { labelKey: 'nav.heatPump', to: paths.heatPump },
      { labelKey: 'nav.evCharger', to: paths.evCharger },
      { labelKey: 'nav.professionals', to: paths.professionals },
      { labelKey: 'footer.renovation', to: paths.renovation },
    ],
  },
  {
    titleKey: 'footer.solianceTitle',
    links: [
      { labelKey: 'footer.about', to: paths.about },
      { labelKey: 'footer.referral', to: paths.referral },
      { labelKey: 'nav.care', href: config.careUrl },
      { labelKey: 'footer.blog', to: paths.resources },
      { labelKey: 'footer.contact', to: `${paths.home}#${contactAnchor}` },
    ],
  },
  {
    titleKey: 'footer.legalTitle',
    links: [
      { labelKey: 'footer.legalNotice', to: paths.legalNotice },
      { labelKey: 'footer.termsIndividuals', to: paths.termsIndividuals },
      { labelKey: 'footer.termsProfessionals', to: paths.termsProfessionals },
      { labelKey: 'footer.privacy', to: paths.privacy },
      { labelKey: 'footer.cookies', to: paths.cookies },
    ],
  },
];

const linkClassName = 'text-slate-light transition-colors hover:text-white';

export const SiteFooter = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="mt-auto bg-night text-[13px] text-slate-light lg:text-sm">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-7 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-10 lg:py-12">
        <div className="flex flex-col gap-2.5">
          <SolianceLogo name={t('brand.name')} size="footer" />
          <p>{t('brand.slogan')}</p>
          <p>{t('footer.company')}</p>
          <p>{t('footer.registration')}</p>
        </div>
        {columns.map((column) => (
          <div key={column.titleKey} className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-white">{t(column.titleKey)}</h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.labelKey}>
                  {link.href ? (
                    <a href={link.href} className={linkClassName}>
                      {t(link.labelKey)}
                    </a>
                  ) : (
                    <Link to={link.to ?? paths.home} className={linkClassName}>
                      {t(link.labelKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};
