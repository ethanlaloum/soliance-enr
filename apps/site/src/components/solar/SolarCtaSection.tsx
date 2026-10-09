import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

export const SolarCtaSection = () => {
  const { t } = useTranslation('solar');

  return (
    <div className={cn(containerClassName, 'pb-12 lg:pb-20')}>
      <section
        data-reveal
        aria-labelledby="solar-cta-title"
        className="flex flex-col gap-5 rounded-2xl bg-night p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[20px] lg:px-[52px] lg:py-11"
      >
        <div>
          <h2 id="solar-cta-title" className="text-[22px] font-bold leading-[1.2] text-white lg:text-[30px]">
            {t('cta.title')}
          </h2>
          <p className="mt-1.5 text-[15px] text-slate-light lg:text-base">{t('cta.description')}</p>
        </div>
        <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} className={cn(buttonVariants({ size: 'lg' }), 'shrink-0')}>
          {t('cta.button')}
        </ContactLink>
      </section>
    </div>
  );
};
