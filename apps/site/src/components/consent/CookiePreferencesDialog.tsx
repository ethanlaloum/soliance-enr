import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons/Icons';
import { consentButtonClassName } from '@/components/consent/consentButtonClassName';

type CookiePreferencesDialogProps = {
  isAnalyticsGranted: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (analytics: boolean) => void;
};

export const CookiePreferencesDialog = ({ isAnalyticsGranted, isSaving, onClose, onSave }: CookiePreferencesDialogProps) => {
  const { t } = useTranslation('common');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(isAnalyticsGranted);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cookie-preferences-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="w-[calc(100%-32px)] max-w-[560px] rounded-2xl bg-white p-0 font-sans text-night shadow-lift backdrop:bg-night/60"
    >
      <div className="flex flex-col gap-5 p-5 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="cookie-preferences-title" className="text-xl font-bold lg:text-2xl">
            {t('consent.dialog.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('consent.dialog.close')}
            className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-slate-ink hover:bg-ivory hover:text-night"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="text-[15px] leading-[1.55] text-slate-text">{t('consent.dialog.intro')}</p>
        <ul className="flex flex-col gap-3">
          <li className="flex items-start justify-between gap-4 rounded-xl border border-sand-line p-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold">{t('consent.dialog.necessaryTitle')}</h3>
              <p className="text-sm leading-[1.5] text-slate-ink">{t('consent.dialog.necessaryDescription')}</p>
            </div>
            <span className="shrink-0 rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-slate-ink">{t('consent.dialog.alwaysOn')}</span>
          </li>
          <li className="rounded-xl border border-sand-line p-4">
            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span className="flex flex-col gap-1">
                <span id="cookie-analytics-title" className="font-bold">
                  {t('consent.dialog.analyticsTitle')}
                </span>
                <span id="cookie-analytics-description" className="text-sm leading-[1.5] text-slate-ink">
                  {t('consent.dialog.analyticsDescription')}
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                aria-labelledby="cookie-analytics-title"
                aria-describedby="cookie-analytics-description"
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-slate-light transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-solar peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solar motion-reduce:transition-none motion-reduce:after:transition-none"
              />
            </label>
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => onSave(false)} disabled={isSaving} className={consentButtonClassName}>
            {t('consent.dialog.refuseAll')}
          </button>
          <button type="button" onClick={() => onSave(true)} disabled={isSaving} className={consentButtonClassName}>
            {t('consent.dialog.acceptAll')}
          </button>
          <button
            type="button"
            onClick={() => onSave(analytics)}
            disabled={isSaving}
            className={cn(consentButtonClassName, 'col-span-2 bg-solar hover:bg-solar-dark')}
          >
            {t('consent.dialog.save')}
          </button>
        </div>
      </div>
    </dialog>
  );
};
