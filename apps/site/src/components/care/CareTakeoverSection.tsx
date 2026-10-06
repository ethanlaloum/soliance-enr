import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { ShieldIcon, ToolsIcon } from '@/components/care/CareIcons';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careBodyClassName, careEyebrowClassName, careOrangeButtonClassName, careTitleClassName } from '@/components/care/careStyles';

type Step = { title: string; body: string };

export const CareTakeoverSection = () => {
  const { t } = useTranslation('care');
  const steps = t('takeover.steps', { returnObjects: true }) as Step[];

  return (
    <section id={careAnchors.takeover} aria-labelledby="care-takeover-title" className={cn('border-t border-care-line bg-white', careSectionScrollClassName)}>
      <div className={cn(containerClassName, 'flex flex-col gap-8 py-14 lg:gap-10 lg:py-[88px] desktop:px-20')}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-4 lg:gap-5">
            <p className={careEyebrowClassName}>{t('takeover.eyebrow')}</p>
            <h2 id="care-takeover-title" className={cn(careTitleClassName, 'lg:text-[48px] lg:leading-[1.08]')}>
              {t('takeover.title')}
            </h2>
            <p className={careBodyClassName}>{t('takeover.body')}</p>
            <CareRequestLink requestType={CareRequestType.TAKEOVER} className={cn(careOrangeButtonClassName, 'mt-2 self-stretch sm:self-start')}>
              {t('takeover.cta')}
            </CareRequestLink>
          </div>
          <ol className="flex flex-col gap-3.5">
            {steps.map((step, index) => (
              <li
                key={step.title}
                data-reveal
                style={revealDelay(index)}
                className="flex gap-4 rounded-2xl border border-care-line bg-care-canvas p-5 lg:gap-5 lg:p-6"
              >
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-care font-bold text-white lg:h-10 lg:w-10">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[17px] font-bold lg:text-xl">{step.title}</h3>
                  <p className="text-sm leading-normal text-care-muted lg:text-[15px]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <div data-reveal className="flex gap-4 rounded-2xl bg-care-forest p-6 text-white lg:p-8">
            <ShieldIcon className="mt-0.5 shrink-0 text-care-leaf" />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-care-leaf lg:text-xl">{t('takeover.guaranteesTitle')}</h3>
              <p className="text-[15px] leading-normal text-care-pale">{t('takeover.guaranteesBody')}</p>
            </div>
          </div>
          <div data-reveal style={revealDelay(1)} className="flex gap-4 rounded-2xl bg-care-claim p-6 lg:p-8">
            <ToolsIcon className="mt-0.5 shrink-0 text-care-alert" />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-care-rust lg:text-xl">{t('takeover.unfinishedTitle')}</h3>
              <p className="text-[15px] leading-normal text-care-bark">{t('takeover.unfinishedBody')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
