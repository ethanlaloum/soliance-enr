import { Trans, useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { CheckIcon } from '@/components/icons/Icons';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careGreenButtonClassName, careOutlineButtonClassName, careTitleClassName } from '@/components/care/careStyles';

type CompareRow = { service: string; without: string; with: string };

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-2.5 text-[15px] leading-snug lg:text-[17px]">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5">
        <CheckIcon className="mt-0.5 shrink-0 text-care" />
        {item}
      </li>
    ))}
  </ul>
);

export const CarePlansSection = () => {
  const { t } = useTranslation('care');
  const careFeatures = t('plans.care.features', { returnObjects: true }) as string[];
  const connectFeatures = t('plans.connect.features', { returnObjects: true }) as string[];
  const compareRows = t('plans.compare.rows', { returnObjects: true }) as CompareRow[];

  return (
    <section id={careAnchors.plans} aria-labelledby="care-plans-title" className={careSectionScrollClassName}>
      <div className={cn(containerClassName, 'flex flex-col gap-7 py-14 lg:gap-9 lg:py-[88px] desktop:px-20')}>
        <h2 id="care-plans-title" data-reveal className={careTitleClassName}>
          {t('plans.title')}
        </h2>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          <article
            data-reveal
            aria-labelledby="care-plan-care"
            className="flex flex-col gap-4 rounded-[20px] border-2 border-care bg-white p-6 shadow-[0_16px_40px_rgba(26,122,82,0.18)] lg:p-10"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id="care-plan-care" className="text-[22px] font-bold lg:text-[26px]">
                {t('plans.care.name')}
              </h3>
              <span className="whitespace-nowrap rounded-full bg-solar px-3 py-1.5 text-xs font-bold text-white lg:text-[13px]">{t('plans.care.badge')}</span>
            </div>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[44px] font-bold leading-none text-care-forest lg:text-[56px]">{t('plans.care.price')}</span>
              <span className="text-base text-care-muted lg:text-lg">{t('plans.care.unit')}</span>
              <s aria-hidden="true" className="text-base text-[#8a9a92] lg:text-lg">
                {t('plans.care.publicPrice')}
              </s>
              <span className="sr-only">{t('plans.care.publicPriceLabel')}</span>
            </p>
            <p className="text-sm text-care-muted lg:text-[15px]">{t('plans.care.note')}</p>
            <div className="mt-1 lg:mt-2">
              <FeatureList items={careFeatures} />
            </div>
            <CareRequestLink requestType={CareRequestType.SUBSCRIBE_CARE} className={cn(careGreenButtonClassName, 'mt-3 w-full')}>
              {t('plans.care.cta')}
            </CareRequestLink>
          </article>

          <article data-reveal style={revealDelay(1)} aria-labelledby="care-plan-connect" className="flex flex-col gap-4 rounded-[20px] border border-care-line bg-white p-6 lg:p-10">
            <h3 id="care-plan-connect" className="text-[22px] font-bold lg:text-[26px]">
              {t('plans.connect.name')}
            </h3>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-[44px] font-bold leading-none text-care-forest lg:text-[56px]">{t('plans.connect.price')}</span>
              <span className="text-base text-care-muted lg:text-lg">{t('plans.connect.unit')}</span>
            </p>
            <p className="text-sm text-care-muted lg:text-[15px]">{t('plans.connect.note')}</p>
            <div className="mt-1 lg:mt-2">
              <FeatureList items={connectFeatures} />
            </div>
            <CareRequestLink requestType={CareRequestType.SUBSCRIBE_CONNECT} className={cn(careOutlineButtonClassName, 'mt-3 w-full lg:mt-auto')}>
              {t('plans.connect.cta')}
            </CareRequestLink>
          </article>
        </div>

        <div
          data-reveal
          className="flex flex-col gap-2 rounded-2xl bg-care-forest px-6 py-5 text-base text-white lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-[34px] lg:py-[26px] lg:text-lg"
        >
          <p>
            <Trans t={t} i18nKey="plans.savings.without" components={{ strong: <strong className="font-bold" /> }} />
          </p>
          <p className="text-care-leaf">
            <Trans t={t} i18nKey="plans.savings.with" components={{ strong: <strong className="font-bold" /> }} />
          </p>
        </div>

        <div data-reveal className="overflow-hidden rounded-2xl border border-care-line bg-white">
          <table className="w-full border-collapse text-left text-[13px] leading-snug sm:text-[15px] lg:text-base">
            <caption className="px-4 pb-2 pt-5 text-left text-base font-bold sm:px-6 lg:px-8 lg:pt-7 lg:text-xl">{t('plans.compare.title')}</caption>
            <thead>
              <tr className="border-b border-care-line text-xs uppercase tracking-[0.8px] text-care-muted sm:text-[13px]">
                <th scope="col" className="w-[42%] px-4 py-3 font-semibold sm:px-6 lg:px-8">
                  {t('plans.compare.service')}
                </th>
                <th scope="col" className="px-2 py-3 font-semibold sm:px-4">
                  {t('plans.compare.without')}
                </th>
                <th scope="col" className="bg-care-surface/60 px-3 py-3 font-semibold text-care sm:px-4 lg:px-6">
                  {t('plans.compare.with')}
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.service} className="border-b border-care-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 font-semibold sm:px-6 lg:px-8 lg:py-4">
                    {row.service}
                  </th>
                  <td className="px-2 py-3 text-care-muted sm:px-4 lg:py-4">{row.without}</td>
                  <td className="bg-care-surface/60 px-3 py-3 font-semibold text-care-deep sm:px-4 lg:px-6 lg:py-4">{row.with}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs leading-normal text-care-muted lg:text-sm">{t('plans.terms')}</p>
      </div>
    </section>
  );
};
