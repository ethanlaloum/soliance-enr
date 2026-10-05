import { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModuleGrid = { cols: number; rows: number };

type ModuleIntro = 'css' | 'scroll' | 'none';

type ModuleImageProps = {
  grid: ModuleGrid;
  desktopGrid?: ModuleGrid;
  intro?: ModuleIntro;
  parallax?: boolean;
  className?: string;
  children: ReactNode;
};

const installationDelay = (index: number, { cols, rows }: ModuleGrid) => {
  const column = index % cols;
  const rowFromEave = rows - 1 - Math.floor(index / cols);
  const farthest = Math.hypot(cols - 1, rows - 1) || 1;
  return (Math.hypot(column, rowFromEave) / farthest).toFixed(3);
};

export const ModuleImage = ({ grid, desktopGrid = grid, intro = 'none', parallax = false, className, children }: ModuleImageProps) => {
  const mobileCount = grid.cols * grid.rows;
  const desktopCount = desktopGrid.cols * desktopGrid.rows;
  const cellCount = Math.max(mobileCount, desktopCount);
  const hasCovers = intro !== 'none';

  return (
    <div
      data-module-image
      data-intro={intro}
      data-cols={grid.cols}
      data-rows={grid.rows}
      data-cols-lg={desktopGrid.cols}
      data-rows-lg={desktopGrid.rows}
      data-module-parallax={parallax ? '' : undefined}
      className={cn('mod-image relative overflow-hidden', className)}
      style={{ '--mod-cols': grid.cols, '--mod-rows': grid.rows, '--mod-cols-lg': desktopGrid.cols, '--mod-rows-lg': desktopGrid.rows } as CSSProperties}
    >
      <div data-module-media className={parallax ? 'absolute inset-x-0 -top-[8%] h-[116%]' : 'absolute inset-0'}>
        {children}
      </div>
      <div aria-hidden="true" className="mod-array">
        {Array.from({ length: cellCount }, (_, index) => (
          <span
            key={index}
            className={cn('mod-cell', index >= mobileCount && 'max-lg:hidden', index >= desktopCount && 'lg:hidden')}
            style={hasCovers ? ({ '--d': installationDelay(index, grid), '--d-lg': installationDelay(index, desktopGrid) } as CSSProperties) : undefined}
          >
            {hasCovers && <span data-module-cover className="mod-cover" />}
          </span>
        ))}
      </div>
    </div>
  );
};
