import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import '@/lib/i18n/i18n';
import { buildHead } from '@/lib/seo/buildHead';
import { AppRoutes } from '@/routes/Routes';
import { buildRealDependencies } from '@/store/buildDependencies';
import { makeStore } from '@/store/makeStore';
import { paths, projectPath } from '@/routes/paths';
import { projectDetailSlugs } from '@/app/projects/domain/entities/ProjectDetail';

export const prerenderRoutes: string[] = [
  paths.home,
  paths.solar,
  paths.heatPump,
  paths.evCharger,
  paths.professionals,
  paths.simulator,
  paths.referral,
  paths.projects,
  paths.resources,
  paths.care,
  ...projectDetailSlugs.map(projectPath),
];

export const render = async (url: string): Promise<{ html: string; head: string }> => {
  const store = makeStore(buildRealDependencies());
  const { prelude } = await prerender(
    <StrictMode>
      <Provider store={store}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </Provider>
    </StrictMode>,
  );

  const html = await new Response(prelude).text();
  return { html, head: buildHead(url, html) };
};
