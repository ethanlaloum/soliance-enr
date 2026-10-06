import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { BoltIcon } from '@/components/care/CareIcons';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careOrangeButtonClassName } from '@/components/care/careStyles';

export const CareClaimSection = () => {
  const { t } = useTranslation('care');

  return (
    <div className="bg-white">
      <div className={cn(containerClassName, 'pb-14 lg:pb-[88px] desktop:px-20')}>
        <section
          data-reveal
          aria-labelledby="care-claim-title"
          className="flex flex-col gap-5 rounded-[20px] bg-care-claim p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12 lg:py-10"
        >
          <div className="flex gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-solar sm:flex">
              <BoltIcon />
            </span>
            <div className="flex flex-col gap-2">
              <h2 id="care-claim-title" className="text-xl font-bold leading-tight text-care-rust lg:text-[26px]">
                {t('claim.title')}
              </h2>
              <p className="text-[15px] leading-normal text-care-bark lg:text-[17px]">{t('claim.body')}</p>
            </div>
          </div>
          <CareRequestLink requestType={CareRequestType.CLAIM} className={cn(careOrangeButtonClassName, 'shrink-0')}>
            {t('claim.cta')}
          </CareRequestLink>
        </section>
      </div>
    </div>
  );
};
