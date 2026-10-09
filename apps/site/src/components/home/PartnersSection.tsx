import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

const logoHeight = 96;

const partners = [
  { name: 'SolaX Power', src: '/images/partners/solax.webp', width: 358, scale: 1 },
  { name: 'Francilienne Energy', src: '/images/partners/francilienne.webp', width: 402, scale: 1 },
  { name: 'K2 Systems', src: '/images/partners/k2-systems.svg', width: 96, scale: 1.2 },
  { name: 'Daikin', src: '/images/partners/daikin.svg', width: 457, scale: 0.85 },
  { name: 'Sofinco', src: '/images/partners/sofinco.svg', width: 434, scale: 0.75 },
  { name: 'MMA', src: '/images/partners/mma.svg', width: 326, scale: 0.9 },
  { name: 'BPCE Lease', src: '/images/partners/bpce-lease.webp', width: 309, scale: 1 },
  { name: 'RI2E', src: '/images/partners/ri2e.webp', width: 345, scale: 1.25 },
  { name: 'Synexium', src: '/images/partners/synexium.webp', width: 553, scale: 1 },
] as const;

const logoScale = (scale: number): CSSProperties => ({ '--logo-scale': scale }) as CSSProperties;

type PartnerListProps = {
  label?: string;
  duplicate?: boolean;
};

const PartnerList = ({ label, duplicate = false }: PartnerListProps) => (
  <ul
    aria-label={label}
    aria-hidden={duplicate || undefined}
    className={cn(
      'flex shrink-0 items-center gap-10 pr-10 lg:gap-14 lg:pr-14',
      duplicate ? 'motion-reduce:hidden' : 'motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:gap-y-6 motion-reduce:pr-0',
    )}
  >
    {partners.map((partner) => (
      <li key={partner.name} className="shrink-0">
        <img
          src={partner.src}
          alt={duplicate ? '' : partner.name}
          width={partner.width}
          height={logoHeight}
          loading="lazy"
          style={logoScale(partner.scale)}
          className="h-[calc(28px*var(--logo-scale))] w-auto max-w-none transition duration-300 ease-out group-hover/marquee:opacity-40 hover:!opacity-100 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-[0_6px_10px_rgba(11,17,32,0.14)] motion-reduce:transform-none motion-reduce:transition-none lg:h-[calc(36px*var(--logo-scale))]"
        />
      </li>
    ))}
  </ul>
);

export const PartnersSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="partners-title" className="border-b border-sand-line bg-white">
      <div data-reveal className={cn(containerClassName, 'flex flex-col items-start gap-2 py-6 lg:flex-row lg:items-center lg:gap-7 lg:py-8')}>
        <h2 id="partners-title" className="shrink-0 text-sm font-semibold uppercase tracking-[1px] text-slate">
          {t('partners.title')}
        </h2>
        <div className="w-full min-w-0 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none] lg:flex-1">
          <div className="group/marquee flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
            <PartnerList label={t('partners.listLabel')} />
            <PartnerList duplicate />
          </div>
        </div>
      </div>
    </section>
  );
};
