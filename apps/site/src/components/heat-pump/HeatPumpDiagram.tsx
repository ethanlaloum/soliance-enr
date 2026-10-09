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
          <stop stopColor="#69777c" /><stop offset="0.46" stopColor="#424e55" /><stop offset="1" stopColor="#26363d" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="365" y1="185" x2="650" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8c0bd" /><stop offset="1" stopColor="#738382" />
        </linearGradient>
        <linearGradient id={`${id}-coil`} x1="478" y1="225" x2="570" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b5ddd0" /><stop offset="1" stopColor="#497c71" />
        </linearGradient>
        <linearGradient id={`${id}-copper`} x1="640" y1="268" x2="663" y2="375" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe0b0" /><stop offset="0.5" stopColor="#bc7849" /><stop offset="1" stopColor="#f2b77f" />
        </linearGradient>
        <radialGradient id={`${id}-floor`}><stop stopColor="#123d32" stopOpacity="0.16" /><stop offset="1" stopColor="#123d32" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-warm`}><stop stopColor="#e6a46a" stopOpacity="0.35" /><stop offset="1" stopColor="#e6a46a" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse data-heat-shadow cx="516" cy="492" rx="255" ry="64" fill={`url(#${id}-floor)`} />
      <g data-heat-base>
        <path d="m310 448 54-32h340l-54 39H310Z" fill="#778d86" stroke="#536e65" />
        <path d="M332 451v26h34v-27m249 0v26h34v-29" fill="#2e4540" />
        <path d="M315 224h336v222H315z" fill="#203c36" stroke="#55756b" strokeWidth="1.5" />
        <path d="m651 224 54-38v230l-54 31V224Z" fill="#29463f" stroke="#55756b" />
      </g>
      <g data-heat-evaporator>
        <path d="m468 244 24-15h88l-23 16v166l-89 1V244Z" fill={`url(#${id}-coil)`} stroke="#497b6c" strokeWidth="1.5" />
        <path d="m558 245 23-16v166l-23 16V245Z" fill="#315a50" />
        {Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${472 + i * 4.5} 246v159`} stroke="#d0e7dd" strokeWidth="1" opacity="0.65" />)}
        {[263, 295, 327, 359, 391].map(y => <path key={y} d={`M471 ${y}h84`} stroke="#497b6c" strokeWidth="3" />)}
        <path d="M486 248v-12h43v10M486 404v11h44v-12" stroke="#91b9a8" strokeWidth="5" />
      </g>
      <g data-heat-compressor>
        <path d="M563 338v74c0 13 52 13 52 0v-74" fill="#324d48" stroke="#102f27" strokeWidth="2" />
        <ellipse cx="589" cy="338" rx="26" ry="10" fill="#74998b" stroke="#193d30" strokeWidth="2" />
        <path d="M574 352v51M582 352v55" stroke="#a6cabc" opacity="0.4" />
        <path d="M589 331v-14h31v-27" stroke="#c88e57" strokeWidth="7" />
        <path d="M590 411v14h-34v-11" stroke="#87b7a5" strokeWidth="6" />
        <path d="M608 356h12v27h-12" fill="#14392d" />
        <circle data-heat-compressor-light cx="615" cy="365" r="3" fill="#dceec5" />
      </g>
      <g data-heat-condenser>
        <path d="m631 264 19-12h30v113l-19 13h-30V264Z" fill="#ad9c80" stroke="#7b7f65" />
        <path d="m661 264 19-12v113l-19 13V264Z" fill="#697f6d" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${635 + i * 2.8} 267v104`} stroke="#e3d8bb" opacity="0.85" />)}
        <path d="M648 256v-16h42v22m-42 115v19h42v-13" stroke={`url(#${id}-copper)`} strokeWidth="7" />
        <path d="M632 273h27m-27 37h27m-27 38h27" stroke="#c89e76" strokeWidth="3" />
      </g>
      <g data-heat-shell-top>
        <path d="m309 226 55-40h341l-55 40H309Z" fill={`url(#${id}-top)`} stroke="#a1aeaa" />
        <path d="m326 218 41-25h312l-41 25H326Z" stroke="#d2d8d2" opacity="0.3" />
      </g>
      <g data-heat-shell-side>
        <path d="m650 226 55-40v230l-55 40V226Z" fill="#344e4b" stroke="#65817a" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`m662 ${242 + i * 13} 32-22v7l-32 22v-7Z`} fill="#172f2b" stroke="#527269" strokeWidth="0.6" />)}
      </g>
      <g data-heat-shell-front>
        <rect x="310" y="225" width="340" height="232" rx="3" fill={`url(#${id}-metal)`} stroke="#a3b2ab" strokeWidth="1.4" />
        <path d="M554 226v229" stroke="#202f32" />
        <path d="M314 230h332" stroke="#c5cec5" opacity="0.25" />
        {[[323, 238], [639, 238], [323, 444], [639, 444]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" fill="#9caaa2" />)}
      </g>
      <g data-heat-fan>
        <circle cx="424" cy="339" r="93" fill="#142927" stroke="#84958a" strokeWidth="2" />
        <g data-heat-fan-blades>
          {Array.from({ length: 7 }, (_, i) => <path key={i} d="M424 339c-36-19-57-58-39-75 15-14 27 19 32 50 2 12 4 20 7 25Z" transform={`rotate(${i * 360 / 7} 424 339)`} fill="#536d62" stroke="#809486" strokeWidth="0.7" />)}
        </g>
        {[25, 42, 59, 76, 87].map(r => <circle key={r} cx="424" cy="339" r={r} stroke="#98ab9a" strokeWidth="0.65" opacity="0.65" />)}
        {Array.from({ length: 28 }, (_, i) => <path key={i} d="M424 249v180" transform={`rotate(${i * 180 / 28} 424 339)`} stroke="#9baba0" strokeWidth="0.45" opacity="0.45" />)}
        <circle cx="424" cy="339" r="18" fill="#718578" stroke="#a5b3a4" />
        <circle cx="424" cy="339" r="5" fill="#3a5448" />
      </g>
      <g data-heat-air stroke="#4d9e8b" strokeWidth="2" strokeLinecap="round">
        {[0, 28, 56].map((v, i) => <path key={i} data-heat-air-stream d={`M75 ${287 + v}h75c28 0 29 ${i === 1 ? 0 : i === 0 ? 16 : -16} 62 ${i === 1 ? 0 : i === 0 ? 16 : -16}h44`} />)}
        <path d="m249 305 8-2-6-6m-3 42 9-8-9-3m0 33 9-4-6-5" />
      </g>
      <g data-heat-cycle strokeLinecap="round" strokeLinejoin="round">
        <path data-heat-cold-route d="M520 277v186h171v-40" stroke="#629d8c" strokeWidth="4" />
        <path data-heat-warm-route d="M691 411V214h96v71" stroke="#d18e53" strokeWidth="4" />
        <path data-heat-return-route d="M820 368v149H490V274" stroke="#94b4a3" strokeWidth="3" />
        <path data-heat-expansion-valve d="m480 390 10 12 10-12v24l-10-12-10 12v-24Z" fill="#d7dfcd" stroke="#7ca48b" strokeWidth="1.5" />
        <circle data-heat-energy-particle cx="0" cy="0" r="6" fill="#e3a063" opacity="0" />
      </g>
      <g data-heat-house>
        <ellipse cx="827" cy="318" rx="110" ry="112" fill={`url(#${id}-warm)`} />
        <path d="m764 299 63-49 65 49v92H764v-92Z" fill="#eee8d8" stroke="#acb8a1" strokeWidth="1.5" />
        <path d="m751 303 76-59 78 59" stroke="#7d957e" strokeWidth="3" strokeLinecap="round" />
        <rect x="811" y="335" width="33" height="56" fill="#d8cbb1" stroke="#99ab90" />
        <rect x="774" y="313" width="23" height="28" fill="#b2c9b4" stroke="#96aa91" />
        <rect x="857" y="313" width="23" height="28" fill="#b2c9b4" stroke="#96aa91" />
        <path d="M827 269v32m-12-18 12 18 12-18" stroke="#e0a76b" strokeWidth="2.5" />
        <g data-heat-house-warm stroke="#d99557" strokeWidth="2.5" strokeLinecap="round">
          <path d="M774 368h20m-20 9h20m64-9h23m-23 9h23" />
          <path d="M772 355c-6-9 7-10 0-19m13 19c-6-9 7-10 0-19m78 19c-6-9 7-10 0-19m13 19c-6-9 7-10 0-19" />
        </g>
      </g>
      <g data-heat-part-labels className="heat-explainer__part-labels">
        <path d="M318 463v50h-57m264-258V99h-37m170 408v33h-43m173-256v-82h25" stroke="#94a38d" strokeWidth="1" />
        <circle cx="318" cy="463" r="3" fill="#94a38d" /><circle cx="525" cy="255" r="3" fill="#94a38d" />
        <circle cx="658" cy="507" r="3" fill="#c69464" /><circle cx="789" cy="284" r="3" fill="#c69464" />
        <text x="247" y="521" textAnchor="end" fill="#668169" fontSize="14" stroke="none">{t('explainer.parts.fan')}</text>
        <text x="473" y="102" textAnchor="end" fill="#668169" fontSize="14" stroke="none">{t('explainer.parts.evaporator')}</text>
        <text x="603" y="545" textAnchor="end" fill="#aa7c53" fontSize="14" stroke="none">{t('explainer.parts.compressor')}</text>
        <text x="820" y="202" fill="#aa7c53" fontSize="14" stroke="none">{t('explainer.parts.condenser')}</text>
      </g>
    </svg>
  );
};
