import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { eyebrowClassName } from '@/components/home/containerClassName';

const valueKeys = ['trust', 'transparency', 'expertise', 'proximity'] as const;
const assuranceKeys = ['insurance', 'financing'] as const;

export const WhySolianceSection = () => {
  const { t } = useTranslation('home');

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pt-9 lg:px-10 lg:pt-0">
      <section
        data-team-section
        aria-labelledby="why-title"
        className="grid items-center gap-10 rounded-2xl border border-sand-line bg-white p-6 lg:grid-cols-2 lg:gap-14 lg:rounded-3xl lg:px-16 lg:py-14"
      >
        <div data-reveal className="flex flex-col gap-4">
          <p className={eyebrowClassName}>{t('why.eyebrow')}</p>
          <h2 id="why-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[38px]">
            {t('why.title')}
          </h2>
          <p className="text-base leading-[1.55] text-slate-ink lg:text-[17px]">{t('why.body')}</p>
          <ul className="mt-2 grid gap-3.5 sm:grid-cols-2">
            {valueKeys.map((key, index) => (
              <li key={key} data-reveal style={revealDelay(index + 2)} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[7px] h-2.5 w-2.5 shrink-0 rotate-45 bg-solar" />
                <span>
                  <span className="block font-bold">{t(`why.values.${key}.title`)}</span>
                  <span className="block text-sm text-slate-ink">{t(`why.values.${key}.description`)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="home-team__frame"><img
            data-team-image
            src="/images/team-showroom.webp"
            alt={t('why.imageAlt')}
            width={1200}
            height={260}
            loading="lazy"
            className="block h-[220px] w-full rounded-2xl object-cover lg:h-[260px]"
          /></div>
          <dl className="grid grid-cols-2 gap-3.5">
            {assuranceKeys.map((key) => (
              <div key={key} className="flex flex-col rounded-xl bg-night p-[18px] text-white">
                <dt className="text-[13px] text-slate-mist">{t(`why.${key}.label`)}</dt>
                <dd className="text-base font-bold">{t(`why.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};
