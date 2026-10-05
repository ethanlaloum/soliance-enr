import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { solutionEntries } from '@/components/home/designs/homeContent';
import { ModuleImage } from '@/components/home/designs/module/ModuleImage';
import { focusOnLightClassName, titleXLClassName } from '@/components/home/designs/module/moduleClassNames';
import { useModuleImages } from '@/components/home/designs/module/useModuleImages';

const motionSafeTransition = 'transition-transform duration-500 ease-out-expo motion-reduce:transition-none';

export const ModuleSolutions = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useModuleImages(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="solutions-title" className="bg-[#EEF1F4] text-[#14181D]">
      <div className={cn(containerClassName, 'py-20 lg:py-32')}>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 id="solutions-title" data-reveal-heading className={cn(titleXLClassName, 'lg:col-span-7')}>
            {t('solutions.title')}
          </h2>
          <p className="hidden max-w-[460px] text-lg leading-[1.6] text-[#4A535E] lg:col-span-4 lg:col-start-9 lg:block">{t('solutions.intro')}</p>
        </div>
        <ul className="mt-10 border-t-2 border-[#14181D] lg:mt-16">
          {solutionEntries.map((solution) => (
            <li key={solution.key} className="border-b border-[#C9D1DA]">
              <Link
                to={solution.to}
                className={cn(
                  'group relative flex items-center gap-5 py-5 text-[#14181D] hover:text-[#14181D] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)_auto] lg:gap-10 lg:py-8 xl:grid-cols-[17.5rem_minmax(0,1fr)_auto]',
                  focusOnLightClassName,
                  'focus-visible:outline-offset-[6px]',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-y-0 -left-5 -right-5 origin-left scale-x-0 bg-white group-hover:scale-x-100 group-focus-visible:scale-x-100 lg:-left-6 lg:-right-6', motionSafeTransition)}
                />
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-y-0 -left-5 w-1 origin-bottom scale-y-0 bg-[#E07B28] group-hover:scale-y-100 group-focus-visible:scale-y-100 lg:-left-6', motionSafeTransition)}
                />
                <ModuleImage grid={{ cols: 2, rows: 2 }} className="h-[84px] w-[84px] shrink-0 lg:hidden">
                  <img src={solution.thumbnail} alt="" width={84} height={84} loading="lazy" className="h-full w-full object-cover" />
                </ModuleImage>
                <ModuleImage intro="scroll" grid={{ cols: 4, rows: 2 }} className="hidden aspect-[16/10] lg:block">
                  <img
                    src={solution.image}
                    alt={t(`solutions.${solution.key}.imageAlt`)}
                    width={900}
                    height={solution.imageHeight}
                    loading="lazy"
                    style={{ objectPosition: solution.objectPosition }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </ModuleImage>
                <span className="relative flex min-w-0 flex-1 flex-col gap-1 lg:grid lg:gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:items-center xl:gap-10">
                  <span className="flex flex-col gap-1 lg:gap-3">
                    <span className="hidden text-[15px] font-medium text-[#4A535E] lg:block">{t(`solutions.${solution.key}.audience`)}</span>
                    <span
                      className={cn(
                        'text-xl font-extrabold leading-tight tracking-[-0.02em] group-hover:translate-x-2 lg:text-[clamp(2.125rem,3.5vw,3.5rem)] lg:leading-[0.98] lg:tracking-[-0.045em]',
                        motionSafeTransition,
                      )}
                    >
                      {t(`solutions.${solution.key}.title`)}
                    </span>
                    <span className="text-sm text-[#4A535E] lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                  </span>
                  <span className="hidden max-w-[460px] text-[17px] leading-[1.6] text-[#4A535E] lg:block">{t(`solutions.${solution.key}.description`)}</span>
                </span>
                <span aria-hidden="true" className="relative hidden items-center gap-3 whitespace-nowrap text-[17px] font-semibold lg:flex">
                  {t('solutions.discover')}{' '}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 motion-reduce:transition-none">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
