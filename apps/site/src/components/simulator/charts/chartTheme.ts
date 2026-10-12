export const chartEase = [0.22, 1, 0.36, 1] as const;

export const monthKeys = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
