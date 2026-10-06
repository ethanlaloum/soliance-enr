import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { config } from '@/config';
import { containerClassName } from '@/components/home/containerClassName';
import { FaqItem, FaqList } from '@/components/page/FaqList';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { careTitleClassName } from '@/components/care/careStyles';

export const CareFaqSection = () => {
  const { t } = useTranslation('care');
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <section id={careAnchors.faq} aria-labelledby="care-faq-title" className={careSectionScrollClassName}>
      <div className={cn(containerClassName, 'grid gap-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-20 desktop:px-20')}>
        <div data-reveal className="flex flex-col gap-3">
          <h2 id="care-faq-title" className={cn(careTitleClassName, 'lg:text-[38px]')}>
            {t('faq.title')}
          </h2>
          <p className="text-[15px] text-care-muted lg:text-base">
            {t('faq.more')}{' '}
            <a href={config.carePhoneHref} className="font-bold text-care hover:text-care-deep">
              {t('request.phone')}
            </a>
          </p>
        </div>
        <FaqList items={items} accentClassName="text-care" className="border-care-line divide-care-line" />
      </div>
    </section>
  );
};
