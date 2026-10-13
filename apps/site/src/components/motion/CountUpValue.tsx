export const CountUpValue = ({ value }: { value: string }) => (
  <span data-count-up={value} className="tabular-nums">{value}</span>
);
