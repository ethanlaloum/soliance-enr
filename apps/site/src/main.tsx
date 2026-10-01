import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import '@fontsource/bai-jamjuree/400.css';
import '@fontsource/bai-jamjuree/500.css';
import '@fontsource/bai-jamjuree/600.css';
import '@fontsource/bai-jamjuree/700.css';
import '@/index.css';
import '@/lib/i18n/i18n';
import { AppRoutes } from '@/routes/Routes';
import { buildRealDependencies } from '@/store/buildDependencies';
import { makeStore } from '@/store/makeStore';

const store = makeStore(buildRealDependencies());
const container = document.getElementById('root');

const app = (
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

if (container) {
  if (container.hasChildNodes() && container.firstElementChild) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
}
