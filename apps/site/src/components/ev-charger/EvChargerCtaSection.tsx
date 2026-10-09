import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

export const EvChargerCtaSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <div className={cn(containerClassName, 'pb-14 lg:pb-20')}>
      <section
        data-reveal
        aria-labelledby="ev-cta-title"
        className="flex flex-col items-stretch gap-5 rounded-2xl bg-charge p-6 text-white sm:items-start lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[20px] lg:px-[52px] lg:py-11"
      >
        <div>
          <h2 id="ev-cta-title" className="text-[22px] font-bold leading-tight lg:text-[30px]">
            {t('cta.title')}
          </h2>
          <p className="mt-1.5 text-[15px] leading-normal text-charge-soft lg:text-base">{t('cta.body')}</p>
        </div>
        <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 focus-visible:outline-white')}>
          {t('cta.button')}
        </ContactLink>
      </section>
    </div>
  );
};
