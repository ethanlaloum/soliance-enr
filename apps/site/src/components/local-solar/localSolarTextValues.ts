import { estimateAreaProduction, type ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';

export const typicalPeakPowerKwc = 6;

const minutesPerHour = 60;
const decemberIndex = 11;
const julyIndex = 6;

export type LocalSolarTextValues = {
  city: string;
  travel: string;
  km: number;
  yield: number;
  power: number;
  yearly: number;
  december: number;
  july: number;
};

const nonBreakingSpace = '\u00a0';

export const formatTravelTime = (minutes: number): string =>
  minutes < minutesPerHour
    ? `${minutes}${nonBreakingSpace}min`
    : `${Math.floor(minutes / minutesPerHour)}${nonBreakingSpace}h${nonBreakingSpace}${String(minutes % minutesPerHour).padStart(2, '0')}`;

export const localSolarTextValues = (area: ServiceArea, city: string): LocalSolarTextValues => {
  const estimate = estimateAreaProduction(area, typicalPeakPowerKwc);
  return {
    city,
    travel: formatTravelTime(area.driveMinutes),
    km: area.roadDistanceKm,
    yield: area.solarYieldKwhPerKwc,
    power: typicalPeakPowerKwc,
    yearly: estimate.yearlyKwh,
    december: estimate.monthlyKwh[decemberIndex],
    july: estimate.monthlyKwh[julyIndex],
  };
};
