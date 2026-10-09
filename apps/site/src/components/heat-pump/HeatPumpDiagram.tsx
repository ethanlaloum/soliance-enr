import { useId } from 'react';
import { useTranslation } from 'react-i18next';

/** Schematic air-to-water heat pump, independent of any manufacturer's model. */
export const HeatPumpDiagram = () => {
  const id = useId().replace(/:/g, '');
  const { t } = useTranslation('heatPump');

  return (
    <svg className="heat-explainer__diagram" aria-hidden="true" viewBox="0 0 960 620" fill="none">
      <defs>
        <linearGradient id={`${id}-metal`} x1="310" y1="225" x2="650" y2="455" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--heat-muted)" /><stop offset="0.46" stopColor="var(--heat-text)" /><stop offset="1" stopColor="var(--heat-night-soft)" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="365" y1="185" x2="650" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--heat-light)" /><stop offset="1" stopColor="var(--heat-cold)" />
        </linearGradient>
        <linearGradient id={`${id}-coil`} x1="478" y1="225" x2="570" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--heat-light)" /><stop offset="1" stopColor="var(--heat-muted)" />
        </linearGradient>
        <linearGradient id={`${id}-copper`} x1="640" y1="268" x2="663" y2="375" gradientUnits="userSpaceOnUse">
          <stop stopColor="color-mix(in srgb, var(--heat-accent) 28%, var(--heat-canvas))" /><stop offset="0.5" stopColor="var(--heat-accent-dark)" /><stop offset="1" stopColor="color-mix(in srgb, var(--heat-accent) 58%, var(--heat-canvas))" />
        </linearGradient>
        <radialGradient id={`${id}-floor`}><stop stopColor="var(--heat-night)" stopOpacity="0.16" /><stop offset="1" stopColor="var(--heat-night)" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-warm`}><stop stopColor="var(--heat-accent)" stopOpacity="0.35" /><stop offset="1" stopColor="var(--heat-accent)" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse data-heat-shadow cx="516" cy="492" rx="255" ry="64" fill={`url(#${id}-floor)`} />
      <g data-heat-base>
        <path d="m310 448 54-32h340l-54 39H310Z" fill="var(--heat-cold)" stroke="var(--heat-muted)" />
        <path d="M332 451v26h34v-27m249 0v26h34v-29" fill="var(--heat-text)" />
        <path d="M315 224h336v222H315z" fill="var(--heat-night-soft)" stroke="var(--heat-muted)" strokeWidth="1.5" />
        <path d="m651 224 54-38v230l-54 31V224Z" fill="var(--heat-text)" stroke="var(--heat-muted)" />
      </g>
      <g data-heat-evaporator>
        <path d="m468 244 24-15h88l-23 16v166l-89 1V244Z" fill={`url(#${id}-coil)`} stroke="var(--heat-muted)" strokeWidth="1.5" />
        <path d="m558 245 23-16v166l-23 16V245Z" fill="var(--heat-text)" />
        {Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${472 + i * 4.5} 246v159`} stroke="var(--heat-light)" strokeWidth="1" opacity="0.65" />)}
        {[263, 295, 327, 359, 391].map(y => <path key={y} d={`M471 ${y}h84`} stroke="var(--heat-muted)" strokeWidth="3" />)}
        <path d="M486 248v-12h43v10M486 404v11h44v-12" stroke="var(--heat-light)" strokeWidth="5" />
      </g>
      <g data-heat-compressor>
        <path d="M563 338v74c0 13 52 13 52 0v-74" fill="var(--heat-text)" stroke="var(--heat-night)" strokeWidth="2" />
        <ellipse cx="589" cy="338" rx="26" ry="10" fill="var(--heat-cold)" stroke="var(--heat-night)" strokeWidth="2" />
        <path d="M574 352v51M582 352v55" stroke="var(--heat-light)" opacity="0.4" />
        <path d="M589 331v-14h31v-27" stroke="var(--heat-accent)" strokeWidth="7" />
        <path d="M590 411v14h-34v-11" stroke="var(--heat-cold)" strokeWidth="6" />
        <path d="M608 356h12v27h-12" fill="var(--heat-night)" />
        <circle data-heat-compressor-light cx="615" cy="365" r="3" fill="var(--heat-accent)" />
      </g>
      <g data-heat-condenser>
        <path d="m631 264 19-12h30v113l-19 13h-30V264Z" fill="color-mix(in srgb, var(--heat-accent) 58%, var(--heat-canvas))" stroke="var(--heat-muted)" />
        <path d="m661 264 19-12v113l-19 13V264Z" fill="var(--heat-cold)" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${635 + i * 2.8} 267v104`} stroke="var(--heat-canvas)" opacity="0.85" />)}
        <path d="M648 256v-16h42v22m-42 115v19h42v-13" stroke={`url(#${id}-copper)`} strokeWidth="7" />
        <path d="M632 273h27m-27 37h27m-27 38h27" stroke="var(--heat-accent)" strokeWidth="3" />
      </g>
      <g data-heat-shell-top>
        <path d="m309 226 55-40h341l-55 40H309Z" fill={`url(#${id}-top)`} stroke="var(--heat-light)" />
        <path d="m326 218 41-25h312l-41 25H326Z" stroke="var(--heat-light)" opacity="0.3" />
      </g>
      <g data-heat-shell-side>
        <path d="m650 226 55-40v230l-55 40V226Z" fill="var(--heat-text)" stroke="var(--heat-muted)" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`m662 ${242 + i * 13} 32-22v7l-32 22v-7Z`} fill="var(--heat-night-soft)" stroke="var(--heat-muted)" strokeWidth="0.6" />)}
      </g>
      <g data-heat-shell-front>
        <rect x="310" y="225" width="340" height="232" rx="3" fill={`url(#${id}-metal)`} stroke="var(--heat-light)" strokeWidth="1.4" />
        <path d="M554 226v229" stroke="var(--heat-night-soft)" />
        <path d="M314 230h332" stroke="var(--heat-light)" opacity="0.25" />
        {[[323, 238], [639, 238], [323, 444], [639, 444]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" fill="var(--heat-cold)" />)}
      </g>
      <g data-heat-fan>
        <circle cx="424" cy="339" r="93" fill="var(--heat-night-soft)" stroke="var(--heat-cold)" strokeWidth="2" />
        <g data-heat-fan-blades>
          {Array.from({ length: 7 }, (_, i) => <path key={i} d="M424 339c-36-19-57-58-39-75 15-14 27 19 32 50 2 12 4 20 7 25Z" transform={`rotate(${i * 360 / 7} 424 339)`} fill="var(--heat-muted)" stroke="var(--heat-muted)" strokeWidth="0.7" />)}
        </g>
        {[25, 42, 59, 76, 87].map(r => <circle key={r} cx="424" cy="339" r={r} stroke="var(--heat-cold)" strokeWidth="0.65" opacity="0.65" />)}
        {Array.from({ length: 28 }, (_, i) => <path key={i} d="M424 249v180" transform={`rotate(${i * 180 / 28} 424 339)`} stroke="var(--heat-cold)" strokeWidth="0.45" opacity="0.45" />)}
        <circle cx="424" cy="339" r="18" fill="var(--heat-cold)" stroke="var(--heat-light)" />
        <circle cx="424" cy="339" r="5" fill="var(--heat-text)" />
      </g>
      <g data-heat-air stroke="var(--heat-cold)" strokeWidth="2" strokeLinecap="round">
        {[0, 28, 56].map((v, i) => <path key={i} data-heat-air-stream d={`M75 ${287 + v}h75c28 0 29 ${i === 1 ? 0 : i === 0 ? 16 : -16} 62 ${i === 1 ? 0 : i === 0 ? 16 : -16}h44`} />)}
        <path d="m249 305 8-2-6-6m-3 42 9-8-9-3m0 33 9-4-6-5" />
      </g>
      <g data-heat-cycle strokeLinecap="round" strokeLinejoin="round">
        <path data-heat-cold-route d="M520 277v186h171v-40" stroke="var(--heat-cold)" strokeWidth="4" />
        <path data-heat-warm-route d="M691 411V214h96v71" stroke="var(--heat-accent)" strokeWidth="4" />
        <path data-heat-return-route d="M820 368v149H490V274" stroke="var(--heat-cold)" strokeWidth="3" />
        <path data-heat-expansion-valve d="m480 390 10 12 10-12v24l-10-12-10 12v-24Z" fill="var(--heat-light)" stroke="var(--heat-cold)" strokeWidth="1.5" />
        <circle data-heat-energy-particle cx="0" cy="0" r="6" fill="var(--heat-accent)" opacity="0" />
      </g>
      <g data-heat-house>
        <ellipse cx="827" cy="318" rx="110" ry="112" fill={`url(#${id}-warm)`} />
        <path d="m764 299 63-49 65 49v92H764v-92Z" fill="var(--heat-canvas)" stroke="var(--heat-cold)" strokeWidth="1.5" />
        <path d="m751 303 76-59 78 59" stroke="var(--heat-muted)" strokeWidth="3" strokeLinecap="round" />
        <rect x="811" y="335" width="33" height="56" fill="var(--heat-border)" stroke="var(--heat-muted)" />
        <rect x="774" y="313" width="23" height="28" fill="var(--heat-light)" stroke="var(--heat-muted)" />
        <rect x="857" y="313" width="23" height="28" fill="var(--heat-light)" stroke="var(--heat-muted)" />
        <path d="M827 269v32m-12-18 12 18 12-18" stroke="var(--heat-accent)" strokeWidth="2.5" />
        <g data-heat-house-warm stroke="var(--heat-accent)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M774 368h20m-20 9h20m64-9h23m-23 9h23" />
          <path d="M772 355c-6-9 7-10 0-19m13 19c-6-9 7-10 0-19m78 19c-6-9 7-10 0-19m13 19c-6-9 7-10 0-19" />
        </g>
      </g>
      <g data-heat-part-labels className="heat-explainer__part-labels">
        <path d="M318 463v50h-57m264-258V99h-37m170 408v33h-43m173-256v-82h25" stroke="var(--heat-cold)" strokeWidth="1" />
        <circle cx="318" cy="463" r="3" fill="var(--heat-cold)" /><circle cx="525" cy="255" r="3" fill="var(--heat-cold)" />
        <circle cx="658" cy="507" r="3" fill="var(--heat-accent)" /><circle cx="789" cy="284" r="3" fill="var(--heat-accent)" />
        <text x="247" y="521" textAnchor="end" fill="var(--heat-muted)" fontSize="14" stroke="none">{t('explainer.parts.fan')}</text>
        <text x="473" y="102" textAnchor="end" fill="var(--heat-muted)" fontSize="14" stroke="none">{t('explainer.parts.evaporator')}</text>
        <text x="603" y="545" textAnchor="end" fill="var(--heat-accent-dark)" fontSize="14" stroke="none">{t('explainer.parts.compressor')}</text>
        <text x="820" y="202" fill="var(--heat-accent-dark)" fontSize="14" stroke="none">{t('explainer.parts.condenser')}</text>
      </g>
    </svg>
  );
};
