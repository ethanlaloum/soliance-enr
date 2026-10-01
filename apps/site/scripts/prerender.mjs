import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(appRoot, 'dist');
const ssrDir = join(appRoot, 'dist-ssr');
const notFoundFile = '404.html';
const siteUrl = 'https://soliance.fr';

const { render, prerenderRoutes: routes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const template = await readFile(join(distDir, 'index.html'), 'utf8');

const renderPage = async (url) => {
  const { html, head } = await render(url);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
};

for (const route of routes) {
  const outputFile = route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, await renderPage(route));
  console.log(`prerendered ${route} -> ${outputFile.replace(`${appRoot}/`, '')}`);
}

const sitemapEntries = routes.map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`).join('\n');
await writeFile(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
);
console.log(`sitemap -> dist/sitemap.xml (${routes.length} urls)`);

await writeFile(join(distDir, notFoundFile), await renderPage('/page-introuvable'));
console.log(`prerendered 404 -> dist/${notFoundFile}`);

await rm(ssrDir, { recursive: true, force: true });
