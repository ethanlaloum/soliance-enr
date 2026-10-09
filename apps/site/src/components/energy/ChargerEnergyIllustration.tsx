import { useId } from 'react';

type Props = { labels: Record<string, string> };

export const ChargerEnergyIllustration = ({ labels }: Props) => {
  const id = useId().replaceAll(':', '');
  const fill = (name: string) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 800 600" className="energy-lab__diagram" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#566669" /><stop offset=".45" stopColor="#21383b" /><stop offset="1" stopColor="#0a2024" /></linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7e3dc" /><stop offset="1" stopColor="#75958a" /></linearGradient>
        <linearGradient id={`${id}-board`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#557f65" /><stop offset="1" stopColor="#1b4939" /></linearGradient>
        <linearGradient id={`${id}-car`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#edf0e9" /><stop offset=".54" stopColor="#b2c2ba" /><stop offset="1" stopColor="#7d998e" /></linearGradient>
        <radialGradient id={`${id}-halo`}><stop stopColor="#a6c9ae" stopOpacity=".5" /><stop offset="1" stopColor="#a6c9ae" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="#0b181b" stopOpacity=".18" /><stop offset="1" stopColor="#0b181b" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="395" cy="273" r="235" fill={fill('halo')} data-energy-part="charge-glow" />
      <ellipse cx="405" cy="456" rx="272" ry="68" fill={fill('shadow')} />
      <g className="energy-lab__construction" fill="none" stroke="#acb9b0" strokeWidth=".8" opacity=".38"><ellipse cx="395" cy="420" rx="278" ry="92" /><ellipse cx="395" cy="420" rx="215" ry="72" /><path d="M50 420H740M395 70V540M120 504L666 333M124 333L665 504" /></g>
      <g data-energy-part="wallbox" className="energy-wallbox">
        <g data-energy-part="charger-backplate"><g transform="translate(307 112)"><path d="M0 35Q0 6 27 4L133 24Q156 28 156 55V267Q156 298 128 297L27 277Q0 272 0 243Z" fill={fill('metal')} stroke="#7c9a8d" /><path d="M27 277L156 299L171 286V51L155 35" fill="#567c69" /><path d="M19 38L132 60V257L19 235Z" fill="#496659" /><circle cx="26" cy="34" r="4" fill="#eff3e9" /><circle cx="129" cy="55" r="4" fill="#eff3e9" /><circle cx="26" cy="246" r="4" fill="#eff3e9" /><circle cx="129" cy="268" r="4" fill="#eff3e9" /></g></g>
        <g data-energy-part="charger-board"><g transform="translate(306 107)">
          <path d="M16 34L144 58V253L16 229Z" fill={fill('board')} stroke="#b4c5a9" />
          <path d="M31 45V112H61V179H122M123 72V130H92V225M41 226V202H74V124H104V75M32 59H88V99H125" fill="none" stroke="#b5bd8c" strokeWidth="1.4" opacity=".8" />
          <path d="M50 85L105 95V147L50 136Z" fill="#142c2b" stroke="#839582" /><path d="M60 98L93 104V132L60 126Z" fill="#4f675c" />
          {[34, 114].map((x) => <g key={x}><path d={`M${x} 156L${x + 18} 159V184L${x} 181Z`} fill="#c2c7ba" /><path d={`M${x + 4} 160V180M${x + 10} 162V182`} stroke="#576f61" strokeWidth="3" /></g>)}
          <circle cx="41" cy="70" r="3" fill="#d4bd7e" /><circle cx="121" cy="207" r="3" fill="#d4bd7e" />
        </g></g>
        <g data-energy-part="charger-cover"><g transform="translate(296 94)">
          <path d="M0 35Q0 6 28 5L140 27Q169 33 169 62V276Q169 303 141 300L28 278Q0 272 0 243Z" fill={fill('shell')} stroke="#718a87" strokeWidth="1.4" />
          <path d="M19 47Q19 27 37 28L131 47Q149 51 149 69V243Q149 264 130 260L36 242Q19 239 19 218Z" fill="none" stroke="#a5ccbb" strokeWidth="3" />
          <path d="M20 48Q21 27 40 30L133 49" fill="none" stroke="#e1f6e6" strokeWidth="2" opacity=".7" />
          <path d="M72 97L85 100V121L96 123L77 153V132L66 129Z" fill="#b5d7bb" />
          <ellipse cx="82" cy="203" rx="25" ry="29" transform="rotate(-10 82 203)" fill="#07181c" stroke="#607d78" strokeWidth="2" />
          <ellipse cx="82" cy="203" rx="17" ry="20" transform="rotate(-10 82 203)" fill="#27413e" />
          {[[-7, -8], [7, -5], [-9, 6], [5, 9]].map(([x, y], index) => <circle key={index} cx={82 + x} cy={203 + y} r="2.8" fill="#c7bc91" />)}
          <path d="M31 25L144 47" stroke="#b6cac3" strokeWidth="1" opacity=".6" />
        </g></g>
        <g data-energy-part="charger-cable"><path d="M377 369V415Q377 460 432 470T506 435V316" fill="none" stroke="#183532" strokeWidth="12" strokeLinecap="round" /><path d="M378 371V415Q379 454 432 466T502 435V316" fill="none" stroke="#5d7b6c" strokeWidth="3" opacity=".5" /><g transform="translate(491 283)"><path d="M0 4L16 0L28 12V44L17 52L0 44Z" fill="#1a3834" stroke="#5e8372" /><path d="M3 4V-12L18-16L26-5V10Z" fill="#839d88" /><path d="M6-8L18-12L22-4" fill="none" stroke="#d3dcc7" strokeWidth="2" /></g></g>
      </g>
      <g data-energy-part="solar-source" transform="translate(65 118)">
        <circle cx="67" cy="0" r="18" fill="none" stroke="#d3a570" strokeWidth="2" /><g stroke="#d3a570" strokeWidth="1.5">{Array.from({ length: 8 }, (_, index) => <path key={index} d="M67-31V-26" transform={`rotate(${index * 45} 67 0)`} />)}</g>
        <path d="M0 74L119 43L177 113L58 145Z" fill="#233e40" stroke="#738e7c" /><path d="M0 74V81L58 152V145M58 152L177 121V113" fill="#71867c" />
        <path d="M30 66L88 137M60 59L118 129M90 51L148 121M14 91L133 60M30 112L150 81M44 131L166 101" fill="none" stroke="#9cac8d" strokeWidth=".9" />
      </g>
      <g data-energy-part="charge-meter" transform="translate(61 328)">
        <path d="M0 0L19-12L104 4L85 16Z" fill="#dce6db" /><path d="M85 16L104 4V116L85 128Z" fill="#a6bcac" /><path d="M0 0L85 16V128L0 112Z" fill="#e4eadf" stroke="#9db19e" />
        <path d="M13 24L70 35V67L13 56Z" fill="#466554" /><path d="M23 43L34 45V37L45 39V49L59 52" fill="none" stroke="#b5d3a0" strokeWidth="2" />
        <path d="M15 87L64 96M15 94L64 103" stroke="#b5c2af" strokeWidth="2" /><circle cx="68" cy="111" r="3" fill="#799e78" />
      </g>
      <g data-energy-part="vehicle" transform="translate(468 348)">
        <path d="M0 31L41 0L197 24L273 74L252 109L72 90L0 59Z" fill={fill('car')} stroke="#8da598" strokeWidth="1" />
        <path d="M51 1L82-41L165-29L207 26Z" fill="#cbd7ce" stroke="#8da598" /><path d="M85-34L162-23L195 21L53 2Z" fill="#1f3b3c" /><path d="M131-28L154 13" stroke="#9fb7ab" strokeWidth="3" />
        <path d="M0 31L72 63L273 74L252 109L72 90L0 59Z" fill="#afc3b4" /><path d="M74 69L248 86" stroke="#6e8b7b" strokeWidth="1" /><path d="M21 39L59 55M227 56L261 73" stroke="#f2edca" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="80" cy="88" rx="21" ry="30" transform="rotate(-13 80 88)" fill="#203936" /><ellipse cx="80" cy="88" rx="12" ry="19" transform="rotate(-13 80 88)" fill="#789686" /><ellipse cx="235" cy="106" rx="20" ry="29" transform="rotate(-13 235 106)" fill="#203936" /><ellipse cx="235" cy="106" rx="11" ry="18" transform="rotate(-13 235 106)" fill="#789686" />
        <path d="M105 66L191 77V86L105 75Z" fill="#83ad7b" data-energy-part="vehicle-battery" /><path d="M110 71L181 80" stroke="#d3e2b0" strokeWidth="2" />
      </g>
      <g data-energy-part="charge-flow" fill="none" stroke="#83a382" strokeWidth="2.5" strokeLinecap="round"><path data-energy-line d="M242 236H270Q288 236 295 259M167 376H231Q254 376 283 347" pathLength="1" /><circle cx="242" cy="236" r="4" fill="#83a382" stroke="none" /></g>
      <g data-energy-part="vehicle-flow" fill="none" stroke="#83a382" strokeWidth="2.5" strokeLinecap="round"><path data-energy-line d="M368 367V467Q368 510 431 510H513Q540 510 548 448" pathLength="1" /><circle cx="548" cy="448" r="4" fill="#83a382" stroke="none" /></g>
      <g className="energy-lab__annotations" fill="#51615b" fontSize="15" fontWeight="500">
        <g data-energy-annotation="0"><path d="M557 118H754M486 252H754M590 391H754" stroke="#a0aba2" fill="none" /><text x="612" y="104">{labels.shell}</text><text x="612" y="240">{labels.electronics}</text><text x="612" y="378">{labels.connector}</text></g>
        <g data-energy-annotation="1"><text x="68" y="294">{labels.solar}</text><text x="38" y="482">{labels.meter}</text></g>
        <g data-energy-annotation="2"><text x="573" y="533">{labels.vehicle}</text></g>
      </g>
    </svg>
  );
};
