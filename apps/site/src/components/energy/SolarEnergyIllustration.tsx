import { useId } from 'react';

type Props = { labels: Record<string, string> };

export const SolarEnergyIllustration = ({ labels }: Props) => {
  const id = useId().replaceAll(':', '');
  const fill = (name: string) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 800 600" className="energy-lab__diagram" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--energy-slate-light)" /><stop offset=".18" stopColor="var(--energy-slate-ink)" /><stop offset=".65" stopColor="var(--energy-night-soft)" /><stop offset="1" stopColor="var(--energy-slate)" /></linearGradient>
        <linearGradient id={`${id}-cell`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--energy-night-line)" /><stop offset=".5" stopColor="var(--energy-night-soft)" /><stop offset="1" stopColor="var(--energy-night-soft)" /></linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--energy-white)" stopOpacity=".74" /><stop offset=".26" stopColor="var(--energy-white)" stopOpacity=".09" /><stop offset=".7" stopColor="var(--energy-white)" stopOpacity=".05" /><stop offset="1" stopColor="var(--energy-white)" stopOpacity=".46" /></linearGradient>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--energy-white)" /><stop offset="1" stopColor="var(--energy-slate-light)" /></linearGradient>
        <linearGradient id={`${id}-copper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--energy-warm-light)" /><stop offset="1" stopColor="var(--energy-orange)" /></linearGradient>
        <radialGradient id={`${id}-sun`}><stop stopColor="var(--energy-warm-light)" stopOpacity=".45" /><stop offset="1" stopColor="var(--energy-warm-light)" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="var(--energy-night)" stopOpacity=".14" /><stop offset="1" stopColor="var(--energy-night)" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="389" cy="230" r="230" fill={fill('sun')} data-energy-part="sun-glow" />
      <ellipse cx="390" cy="454" rx="278" ry="73" fill={fill('shadow')} />
      <g className="energy-lab__construction" fill="none" stroke="var(--energy-slate-light)" strokeWidth=".8" opacity=".38">
        <ellipse cx="390" cy="420" rx="280" ry="92" /><ellipse cx="390" cy="420" rx="215" ry="70" />
        <path d="M40 420H740M390 80V540M128 507L665 332M130 334L664 506" />
      </g>
      <g data-energy-part="solar-panel" className="energy-solar-panel">
        <g data-energy-part="backplate"><g transform="matrix(.92 -.28 .5 .67 110 231)">
          <path d="M0 0H380V250H0Z" fill="var(--energy-night-soft)" stroke="var(--energy-slate-mist)" strokeWidth="2" />
          <path d="M0 250H380V262H0Z" fill="var(--energy-night)" /><path d="M380 0V250L392 250V0Z" fill="var(--energy-slate)" />
          {[65, 135, 205].map((y) => <path key={y} d={`M12 ${y}H368`} stroke="var(--energy-slate)" strokeWidth="5" />)}
        </g></g>
        <g data-energy-part="cells"><g transform="matrix(.92 -.28 .5 .67 110 218)">
          <rect width="380" height="250" rx="2" fill={fill('metal')} />
          {Array.from({ length: 60 }, (_, index) => {
            const x = 8 + (index % 6) * 61;
            const y = 7 + Math.floor(index / 6) * 23.6;
            return <g key={index}><rect x={x} y={y} width="58" height="21" rx="2" fill={fill('cell')} stroke="var(--energy-slate)" strokeWidth=".55" /><path d={`M${x + 14} ${y}V${y + 21}M${x + 29} ${y}V${y + 21}M${x + 44} ${y}V${y + 21}`} stroke="var(--energy-slate-mist)" strokeWidth=".55" opacity=".57" /></g>;
          })}
        </g></g>
        <g data-energy-part="glass"><g transform="matrix(.92 -.28 .5 .67 110 209)">
          <rect width="380" height="250" fill={fill('glass')} stroke="var(--energy-white)" strokeWidth="2" />
          <path d="M30 0L247 250M89 0L306 250" stroke="var(--energy-white)" strokeWidth="15" opacity=".14" />
          <path d="M0 0H380V250" fill="none" stroke="var(--energy-white)" strokeWidth="2.5" opacity=".85" />
        </g></g>
      </g>
      <g data-energy-part="sun-rays" fill="none" stroke="var(--energy-orange)" strokeWidth="2" strokeLinecap="round">
        <path d="M362 30L326 130" /><path d="M422 55L384 164" /><path d="M482 81L444 192" />
        <circle cx="355" cy="50" r="4" fill="var(--energy-warm-light)" stroke="none" /><circle cx="414" cy="76" r="4" fill="var(--energy-warm-light)" stroke="none" /><circle cx="474" cy="101" r="4" fill="var(--energy-warm-light)" stroke="none" />
      </g>
      <g data-energy-part="inverter" transform="translate(433 240)">
        <path d="M0 0L27-17L132-1L105 16Z" fill="var(--energy-white)" stroke="var(--energy-slate-mist)" strokeWidth="1" />
        <path d="M105 16L132-1V156L105 173Z" fill="var(--energy-slate-light)" />
        <path d="M0 0L105 16V173L0 157Z" fill={fill('white')} stroke="var(--energy-slate-mist)" strokeWidth="1" />
        <path d="M14 22L91 34V114L14 102Z" fill="var(--energy-night)" /><path d="M18 28L87 39V106L18 95Z" fill="var(--energy-night-soft)" />
        <path d="M33 66C41 42 52 88 62 65S78 44 80 64" fill="none" stroke="var(--energy-warm-light)" strokeWidth="2.7" strokeLinecap="round" />
        <circle cx="25" cy="134" r="3" fill="var(--energy-orange)" /><path d="M37 136L80 143" stroke="var(--energy-slate-light)" strokeWidth="2" /><path d="M37 143L69 148" stroke="var(--energy-slate-light)" strokeWidth="2" />
        <path d="M23 161V176M86 170V185" stroke="var(--energy-night-soft)" strokeWidth="5" />
      </g>
      <g data-energy-part="home" transform="translate(614 342)">
        <path d="M0 41L56 8L120 51L65 83Z" fill="var(--energy-night)" stroke="var(--energy-slate)" /><path d="M65 83L120 51V123L65 155Z" fill="var(--energy-slate-light)" /><path d="M0 41L65 83V155L0 113Z" fill="var(--energy-ivory)" />
        <path d="M15 65L40 81V105L15 90Z" fill="var(--energy-warm-light)" /><path d="M79 87L104 72V97L79 113Z" fill="var(--energy-warm-light)" /><path d="M47 112L60 120V151L47 143Z" fill="var(--energy-night-soft)" />
      </g>
      <g data-energy-part="battery" transform="translate(348 399)">
        <path d="M0 0L24-14L115 1L91 15Z" fill="var(--energy-slate-light)" /><path d="M91 15L115 1V115L91 130Z" fill="var(--energy-slate-mist)" /><path d="M0 0L91 15V130L0 114Z" fill={fill('white')} stroke="var(--energy-slate-mist)" />
        {[23, 55, 87].map((y) => <g key={y}><path d={`M5 ${y}L86 ${y + 13}`} stroke="var(--energy-slate-light)" strokeWidth="1" /><circle cx="13" cy={y + 15} r="2.5" fill="var(--energy-orange)" /></g>)}
        <path d="M37 28L49 30V41L57 43L43 65L43 53L34 51Z" fill="var(--energy-orange)" />
      </g>
      <g data-energy-part="conversion-flow" fill="none" stroke="var(--energy-orange)" strokeWidth="2.5" strokeLinecap="round"><path data-energy-line d="M313 265H390Q418 265 433 286" pathLength="1" /><circle cx="313" cy="265" r="4" fill="var(--energy-orange)" stroke="none" /></g>
      <g data-energy-part="storage-flow" fill="none" stroke="var(--energy-orange)" strokeWidth="2.5" strokeLinecap="round"><path data-energy-line d="M486 425V463H463M537 356H586Q600 356 614 383" pathLength="1" /><circle cx="614" cy="383" r="4" fill="var(--energy-orange)" stroke="none" /></g>
      <g className="energy-lab__annotations" fill="var(--energy-slate-ink)" fontSize="15" fontWeight="500">
        <g data-energy-annotation="0"><path d="M505 131H646" stroke="var(--energy-slate-mist)" fill="none" /><circle cx="505" cy="131" r="3" fill="var(--energy-orange)" /><text x="554" y="119">{labels.glass}</text><path d="M549 231H693" stroke="var(--energy-slate-mist)" fill="none" /><text x="592" y="219">{labels.cells}</text><path d="M248 378V425H128" stroke="var(--energy-slate-mist)" fill="none" /><text x="128" y="450">{labels.frame}</text></g>
        <g data-energy-annotation="1"><path d="M541 281H681" stroke="var(--energy-slate-mist)" fill="none" /><text x="566" y="269">{labels.inverter}</text><text x="322" y="296" fill="var(--energy-orange-dark)">DC</text><text x="567" y="346" fill="var(--energy-orange-dark)">AC</text></g>
        <g data-energy-annotation="2"><text x="327" y="564">{labels.battery}</text><text x="630" y="530">{labels.home}</text></g>
      </g>
    </svg>
  );
};
