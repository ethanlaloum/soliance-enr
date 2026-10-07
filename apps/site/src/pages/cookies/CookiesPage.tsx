import '@/lib/i18n/namespaces/cookies';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';

const textSections = ['what', 'necessary', 'analytics'] as const;
const closingSections = ['duration', 'withdraw', 'contact'] as const;
const cookieRows = ['consent', 'ga', 'gaSession'] as const;
const cookieColumns = ['name', 'purpose', 'duration', 'provider', 'consent'] as const;

const sectionTitleClassName = 'text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]';
const paragraphClassName = 'text-base leading-[1.6] text-slate-text';

export const CookiesPage = () => {
  const { t } = useTranslation('cookies');
  const { status, openEdition } = useCookieConsent();

  return (
    <div className={cn(containerClassName, 'flex max-w-[960px] flex-col gap-10 pb-16 pt-8 lg:gap-14 lg:pb-[100px] lg:pt-16')}>
      <section aria-labelledby="cookies-title" className="flex flex-col gap-3 lg:gap-4">
        <Breadcrumb items={[{ label: t('breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
        <h1
          id="cookies-title"
          className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[52px]"
        >
          {t('title')}
        </h1>
        <p className="text-sm text-slate">{t('updatedAt')}</p>
        <p className="text-base leading-normal text-slate-ink lg:text-lg lg:leading-[1.55]">{t('intro')}</p>
        <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-sand-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
          <p aria-live="polite" className="min-h-[24px] text-[15px] text-slate-text">
            {status && (
              <>
                <span className="font-semibold text-night">{t('status.label')}</span> {t(`status.${status}`)}
              </>
            )}
          </p>
          <button type="button" onClick={openEdition} className={cn(buttonVariants({ size: 'sm' }), 'shrink-0')}>
            {t('manage')}
          </button>
        </div>
      </section>

      {textSections.map((key) => (
        <section key={key} aria-labelledby={`cookies-${key}`} className="flex flex-col gap-3">
          <h2 id={`cookies-${key}`} className={sectionTitleClassName}>
            {t(`${key}.title`)}
          </h2>
          <p className={paragraphClassName}>{t(`${key}.body`)}</p>
          {key === 'analytics' && <p className={paragraphClassName}>{t('analytics.provider')}</p>}
        </section>
      ))}

      <section aria-labelledby="cookies-list" className="flex flex-col gap-4">
        <h2 id="cookies-list" className={sectionTitleClassName}>
          {t('list.title')}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-sand-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">{t('list.caption')}</caption>
            <thead className="bg-ivory text-night">
              <tr>
                {cookieColumns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-semibold">
                    {t(`list.headers.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cookieRows.map((row) => (
                <tr key={row} className="border-t border-sand-line align-top">
                  {cookieColumns.map((column) =>
                    column === 'name' ? (
                      <th key={column} scope="row" className="px-4 py-3 font-mono text-[13px] font-medium text-night">
                        {t(`list.rows.${row}.${column}`)}
                      </th>
                    ) : (
                      <td key={column} className="px-4 py-3 text-slate-text">
                        {t(`list.rows.${row}.${column}`)}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {closingSections.map((key) => (
        <section key={key} aria-labelledby={`cookies-${key}`} className="flex flex-col gap-3">
          <h2 id={`cookies-${key}`} className={sectionTitleClassName}>
            {t(`${key}.title`)}
          </h2>
          <p className={paragraphClassName}>{t(`${key}.body`)}</p>
        </section>
      ))}
    </div>
  );
};
