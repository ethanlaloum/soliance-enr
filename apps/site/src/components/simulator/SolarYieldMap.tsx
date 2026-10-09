import { PointerEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import {
  averageSolarYieldKwhPerKwc,
  departmentCodeOfPostalCode,
  DepartmentSolarYield,
  departmentSolarYieldOf,
  departmentSolarYields,
  solarYieldClassBoundsKwhPerKwc,
  solarYieldClassOf,
  solarYieldGapPercent,
} from '@/app/simulator/domain/entities/DepartmentSolarYield';
import { franceDepartmentShapes, franceMapViewBox, projectOnFranceMap } from '@/components/simulator/franceDepartmentShapes';
import { simulatorCardClassName } from '@/components/simulator/simulatorStyles';

const classFills = ['#FBEBDD', '#F6CFA6', '#EEA868', '#E07B28', '#A4520F'];

const yieldByCode = new Map(departmentSolarYields.map((department) => [department.code, department]));

type HoveredDepartment = {
  department: DepartmentSolarYield;
  x: number;
  y: number;
};

type SolarYieldMapProps = {
  postalCode: string;
  location: AddressLocation | null;
  city: string | null;
  communeYield: CommuneSolarYield | null;
};

const ownSummaryClassName = 'rounded-xl bg-ivory px-4 py-3 text-sm leading-normal text-slate-text';

export const SolarYieldMap = ({ postalCode, location, city, communeYield }: SolarYieldMapProps) => {
  const { t } = useTranslation('simulator');
  const frameRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredDepartment | null>(null);
  const own = departmentSolarYieldOf(postalCode);
  const hasPostalCode = departmentCodeOfPostalCode(postalCode) !== null;
  const point = location ? projectOnFranceMap(location) : null;
  const ownShape = own ? franceDepartmentShapes.find((shape) => shape.code === own.code) : undefined;
  const average = averageSolarYieldKwhPerKwc();
  const commune = own && city && communeYield ? { name: city, yieldKwhPerKwc: communeYield.yearlyKwhPerKwc } : null;
  const shownYield = commune?.yieldKwhPerKwc ?? own?.yieldKwhPerKwc ?? 0;
  const gap = own ? solarYieldGapPercent(shownYield) : 0;
  const gapKey = gap > 0 ? 'above' : gap < 0 ? 'below' : 'equal';
  const [first, ...bounds] = solarYieldClassBoundsKwhPerKwc;

  const legend = [
    t('yieldMap.legend.below', { value: first }),
    ...solarYieldClassBoundsKwhPerKwc.slice(0, -1).map((bound, index) => t('yieldMap.legend.range', { from: bound, to: bounds[index] - 1 })),
    t('yieldMap.legend.above', { value: bounds.at(-1) }),
  ];

  const track = (event: PointerEvent<SVGSVGElement>) => {
    const code = (event.target as SVGElement).dataset.code;
    const department = code ? yieldByCode.get(code) : undefined;
    const frame = frameRef.current?.getBoundingClientRect();
    if (!department || !frame) {
      setHovered(null);
      return;
    }
    setHovered({ department, x: event.clientX - frame.left, y: event.clientY - frame.top });
  };

  return (
    <section aria-labelledby="simulator-yield-map-title" className={simulatorCardClassName}>
      <div className="flex flex-col gap-1">
        <h2 id="simulator-yield-map-title" className="text-lg font-bold lg:text-xl">
          {t('yieldMap.title')}
        </h2>
        <p className="text-sm leading-normal text-slate-ink">{t('yieldMap.lead')}</p>
      </div>

      {own ? (
        <p aria-live="polite" className={ownSummaryClassName}>
          <span className="block font-semibold text-night">
            {commune ? t('yieldMap.own.commune', { name: commune.name, code: own.code }) : t('yieldMap.own.name', { name: own.name, code: own.code })}
          </span>
          <span className="block text-[22px] font-bold leading-tight text-solar-dark lg:text-[26px]">{t('yieldMap.own.value', { value: shownYield })}</span>
          <span className="block">{t(`yieldMap.own.gap.${gapKey}`, { value: Math.abs(gap), average })}</span>
        </p>
      ) : (
        <p aria-live="polite" className={ownSummaryClassName}>
          {hasPostalCode ? t('yieldMap.outside', { average }) : t('yieldMap.empty', { average })}
        </p>
      )}

      <figure className="flex flex-col gap-3">
        <div ref={frameRef} className="relative mx-auto w-full max-w-[460px]">
          <svg
            viewBox={`0 0 ${franceMapViewBox.width} ${franceMapViewBox.height}`}
            role="img"
            aria-label={own ? t(point ? 'yieldMap.ariaLabelPoint' : 'yieldMap.ariaLabelOwn', { name: own.name }) : t('yieldMap.ariaLabel')}
            className="block h-auto w-full touch-manipulation"
            onPointerMove={track}
            onPointerDown={track}
            onPointerLeave={() => setHovered(null)}
          >
            {franceDepartmentShapes.map((shape) => {
              const department = yieldByCode.get(shape.code);
              const fill = department ? classFills[solarYieldClassOf(department.yieldKwhPerKwc)] : classFills[0];
              const isHovered = hovered?.department.code === shape.code;
              return (
                <path
                  key={shape.code}
                  data-code={shape.code}
                  d={shape.path}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 1.6 : 0.6}
                  strokeLinejoin="round"
                  className={cn('cursor-pointer transition-opacity motion-reduce:transition-none', hovered && !isHovered && 'opacity-80')}
                />
              );
            })}
            {ownShape && <path d={ownShape.path} fill="none" strokeWidth={2.2} strokeLinejoin="round" className="pointer-events-none stroke-night" />}
            {point && (
              <g className="pointer-events-none">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={7}
                  className="fill-night/25 origin-center [transform-box:fill-box] motion-safe:animate-pulse-ring motion-reduce:hidden"
                />
                <circle cx={point.x} cy={point.y} r={7} strokeWidth={2.5} className="fill-night stroke-white" />
                <circle cx={point.x} cy={point.y} r={2.5} className="fill-solar" />
              </g>
            )}
          </svg>

          {hovered && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-night px-3 py-2 text-xs leading-snug text-white shadow-lg"
              style={{ left: hovered.x, top: hovered.y }}
            >
              <span className="block font-semibold">{t('yieldMap.own.name', { name: hovered.department.name, code: hovered.department.code })}</span>
              <span className="block text-sm font-bold text-[#F6CFA6]">{t('yieldMap.own.value', { value: hovered.department.yieldKwhPerKwc })}</span>
              <span className="block text-slate-light">{t('yieldMap.tooltipCity', { city: hovered.department.referenceCity })}</span>
            </div>
          )}
        </div>

        <ul aria-label={t('yieldMap.legend.label')} className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5 text-xs text-slate-ink">
          {legend.map((label, index) => (
            <li key={label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: classFills[index] }} />
              {label}
            </li>
          ))}
        </ul>

        <figcaption className="text-xs leading-normal text-slate-ink">{t('yieldMap.caption')}</figcaption>
      </figure>
    </section>
  );
};
