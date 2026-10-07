import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { paths } from '@/routes/paths';
import { consentButtonClassName } from '@/components/consent/consentButtonClassName';

type CookieBannerProps = {
  isSaving: boolean;
  onAcceptAll: () => void;
  onRefuseAll: () => void;
  onCustomize: () => void;
};

export const CookieBanner = ({ isSaving, onAcceptAll, onRefuseAll, onCustomize }: CookieBannerProps) => {
  const { t } = useTranslation('common');

  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-sand-line bg-white p-5 font-sans text-night shadow-lift motion-safe:animate-fade-up sm:inset-x-auto sm:left-6 sm:max-w-[440px] lg:bottom-6 lg:p-6"
    >
      <h2 id="cookie-banner-title" className="flex items-center gap-2.5 text-lg font-bold">
        <span aria-hidden="true" className="block h-3 w-3 rotate-45 rounded-[2px] bg-solar" />
        {t('consent.banner.title')}
      </h2>
      <p className="mt-2 text-sm leading-[1.55] text-slate-text">
        {t('consent.banner.text')}{' '}
        <Link to={paths.cookies} className="font-semibold text-solar underline underline-offset-4 hover:text-solar-dark">
          {t('consent.banner.learnMore')}
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button type="button" onClick={onRefuseAll} disabled={isSaving} className={consentButtonClassName}>
          {t('consent.banner.refuseAll')}
        </button>
        <button type="button" onClick={onAcceptAll} disabled={isSaving} className={consentButtonClassName}>
          {t('consent.banner.acceptAll')}
        </button>
      </div>
      <button
        type="button"
        onClick={onCustomize}
        className="mt-3 min-h-[44px] w-full text-sm font-semibold text-slate-ink underline underline-offset-4 hover:text-night"
      >
        {t('consent.banner.customize')}
      </button>
    </section>
  );
};
