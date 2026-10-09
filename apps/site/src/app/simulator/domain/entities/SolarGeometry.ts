export interface SolarSite {
  latitude: number;
  longitude: number;
}

export const hoursPerDay = 24;
export const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const midMonthDayOfYear = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
const firstSummerTimeMonth = 3;
const lastSummerTimeMonth = 9;
const stepsPerHour = 6;
const solarConstantWm2 = 1361;
const clearSkyTransmittance = 0.7;
const airMassExponent = 0.678;
const diffuseShare = 0.2;
const degrees = Math.PI / 180;

export const clockOffsetHours = (monthIndex: number, longitude: number): number => {
  const utcOffset = monthIndex >= firstSummerTimeMonth && monthIndex <= lastSummerTimeMonth ? 2 : 1;
  return utcOffset - longitude / 15;
};

const solarDeclination = (monthIndex: number) => 23.45 * degrees * Math.sin(((2 * Math.PI) / 365) * (284 + midMonthDayOfYear[monthIndex]));

const planeIrradiance = (latitude: number, declination: number, hourAngle: number, tilt: number, azimuth: number): number => {
  const sinElevation = Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
  if (sinElevation <= 0.01) return 0;
  const directNormal = solarConstantWm2 * clearSkyTransmittance ** ((1 / sinElevation) ** airMassExponent);
  const cosIncidence =
    Math.sin(declination) * Math.sin(latitude) * Math.cos(tilt) -
    Math.sin(declination) * Math.cos(latitude) * Math.sin(tilt) * Math.cos(azimuth) +
    Math.cos(declination) * Math.cos(latitude) * Math.cos(tilt) * Math.cos(hourAngle) +
    Math.cos(declination) * Math.sin(latitude) * Math.sin(tilt) * Math.cos(azimuth) * Math.cos(hourAngle) +
    Math.cos(declination) * Math.sin(tilt) * Math.sin(azimuth) * Math.sin(hourAngle);
  return directNormal * Math.max(0, cosIncidence) + diffuseShare * directNormal * sinElevation * ((1 + Math.cos(tilt)) / 2);
};

export const solarHourlyShape = (site: SolarSite, monthIndex: number, tiltDegrees: number, azimuthsDegrees: number[]): number[] => {
  const latitude = site.latitude * degrees;
  const declination = solarDeclination(monthIndex);
  const offset = clockOffsetHours(monthIndex, site.longitude);
  const weights = Array.from({ length: hoursPerDay }, (_, hour) => {
    let total = 0;
    for (let step = 0; step < stepsPerHour; step++) {
      const solarTime = hour + (step + 0.5) / stepsPerHour - offset;
      const hourAngle = 15 * (solarTime - 12) * degrees;
      for (const azimuth of azimuthsDegrees) {
        total += planeIrradiance(latitude, declination, hourAngle, tiltDegrees * degrees, azimuth * degrees);
      }
    }
    return total;
  });
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return weights.map((weight) => (sum > 0 ? weight / sum : 0));
};
