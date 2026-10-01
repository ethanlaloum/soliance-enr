import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';

type BreadcrumbItem = { label: string; to?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  tone?: 'dark' | 'light';
  className?: string;
};

export const Breadcrumb = ({ items, tone = 'dark', className }: BreadcrumbProps) => {
  const { t } = useTranslation('common');
  const trail: BreadcrumbItem[] = [{ label: t('breadcrumb.home'), to: paths.home }, ...items];
  const linkClassName = tone === 'dark' ? 'text-slate-light hover:text-white' : 'text-slate-ink hover:text-night';
  const currentClassName = tone === 'dark' ? 'text-white' : 'text-night';

  return (
    <nav aria-label={t('breadcrumb.label')} className={cn('text-[13px] font-medium lg:text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {isLast || !item.to ? (
                  <span aria-current={isLast ? 'page' : undefined} data-breadcrumb-name className={currentClassName}>
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} data-breadcrumb-name data-breadcrumb-path={item.to} className={linkClassName}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-slate">
                  ›
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
