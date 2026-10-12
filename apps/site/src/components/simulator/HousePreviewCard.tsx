import { Component, lazy, ReactNode, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { housePreviewOf } from '@/app/simulator/domain/entities/HousePreview';
import { householdEquipments, SolarEstimate, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { effectiveRoofTilt, SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';
import type { HouseSceneLabels } from '@/components/simulator/house/HouseCanvas';
import { loadHouseCanvas } from '@/components/simulator/house/houseCanvasLoader';

const HouseCanvas = lazy(() => loadHouseCanvas().then((module) => ({ default: module.HouseCanvas })));

type HouseErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

class HouseErrorBoundary extends Component<HouseErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const canvasNoticeClassName = 'absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-light';

type HousePreviewCardProps = {
  answers: SimulatorAnswers;
  estimate: SolarEstimate;
  isPinned: boolean;
  className?: string;
};

export const HousePreviewCard = ({ answers, estimate, isPinned, className }: HousePreviewCardProps) => {
  const { t } = useTranslation('simulator');
  const preview = housePreviewOf(answers, estimate);

  const labels: HouseSceneLabels = {
    equipment: Object.fromEntries(
      householdEquipments.map((item) => [item, t('house.callouts.equipment', { label: t(`house.equipments.${item}`) })]),
    ) as HouseSceneLabels['equipment'],
    panels: t('house.callouts.panels', { count: estimate.panelCount }),
    battery: estimate.batteryKwh > 0 ? t('house.callouts.battery', { kwh: estimate.batteryKwh }) : null,
    compass: {
      north: t('house.compass.north'),
      east: t('house.compass.east'),
      south: t('house.compass.south'),
      west: t('house.compass.west'),
    },
  };

  const legend = [
    { key: 'panels', isEnergy: true, text: t('house.legend.panels', { count: estimate.panelCount, kwc: estimate.installedKwc }) },
    {
      key: 'battery',
      isEnergy: estimate.batteryKwh > 0,
      text: estimate.batteryKwh > 0 ? t('house.legend.battery', { kwh: estimate.batteryKwh }) : t('house.legend.noBattery'),
    },
    {
      key: 'roof',
      isEnergy: false,
      text: t('house.legend.roof', {
        covering: t(`wizard.roofCoverings.${answers.roofCovering}`),
        orientation: t(`wizard.orientations.${answers.orientation}`),
        tilt: solarEstimateParameters.tiltDegrees[effectiveRoofTilt(answers)],
      }),
    },
    ...answers.equipment.map((item) => ({ key: item, isEnergy: false, text: t(`house.equipments.${item}`) })),
  ];

  return (
    <section
      aria-labelledby="simulator-house-title"
      className={cn(
        'overflow-hidden rounded-2xl border border-night-line bg-night motion-safe:animate-fade-up lg:rounded-[20px]',
        isPinned && 'shadow-float lg:shadow-none',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-[22px] pt-4 lg:px-8 lg:pt-6">
        <h2 id="simulator-house-title" className="text-base font-bold text-white lg:text-xl">
          {t('house.title')}
        </h2>
        <p className={cn('text-[13px] text-slate-mist', isPinned && 'hidden lg:block')}>{t('house.hint')}</p>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'relative mt-2 bg-[radial-gradient(120%_85%_at_50%_42%,#15253f_0%,#0b1120_58%,#070b16_100%)] lg:mt-3 lg:h-[380px]',
          isPinned ? 'h-[210px] sm:h-[250px]' : 'h-[270px] sm:h-[330px]',
        )}
      >
        <HouseErrorBoundary
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto px-6 py-4 text-center">
              <p className="text-sm text-slate-light">{t('house.unavailable')}</p>
              <ul className="flex flex-wrap justify-center gap-1.5">
                {legend.map((item) => (
                  <li key={item.key} className="rounded-full border border-night-line bg-night-soft px-2.5 py-1 text-xs text-slate-light">
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <Suspense fallback={<p className={cn(canvasNoticeClassName, 'motion-safe:animate-pulse')}>{t('house.loading')}</p>}>
            <HouseCanvas preview={preview} labels={labels} />
          </Suspense>
        </HouseErrorBoundary>
      </div>
      <ul
        aria-label={t('house.legendLabel')}
        className={cn('flex flex-wrap gap-2 px-[22px] pb-5 pt-4 lg:px-8 lg:pb-6', isPinned && 'sr-only lg:not-sr-only')}
      >
        {legend.map((item) => (
          <li
            key={`${item.key}-${item.text}`}
            className="inline-flex items-center rounded-full border border-night-line bg-night-soft px-3 py-1.5 text-[13px] font-medium text-slate-light motion-safe:animate-fade-up"
          >
            {item.isEnergy && <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 bg-solar" />}
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
};
