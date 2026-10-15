import { ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { batteryOptionsKwh } from '@/app/simulator/domain/entities/SolarEstimate';
import { SegmentedControl } from '@/components/simulator/controls/SegmentedControl';
import { simulatorCardClassName, simulatorHintClassName } from '@/components/simulator/simulatorStyles';
import { fieldLabelClassName } from '@/components/ui/fieldStyles';

type TunePatch = Partial<{ batteryKwh: number | null; kwhPriceEur: number; priceTrendPercent: number; projectionYears: number }>;

type TuneEstimatePanelProps = {
  batteryKwh: number | null;
  recommendedBatteryKwh: number;
  kwhPriceEur: number;
  priceTrendPercent: number;
  projectionYears: number;
  onChange: (patch: TunePatch) => void;
  children?: ReactNode;
};

const recommendedBattery = 'recommended';
const regulatedKwhPriceEur = 0.2001;
const projectionHorizons = [10, 20, 25, 30];
const sourceKeys = ['sunshine', 'losses', 'tilt', 'profile', 'battery', 'subscription', 'surplus', 'price'] as const;

const groupTitleClassName = 'text-[11px] font-bold uppercase tracking-[0.12em] text-slate-ink';
const panelEase = [0.22, 1, 0.36, 1] as const;

const groupMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 + index * 0.06, duration: 0.3, ease: panelEase } }),
};

export const TuneEstimatePanel = ({
  batteryKwh,
  recommendedBatteryKwh,
  kwhPriceEur,
  priceTrendPercent,
  projectionYears,
  onChange,
  children,
}: TuneEstimatePanelProps) => {
  const { t, i18n } = useTranslation('simulator');
  const [isOpen, setIsOpen] = useState(false);
  const [showsSources, setShowsSources] = useState(false);
  const panelId = useId();
  const batteryLabelId = useId();
  const horizonLabelId = useId();
  const priceId = useId();
  const trendId = useId();
  const price = new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 3, maximumFractionDigits: 4 });
  const percent = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 });
  const priceText = t('tune.price.value', { value: price.format(kwhPriceEur) });
  const trendText = t('tune.trend.value', { value: percent.format(priceTrendPercent) });

  const batteryOptions = [
    { value: recommendedBattery, label: t('tune.battery.recommended'), hint: t('tune.battery.kwh', { kwh: recommendedBatteryKwh }) },
    ...batteryOptionsKwh().map((kwh) => ({
      value: String(kwh),
      label: kwh === 0 ? t('tune.battery.none') : t('tune.battery.kwh', { kwh }),
    })),
  ];

  return (
    <section className={cn(simulatorCardClassName, 'gap-0 p-0 lg:gap-0 lg:p-0')}>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-[22px] py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-solar/40 lg:rounded-[20px] lg:px-9 lg:py-6"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-night lg:text-xl">{t('tune.title')}</span>
            <span className="text-sm text-slate-ink">{t('tune.subtitle')}</span>
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: panelEase }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-night ring-1 ring-sand-line"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8l5 5 5-5" />
            </svg>
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="tune-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: panelEase }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 border-t border-sand-line px-[22px] pb-6 pt-5 lg:px-9 lg:pb-8">
              <motion.div custom={0} variants={groupMotion} initial="hidden" animate="visible" className="flex flex-col gap-2">
                <p id={batteryLabelId} className={groupTitleClassName}>
                  {t('tune.battery.title')}
                </p>
                <SegmentedControl<string>
                  labelId={batteryLabelId}
                  value={batteryKwh === null ? recommendedBattery : String(batteryKwh)}
                  onChange={(next) => onChange({ batteryKwh: next === recommendedBattery ? null : Number(next) })}
                  options={batteryOptions}
                  className="grid-flow-row grid-cols-4 text-xs sm:grid-cols-5 sm:text-sm"
                />
                <p className={simulatorHintClassName}>{t('tune.battery.hint')}</p>
              </motion.div>

              {children && (
                <motion.div custom={1} variants={groupMotion} initial="hidden" animate="visible" className="flex flex-col gap-4">
                  <p className={groupTitleClassName}>{t('tune.installation.title')}</p>
                  {children}
                </motion.div>
              )}

              <motion.div custom={2} variants={groupMotion} initial="hidden" animate="visible" className="flex flex-col gap-4">
                <p className={groupTitleClassName}>{t('tune.economics.title')}</p>
                <div className={fieldLabelClassName}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={priceId}>{t('tune.price.label')}</label>
                    <output htmlFor={priceId} className="shrink-0 text-base font-bold text-night">
                      {priceText}
                    </output>
                  </div>
                  <input
                    id={priceId}
                    type="range"
                    min={0.15}
                    max={0.4}
                    step={0.005}
                    value={kwhPriceEur}
                    aria-valuetext={priceText}
                    className="h-11 w-full cursor-pointer accent-solar"
                    onChange={(event) => onChange({ kwhPriceEur: Number(event.target.value) })}
                  />
                  <p className={simulatorHintClassName}>
                    {t('tune.price.hint', { value: price.format(regulatedKwhPriceEur) })}
                    <button
                      type="button"
                      onClick={() => onChange({ kwhPriceEur: regulatedKwhPriceEur })}
                      className="ml-1.5 font-semibold text-[#a6540f] underline decoration-solar/40 underline-offset-2 hover:decoration-solar"
                    >
                      {t('tune.price.useRegulated', { value: price.format(regulatedKwhPriceEur) })}
                    </button>
                  </p>
                </div>
                <div className={fieldLabelClassName}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={trendId}>{t('tune.trend.label')}</label>
                    <output htmlFor={trendId} className="shrink-0 text-base font-bold text-night">
                      {trendText}
                    </output>
                  </div>
                  <input
                    id={trendId}
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={priceTrendPercent}
                    aria-valuetext={trendText}
                    className="h-11 w-full cursor-pointer accent-solar"
                    onChange={(event) => onChange({ priceTrendPercent: Number(event.target.value) })}
                  />
                  <p className={simulatorHintClassName}>{t('tune.trend.hint')}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span id={horizonLabelId} className="text-[13px] font-semibold text-night sm:text-sm">
                    {t('tune.horizon.label')}
                  </span>
                  <SegmentedControl<number>
                    labelId={horizonLabelId}
                    value={projectionYears}
                    onChange={(years) => onChange({ projectionYears: years })}
                    options={projectionHorizons.map((years) => ({ value: years, label: t('tune.horizon.years', { count: years }) }))}
                  />
                </div>
              </motion.div>

              <motion.div custom={3} variants={groupMotion} initial="hidden" animate="visible" className="border-t border-sand-line pt-4">
                <button
                  type="button"
                  aria-expanded={showsSources}
                  onClick={() => setShowsSources((open) => !open)}
                  className="flex min-h-11 items-center gap-2 text-sm font-semibold text-night outline-none focus-visible:ring-2 focus-visible:ring-solar/40"
                >
                  <motion.span aria-hidden="true" animate={{ rotate: showsSources ? 90 : 0 }} className="inline-block text-solar">
                    ›
                  </motion.span>
                  {t('tune.sources.title')}
                </button>
                <AnimatePresence initial={false}>
                  {showsSources && (
                    <motion.ul
                      key="sources"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: panelEase }}
                      className="overflow-hidden"
                    >
                      {sourceKeys.map((key) => (
                        <li key={key} className="flex gap-2 pt-2 text-[13px] leading-snug text-slate-ink">
                          <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-solar" />
                          {t(`tune.sources.items.${key}`)}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
