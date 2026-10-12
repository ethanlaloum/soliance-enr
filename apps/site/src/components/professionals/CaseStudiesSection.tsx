import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { ArrowUpRightIcon } from '@/components/icons/Icons';
import { containerClassName } from '@/components/home/containerClassName';

type CaseStudyKey = 'solisInvest' | 'seranonSpar';

type Tone = 'dark' | 'light';

const statKeysByCaseStudy: Record<CaseStudyKey, readonly string[]> = {
  solisInvest: ['power', 'inverter', 'production'],
  seranonSpar: ['power', 'selfConsumption', 'payback'],
};

const CaseStudyStats = ({ caseStudy, tone }: { caseStudy: CaseStudyKey; tone: Tone }) => {
  const { t } = useTranslation('professionals');

  return (
    <dl
      aria-label={t(`caseStudies.${caseStudy}.statsLabel`)}
      className={cn('energy-figures mt-2 grid grid-cols-3 gap-3 lg:gap-5', tone === 'dark' && 'energy-figures--dark')}
    >
      {statKeysByCaseStudy[caseStudy].map((key) => (
        <div key={key}>
          <dt>{t(`caseStudies.${caseStudy}.stats.${key}.label`)}</dt>
          <dd>{t(`caseStudies.${caseStudy}.stats.${key}.value`)}</dd>
        </div>
      ))}
    </dl>
  );
};

const ReadMoreLink = ({ caseStudy, slug, tone }: { caseStudy: CaseStudyKey; slug: string; tone: Tone }) => {
  const { t } = useTranslation('professionals');

  return (
    <Link to={projectPath(slug)} className={cn('energy-link mt-2 self-start', tone === 'dark' && 'energy-link--on-dark')}>
      {t('caseStudies.readMore')}{' '}
      <span className="sr-only">{t('caseStudies.readMoreContext', { name: t(`caseStudies.${caseStudy}.name`) })}</span>
      <ArrowUpRightIcon className="h-3 w-3" />
    </Link>
  );
};

const SolisInvestCaseStudy = () => {
  const { t } = useTranslation('professionals');

  return (
    <section
      data-reveal
      aria-labelledby="solis-invest-title"
      className="grid overflow-hidden rounded-lg bg-night text-ivory lg:grid-cols-[1.15fr_1fr]"
    >
      <div className="relative h-[240px] sm:h-[320px] lg:h-auto lg:min-h-[540px]">
        <img
          src="/images/professionals/solis-invest-office-roof.webp"
          alt={t('caseStudies.solisInvest.imageAlt')}
          width={1280}
          height={720}
          loading="lazy"
          className="absolute inset-0 block h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 lg:gap-5 lg:p-12">
        <p className="energy-kicker energy-kicker--dark">{t('caseStudies.solisInvest.eyebrow')}</p>
        <h2 id="solis-invest-title" className="text-2xl font-medium leading-[1.15] tracking-[-0.035em] lg:text-[34px]">
          {t('caseStudies.solisInvest.title')}
        </h2>
        <p className="text-[15px] leading-[1.65] text-slate-light">{t('caseStudies.solisInvest.description')}</p>
        <CaseStudyStats caseStudy="solisInvest" tone="dark" />
        <p className="border-t border-night-line pt-4 text-[13px] leading-relaxed text-slate-mist">{t('caseStudies.solisInvest.equipment')}</p>
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
      className="grid overflow-hidden rounded-lg border border-sand-line bg-white lg:grid-cols-[1fr_1.15fr]"
    >
      <div className="relative h-[260px] sm:h-[320px] lg:order-last lg:h-auto lg:min-h-[540px]">
        <img
          src="/images/professionals/seranon-spar-drone.webp"
          alt={t('caseStudies.seranonSpar.imageAlt')}
          width={900}
          height={1600}
          loading="lazy"
          className="absolute inset-0 block h-full w-full object-cover [object-position:50%_62%] lg:[object-position:50%_60%]"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 lg:gap-5 lg:p-12">
        <p className="energy-kicker">{t('caseStudies.seranonSpar.eyebrow')}</p>
        <h2 id="seranon-spar-title" className="text-2xl font-medium leading-[1.15] tracking-[-0.035em] lg:text-[34px]">
          {t('caseStudies.seranonSpar.title')}
        </h2>
        <p className="text-[15px] leading-[1.65] text-slate-ink">{t('caseStudies.seranonSpar.description')}</p>
        <CaseStudyStats caseStudy="seranonSpar" tone="light" />
        <figure className="mt-1 flex items-center gap-3.5 border-t border-sand-line pt-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-night text-base font-medium text-solar"
          >
            {t('caseStudies.seranonSpar.testimonial.initial')}
          </span>
          <div className="flex flex-col gap-0.5">
            <blockquote className="text-sm leading-[1.5] text-slate-text">
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
  <div className={cn(containerClassName, 'flex flex-col gap-4 pt-8 lg:gap-6 lg:pt-4')}>
    <SolisInvestCaseStudy />
    <SeranonSparCaseStudy />
  </div>
);
