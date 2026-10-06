# apps/site — soliance-site

## Stack

Vite 7 · React 19 · TypeScript strict · React Router 7 · Redux Toolkit 2 + redux-observable 3 + RxJS 7 · React Hook Form + zod 3 · Tailwind 3 · i18next (`fr`, `en-US`) · vitest 3. Versions are pinned to the majors of the jp-way frontend conventions on purpose; newer majors (Vite 8, React Router 8, Tailwind 4, zod 4, TS 7) were not adopted.

## Pages

Home, `/panneaux-solaires`, `/pompe-a-chaleur` (`heat` blue tokens), `/borne-de-recharge` (`charge` green tokens), `/professionnels`, `/simulateur`, `/parrainage`, `/realisations` and `/realisations/:slug` (10 fiches, slugs in `src/app/projects/domain/entities/ProjectDetail.ts`), `/ressources`, `/soliance-care` (`care` green tokens, rendered outside `SiteLayout` with its own `CareHeader` / `CareFooter`, see below). One page folder in `src/pages/`, its sections in `src/components/<page>/`, its copy in the `<page>` i18n namespace. Shared blocks: `src/components/page/` (`Breadcrumb`, `FaqList`), `src/components/home/containerClassName.ts`, `src/components/ui/`.

## Rendering and SEO

`pnpm --filter soliance-site build` runs `tsc -b`, the client build, an SSR build of `src/entry-server.tsx` into `dist-ssr/`, then `scripts/prerender.mjs`, which renders every route of `prerenderRoutes` (exported by `entry-server.tsx`, fiche slugs included) with `react-dom/static` `prerender`, injects the HTML and the head, writes `dist/<route>/index.html`, `dist/sitemap.xml` (generated from the same list) and `dist/404.html`, then deletes `dist-ssr/`.

- A new page needs: its route in `Routes.tsx`, its path in `prerenderRoutes`, its `seo` prefix in `seoKeyPrefixByPath` (`src/lib/seo/buildHead.ts`), and a `seo.title` / `seo.description` in its namespace. The sitemap follows automatically.
- `buildHead(url, html)` reads the prerendered HTML: the first `<img fetchPriority="high">` becomes the Open Graph / Twitter image and is preloaded; every `FaqList` (`data-faq-item` / `data-faq-question` / `data-faq-answer`) becomes a `FAQPage`; the `Breadcrumb` (`data-breadcrumb-name` / `data-breadcrumb-path`) becomes a `BreadcrumbList`. Product pages also get a `Service` (texts in `common:seo.services`), home gets the `Electrician` LocalBusiness with `@id` `https://soliance-enr.fr/#business`. Never render a FAQ or a breadcrumb without these components, or the structured data silently disappears. Extraction functions are pure and tested in `src/lib/seo/structuredData.unit.spec.ts`.
- `VITE_GOOGLE_SITE_VERIFICATION` adds the Search Console meta tag on the home page.
- Canonical URLs have no trailing slash while files are written as `<route>/index.html`: the host must serve `/route` without redirecting to `/route/`, or the canonicals must change.
- `src/main.tsx` hydrates when `#root` has server HTML and falls back to `createRoot` in dev.
- Pages are `React.lazy`; hydration waits for the chunk, so the page is not interactive for a moment after first paint.
- i18n is initialised synchronously with `lng: 'fr'`; no language detector, on purpose, so the client never disagrees with the prerendered French HTML.
- Only the `common` namespace is loaded at start-up (ADR-001). Each page namespace is registered by `src/lib/i18n/namespaces/<ns>.ts`, which must be the FIRST import of the page and of any module reading a text at module scope (the zod schemas). `en-US` files are maintained key for key but not shipped.
- Mobile and desktop copy variants are both in the DOM, toggled with `lg:hidden` / `hidden lg:inline`.
- Scroll: `useScrollOnNavigation` (in `SiteLayout`) scrolls to top on page change and to `#hash` targets once the lazy page has rendered; `useScrollReveal` (called once per page) drives `data-reveal` animations.

## Architecture

Hexagon per jp-way `frontend-conventions`: `src/app/lead/` (entities `StudyRequest` and `LeadSubmission`, port `LeadGateway`, adapter `RealLeadGateway.ts` exporting `SolianceRxLeadGateway`, epics `submitStudyRequestEpic` and `submitLeadEpic`, slice `LeadSlice`), selectors in `src/selectors/lead/`, the five registries in `src/store/`. `src/app/shared/` holds `HttpClient` / `FetchHttpClient` and the `Clock` port (`SystemClock`, `FixedClock` for tests). Pure content/calculation domains without I/O: `src/app/projects/` (réalisations list, filters) and `src/app/simulator/` (estimate parameters in `solarEstimateParameters`, wizard rules).

## Lead forms

- All forms post to the HubSpot Forms API (`api.hsforms.com/submissions/v3/integration/submit/<portal>/<form>`), portal `VITE_HUBSPOT_PORTAL_ID`; form ids per form in `.env.example` (study request, professional, referral, simulation). Without them the gateway fails with `NOT_CONFIGURED` and nothing leaves the browser.
- The Soliance Care page has one request form (`LeadFormKind.CARE_REQUEST`, `VITE_HUBSPOT_CARE_FORM_ID`); every Care call to action is a `CareRequestLink` that preselects its `care_request_type` through `CareRequestContext` and jumps to `#demande`. Online subscription with a SEPA mandate is not built: « Je souscris » leads to this callback form.
- Generic forms go through `useLeadSubmission(LeadFormKind.X)`; field names are English snake_case and become HubSpot contact properties (postal code is always `zip`). Custom properties must exist in the HubSpot portal.
- Callback consent is mandatory (law of 11 August 2026): refused in the zod schema and again in the epics (`CONSENT_REQUIRED`); the consent time comes from the injected `Clock` and the displayed consent text is sent with the submission.

## External links

Simulate buttons go to the in-site `/simulateur` (option B of the specification); `config.simulatorUrl` still holds the Vesta URL (option A). Soliance Care links go to the in-site `/soliance-care` landing page (`paths.care`), which mirrors the validated Care mockup `01_Accueil_particuliers_desktop` plus the takeover, claim and B2B blocks of the brief (§5). The page is meant to move to its own domain (care.soliance.fr or soliance-care.fr, still open with the client); `src/components/care/` only depends on shared UI, the lead hexagon and `config`.
