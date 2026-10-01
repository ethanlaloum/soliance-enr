import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';

type CaseStudyKey = 'solisInvest' | 'seranonSpar';

const statKeysByCaseStudy: Record<CaseStudyKey, readonly string[]> = {
  solisInvest: ['power', 'inverter', 'production'],
  seranonSpar: ['power', 'selfConsumption', 'payback'],
};

const readMoreClassName =
  'inline-flex items-center gap-1.5 self-start rounded-[10px] border-[1.5px] border-solar px-[18px] py-2.5 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none';

const CaseStudyStats = ({ caseStudy, tone }: { caseStudy: CaseStudyKey; tone: 'dark' | 'light' }) => {
  const { t } = useTranslation('professionals');

  return (
    <dl aria-label={t(`caseStudies.${caseStudy}.statsLabel`)} className="mt-1 grid grid-cols-3 gap-2 lg:gap-3">
      {statKeysByCaseStudy[caseStudy].map((key) => (
        <div key={key} className={cn('flex flex-col-reverse justify-end rounded-[10px] p-2.5 sm:p-3 lg:p-3.5', tone === 'dark' ? 'bg-night-soft' : 'bg-ivory')}>
          <dt className={cn('text-[11px] leading-snug lg:text-xs', tone === 'dark' ? 'text-slate-light' : 'text-slate-ink')}>
            {t(`caseStudies.${caseStudy}.stats.${key}.label`)}
          </dt>
          <dd className="text-[19px] font-bold leading-tight text-solar sm:text-xl lg:text-2xl">{t(`caseStudies.${caseStudy}.stats.${key}.value`)}</dd>
        </div>
      ))}
    </dl>
  );
};

const ReadMoreLink = ({ caseStudy, slug, tone }: { caseStudy: CaseStudyKey; slug: string; tone: 'dark' | 'light' }) => {
  const { t } = useTranslation('professionals');

  return (
    <Link
      to={projectPath(slug)}
      className={cn(readMoreClassName, tone === 'dark' ? 'text-white hover:bg-white/5 hover:text-white' : 'text-night hover:bg-solar/5 hover:text-night')}
    >
      {t('caseStudies.readMore')}{' '}
      <span className="sr-only">{t('caseStudies.readMoreContext', { name: t(`caseStudies.${caseStudy}.name`) })}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
};

const SolisInvestCaseStudy = () => {
  const { t } = useTranslation('professionals');

  return (
    <section
      data-reveal
      aria-labelledby="solis-invest-title"
      className="grid overflow-hidden rounded-2xl bg-night text-white lg:grid-cols-[1.15fr_1fr] lg:rounded-3xl"
    >
      <div className="relative h-[240px] sm:h-[320px] lg:h-auto lg:min-h-[520px]">
        <img
          src="/images/professionals/solis-invest-office-roof.webp"
          alt={t('caseStudies.solisInvest.imageAlt')}
          width={1280}
          height={720}
          loading="lazy"
          className="absolute inset-0 block h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 lg:p-12">
        <p className={eyebrowClassName}>{t('caseStudies.solisInvest.eyebrow')}</p>
        <h2 id="solis-invest-title" className="text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-[32px]">
          {t('caseStudies.solisInvest.title')}
        </h2>
        <p className="text-[15px] leading-[1.55] text-slate-light">{t('caseStudies.solisInvest.description')}</p>
        <CaseStudyStats caseStudy="solisInvest" tone="dark" />
        <p className="text-[13px] leading-relaxed text-slate-mist">{t('caseStudies.solisInvest.equipment')}</p>
        <ReadMoreLink caseStudy="solisInvest" slug="immeuble-bureaux-148-kwc" tone="dark" />
      </div>
    </section>
  );
};

const SeranonSparCaseStudy = () => {
  const { t } = useTranslation('professionals');

  return (
    <section
      data-reveal
      aria-labelledby="seranon-spar-title"
      className="grid overflow-hidden rounded-2xl border border-sand-line bg-white lg:grid-cols-[1fr_1.15fr] lg:rounded-3xl"
    >
      <div className="relative h-[260px] sm:h-[320px] lg:order-last lg:h-auto lg:min-h-[520px]">
        <img
          src="/images/professionals/seranon-spar-drone.webp"
          alt={t('caseStudies.seranonSpar.imageAlt')}
          width={900}
          height={1600}
          loading="lazy"
          className="absolute inset-0 block h-full w-full object-cover [object-position:50%_62%] lg:[object-position:50%_60%]"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 lg:p-12">
        <p className={eyebrowClassName}>{t('caseStudies.seranonSpar.eyebrow')}</p>
        <h2 id="seranon-spar-title" className="text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-[32px]">
          {t('caseStudies.seranonSpar.title')}
        </h2>
        <p className="text-[15px] leading-[1.55] text-slate-ink">{t('caseStudies.seranonSpar.description')}</p>
        <CaseStudyStats caseStudy="seranonSpar" tone="light" />
        <figure className="mt-1.5 flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-night text-lg font-bold text-solar"
          >
            {t('caseStudies.seranonSpar.testimonial.initial')}
          </span>
          <div className="flex flex-col gap-0.5">
            <blockquote className="text-sm leading-[1.45] text-slate-text">
              <p>{t('caseStudies.seranonSpar.testimonial.quote')}</p>
            </blockquote>
            <figcaption className="text-xs text-slate">{t('caseStudies.seranonSpar.testimonial.author')}</figcaption>
          </div>
        </figure>
        <ReadMoreLink caseStudy="seranonSpar" slug="seranon-spar-36-kwc" tone="light" />
      </div>
    </section>
  );
};

export const CaseStudiesSection = () => (
  <div className={cn(containerClassName, 'flex flex-col gap-4 pt-8 lg:gap-6 lg:pt-0')}>
    <SolisInvestCaseStudy />
    <SeranonSparCaseStudy />
  </div>
);
