import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { ChatIcon, PinIcon, ShieldIcon, ToolsIcon } from '@/components/care/CareIcons';
import { careBodyClassName, careEyebrowClassName, careTitleClassName } from '@/components/care/careStyles';

type Point = { title: string; body: string };

const pointIcons = [PinIcon, ShieldIcon, ToolsIcon, ChatIcon];

export const CareTeamSection = () => {
  const { t } = useTranslation('care');
  const points = t('team.points', { returnObjects: true }) as Point[];

  return (
    <section aria-labelledby="care-team-title" className="bg-white">
      <div className={cn(containerClassName, 'grid items-center gap-8 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-[88px] desktop:px-20')}>
        <img
          data-reveal
          src="/images/team-showroom.webp"
          alt={t('team.imageAlt')}
          width={1200}
          height={547}
          loading="lazy"
          className="block h-[220px] w-full rounded-2xl object-cover sm:h-[300px] lg:h-[420px] lg:rounded-[20px]"
        />
        <div className="flex flex-col gap-4 lg:gap-5">
          <div data-reveal className="flex flex-col gap-4">
            <p className={careEyebrowClassName}>{t('team.eyebrow')}</p>
            <h2 id="care-team-title" className={cn(careTitleClassName, 'lg:text-[38px]')}>
              {t('team.title')}
            </h2>
            <p className={careBodyClassName}>{t('team.body')}</p>
          </div>
          <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {points.map((point, index) => {
              const Icon = pointIcons[index];
              return (
                <li key={point.title} data-reveal style={revealDelay(index)} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-care-surface text-care">{Icon && <Icon />}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base font-bold">{point.title}</span>
                    <span className="text-sm leading-normal text-care-muted">{point.body}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
