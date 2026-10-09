import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import path from 'path';

export default defineConfig({
  plugins: [react(), {
    name: 'prerendered-route-preview',
    configurePreviewServer(server) {
      const outputDirectory = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname !== '/' && !path.extname(url.pathname)) {
          const routeFile = path.resolve(outputDirectory, `.${url.pathname}`, 'index.html');
          if (routeFile.startsWith(`${outputDirectory}${path.sep}`) && existsSync(routeFile)) {
            request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
          }
        }
        next();
      });
    },
  }],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
