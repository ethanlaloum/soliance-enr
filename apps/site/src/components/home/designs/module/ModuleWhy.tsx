import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { assuranceKeys, valueKeys } from '@/components/home/designs/homeContent';
import { ModuleImage } from '@/components/home/designs/module/ModuleImage';
import { ModuleEyebrow } from '@/components/home/designs/module/ModuleParts';
import { titleXLClassName } from '@/components/home/designs/module/moduleClassNames';
import { useModuleImages } from '@/components/home/designs/module/useModuleImages';

export const ModuleWhy = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useModuleImages(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="why-title" className="bg-white text-[#14181D]">
      <div className={cn(containerClassName, 'border-t border-[#C9D1DA] py-20 lg:py-32')}>
        <div className="flex flex-col gap-6 lg:max-w-[66rem] lg:gap-8">
          <ModuleEyebrow>{t('why.eyebrow')}</ModuleEyebrow>
          <h2 id="why-title" data-reveal-heading className={titleXLClassName}>
            {t('why.title')}
          </h2>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <p className="text-[17px] leading-[1.65] text-[#4A535E] lg:col-span-4 lg:text-lg">{t('why.body')}</p>
          <ul className="grid gap-[2px] rounded-[4px] bg-[#C9D1DA] p-[2px] sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {valueKeys.map((key) => (
              <li key={key} className="flex flex-col gap-2 bg-white p-6 lg:gap-3 lg:p-8">
                <span className="flex items-center gap-3 text-lg font-bold tracking-[-0.01em] lg:text-xl">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-[#E07B28]" />
                  {t(`why.values.${key}.title`)}
                </span>
                <span className="text-[15px] leading-[1.55] text-[#4A535E] lg:text-base">{t(`why.values.${key}.description`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <ModuleImage intro="scroll" parallax grid={{ cols: 4, rows: 3 }} desktopGrid={{ cols: 8, rows: 3 }} className="aspect-[4/3] sm:aspect-[2.2/1] lg:col-span-8">
            <img
              src="/images/team-showroom.webp"
              alt={t('why.imageAlt')}
              width={1200}
              height={547}
              loading="lazy"
              className="h-full w-full object-cover object-[40%_30%]"
            />
          </ModuleImage>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {assuranceKeys.map((key) => (
              <div key={key} className="mod-cell-texture flex flex-col justify-end gap-2 rounded-[4px] p-6 text-white lg:p-8">
                <dt className="text-sm font-medium text-[#AEBBCB]">{t(`why.${key}.label`)}</dt>
                <dd className="text-xl font-extrabold leading-snug tracking-[-0.02em] lg:text-[26px] lg:leading-[1.15]">{t(`why.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
