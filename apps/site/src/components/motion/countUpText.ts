const numberPattern = /(?<![\p{L}\d,])(?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+)(?:,\d+)?(?!\d)/gu;
const smallestCountedNumber = 10;

const readNumber = (token: string) => Number(token.replace(/[^\d,]/g, '').replace(',', '.'));

const writeNumberLike = (token: string, value: number) => {
  const separator = token.match(/[^\d,]/)?.[0];
  const decimals = token.split(',')[1]?.length ?? 0;
  const [integer, fraction] = value.toFixed(decimals).split('.');
  const grouped = separator ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : integer;
  return fraction ? `${grouped},${fraction}` : grouped;
};

export const isCountable = (template: string) =>
  (template.match(numberPattern) ?? []).some((token) => readNumber(token) >= smallestCountedNumber);

export const countUpText = (template: string, progress: number) =>
  progress >= 1 ? template : template.replace(numberPattern, (token) => writeNumberLike(token, readNumber(token) * Math.max(progress, 0)));
