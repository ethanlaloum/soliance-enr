import { Outlet } from 'react-router';
import { useScrollOnNavigation } from '@/hooks/useScrollOnNavigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const SiteLayout = () => {
  useScrollOnNavigation();

  return (
    <div className="flex min-h-screen flex-col bg-ivory font-sans text-night">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
