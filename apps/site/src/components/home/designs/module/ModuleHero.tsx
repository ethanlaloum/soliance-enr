import { CSSProperties, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';
import { SplitWords } from '@/components/home/SplitWords';
import { useMagnetic } from '@/components/home/useMagnetic';
import { heroImage, statKeys, trustKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { ModuleImage } from '@/components/home/designs/module/ModuleImage';
import { ModuleEyebrow } from '@/components/home/designs/module/ModuleParts';
import { ctaOutlineClassName, ctaSolidClassName } from '@/components/home/designs/module/moduleClassNames';
import { useModuleImages } from '@/components/home/designs/module/useModuleImages';

const figureFadeDelay = (index: number) => ({ '--fade-delay': `${1.05 + index * 0.12}s` }) as CSSProperties;

const KeyFigures = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation('home');

  return (
    <dl
      aria-label={t('hero.statsLabel')}
      className={cn(
        'mod-rule-draw relative grid-cols-3 before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:bg-[#C9D1DA]',
        compact ? 'mt-10 grid lg:hidden' : 'mt-16 hidden lg:grid',
      )}
    >
      {statKeys.map((key, index) => (
        <div
          key={key}
          style={figureFadeDelay(index)}
          className={cn(
            'hero-fade relative flex flex-col-reverse justify-end border-l border-[#C9D1DA] first:border-l-0 first:pl-0 before:absolute before:top-0 before:h-1.5 before:w-1.5 before:bg-[#E07B28]',
            compact ? 'gap-2 pb-10 pl-3 pt-5 before:left-3 first:before:left-0' : 'gap-4 pb-14 pl-8 pt-9 before:left-8 first:before:left-0',
          )}
        >
          <dt className={cn('font-medium leading-snug text-[#4A535E]', compact ? 'text-xs' : 'max-w-[260px] text-base')}>
            {t(compact ? `hero.stats.${key}.labelShort` : `hero.stats.${key}.label`)}
          </dt>
          <dd
            className={cn(
              'font-extrabold text-[#14181D]',
              compact ? 'text-[clamp(1.75rem,8.4vw,2.5rem)] leading-none tracking-[-0.045em]' : 'text-[clamp(4rem,6.6vw,6.75rem)] leading-[0.86] tracking-[-0.055em]',
            )}
          >
            {t(`hero.stats.${key}.value`)}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export const ModuleHero = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const title = t('hero.title');

  useMagnetic(sectionRef);
  useModuleImages(sectionRef);

  return (
    <section ref={sectionRef} className="bg-white text-[#14181D]">
      <div className={cn(containerClassName, 'pt-8 lg:pt-14')}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="flex flex-col lg:col-span-7">
            <ModuleEyebrow className="hero-fade [--fade-delay:0.1s]">
              <Responsive mobile={t('hero.eyebrowShort')} desktop={t('hero.eyebrow')} />
            </ModuleEyebrow>
            <h1
              aria-label={title}
              className="mt-6 text-[clamp(2.5rem,11.2vw,3.75rem)] font-extrabold leading-[0.92] tracking-[-0.05em] lg:mt-8 lg:text-[clamp(4rem,6.6vw,6.75rem)]"
            >
              <SplitWords text={title} />
            </h1>
            <p className="hero-fade mt-6 max-w-[600px] text-[17px] leading-[1.6] text-[#4A535E] [--fade-delay:0.55s] lg:mt-8 lg:text-[19px] lg:leading-[1.55]">
              <Responsive mobile={t('hero.leadShort')} desktop={t('hero.lead')} />
            </p>
            <div className="hero-fade mt-8 flex flex-col gap-3 [--fade-delay:0.7s] sm:flex-row sm:flex-wrap lg:mt-10">
              <Link data-magnetic to={paths.simulator} className={ctaSolidClassName}>
                {t('hero.simulate')}
              </Link>
              <a data-magnetic href={`#${contactAnchor}`} className={ctaOutlineClassName}>
                {t('hero.requestStudy')}
              </a>
            </div>
            <ul aria-label={t('hero.trustLabel')} className="hero-fade mt-7 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-[#4A535E] [--fade-delay:0.85s]">
              {trustKeys.map((key) => (
                <li key={key} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-[#E07B28]" />
                  {t(`hero.trust.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <ModuleImage
            intro="css"
            parallax
            grid={{ cols: 6, rows: 3 }}
            desktopGrid={{ cols: 6, rows: 5 }}
            className="aspect-[4/3] lg:col-span-5 lg:aspect-[4/5] lg:self-end"
          >
            <img
              src={heroImage.src}
              alt={t('hero.imageAlt')}
              width={heroImage.width}
              height={heroImage.height}
              fetchPriority="high"
              className="h-full w-full object-cover object-[42%_50%]"
            />
          </ModuleImage>
        </div>
        <KeyFigures />
        <KeyFigures compact />
      </div>
    </section>
  );
};
