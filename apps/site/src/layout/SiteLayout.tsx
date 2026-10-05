import { Outlet, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useScrollOnNavigation } from '@/hooks/useScrollOnNavigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const SiteLayout = () => {
  const { pathname } = useLocation();
  useScrollOnNavigation();

  return (
    <div className={cn('site-shell flex min-h-screen flex-col bg-ivory font-sans text-night', pathname !== paths.home && 'horizon-site')}>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
