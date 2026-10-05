import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, eyebrowClassName } from '@/components/solar/horizonSolutionStyles';

const itemKeys = ['panels', 'inverters', 'batteries', 'mounting'] as const;

export const SolarHardwareSection = () => {
  const { t } = useTranslation('solar');

  return (
    <div className={containerClassName}>
      <section
        data-reveal
        aria-labelledby="solar-hardware-title"
        className="grid gap-8 rounded-[4px] border border-sand-line bg-white p-6 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:rounded-[4px] lg:px-16 lg:py-14"
      >
        <div className="flex flex-col gap-4">
          <p className={eyebrowClassName}>{t('hardware.eyebrow')}</p>
          <h2 id="solar-hardware-title" className="text-[26px] font-medium leading-[1.15] tracking-[-0.045em] lg:text-[36px]">
            {t('hardware.title')}
          </h2>
          <p className="text-[15px] leading-[1.55] text-slate-ink lg:text-base">{t('hardware.body')}</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-[200px_1fr] lg:gap-4">
          <div className="relative h-[260px] overflow-hidden rounded-[4px] sm:h-[320px] lg:h-auto lg:min-h-[280px]">
            <img
              src="/images/solar/hardware-solax-inverter-battery.webp"
              alt={t('hardware.imageAlt')}
              width={480}
              height={721}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover [object-position:50%_40%]"
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {itemKeys.map((key, index) => (
              <li key={key} data-reveal style={revealDelay(index)} className="rounded-[4px] bg-ivory p-4 lg:p-5">
                <h3 className="text-[17px] font-medium">{t(`hardware.items.${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-normal text-slate-ink">{t(`hardware.items.${key}.description`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
