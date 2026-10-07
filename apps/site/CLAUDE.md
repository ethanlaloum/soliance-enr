# apps/site — soliance-site

## Stack

Vite 7 · React 19 · TypeScript strict · React Router 7 · Redux Toolkit 2 + redux-observable 3 + RxJS 7 · React Hook Form + zod 3 · Tailwind 3 · i18next (`fr`, `en-US`) · vitest 3. Versions are pinned to the majors of the jp-way frontend conventions on purpose; newer majors (Vite 8, React Router 8, Tailwind 4, zod 4, TS 7) were not adopted.

## Pages

Home, `/panneaux-solaires`, `/pompe-a-chaleur` (`heat` blue tokens), `/borne-de-recharge` (`charge` green tokens), `/professionnels`, `/simulateur`, `/parrainage`, `/realisations` and `/realisations/:slug` (10 fiches, slugs in `src/app/projects/domain/entities/ProjectDetail.ts`), `/ressources`, `/cookies` (cookie policy and the « Modifier mes choix » button), `/soliance-care` (`care` green tokens, rendered outside `SiteLayout` with its own `CareHeader` / `CareFooter`, see below). One page folder in `src/pages/`, its sections in `src/components/<page>/`, its copy in the `<page>` i18n namespace. Every route sits under `RootLayout` (`src/layout/RootLayout.tsx`), which mounts the cookie consent and the phone click tracking for the whole site, the Care page included. The home page reviews block (`TestimonialsSection`) is unplugged until Soliance has a Google Business profile with reviews; the component and its `home:testimonials` keys are kept. Shared blocks: `src/components/page/` (`Breadcrumb`, `FaqList`), `src/components/home/containerClassName.ts`, `src/components/ui/`.

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

- All forms post JSON (`kind`, `fields`, consent text and time, page) to `/api/lead.php` (`config.leadEndpoint`). The script is `public/api/lead.php`, copied as is into `dist/` and run by the OVH PHP; it validates the payload, mails the request through the Resend API and answers `400 INVALID_REQUEST`, `429`, `502 SUBMISSION_FAILED` or `503 NOT_CONFIGURED` (mapped to `LeadErrorType` by `SolianceRxLeadGateway`). The study request is sent with the kind `STUDY_REQUEST`, which is not a `LeadFormKind`.
- Recipients are fixed in the PHP (`LEAD_RECIPIENTS`), never taken from the request: every kind goes to `adv@soliance-enr.fr`, `commercial@soliance-enr.fr` and `ruben.darmon@soliance-enr.fr`. The lead's own e-mail (`email` or `referrer_email`) becomes the Reply-To.
- Field names are English snake_case (postal code is always `zip`); `FIELD_LABELS` and `VALUE_LABELS` in the PHP turn them and their enum values into French for the mail. A new field or enum value shows raw until it is added there.
- The Resend key and sender live in `soliance-mail.php` in the OVH home, one level above the web root, read through `dirname(__DIR__, 2)`; `pnpm deploy:mail-config` writes it from `RESEND_API_KEY` / `RESEND_FROM` in the root `.env`. Never put them under a `VITE_` name or in `public/`: the repository and the `ovh-deploy` branch are public.
- `vite dev` and `vite preview` do not run PHP: a submission there fails with `SUBMISSION_FAILED`.
- The Soliance Care page has one request form (`LeadFormKind.CARE_REQUEST`); every Care call to action is a `CareRequestLink` that preselects its `care_request_type` through `CareRequestContext` and jumps to `#demande`. Online subscription with a SEPA mandate is not built: « Je souscris » leads to this callback form.
- Generic forms go through `useLeadSubmission(LeadFormKind.X)`.
- Callback consent is mandatory (law of 11 August 2026): refused in the zod schema and again in the epics (`CONSENT_REQUIRED`); the consent time comes from the injected `Clock` and the displayed consent text is sent with the submission.

## Cookie consent and analytics

- `src/app/consent/` keeps the visitor's choice (`ConsentChoice`: analytics yes or no, decision time, `CONSENT_VERSION`) in `localStorage` under `soliance-consent` (`LocalStorageConsentGateway`). A choice older than 182 days or saved under another version is dropped and the banner shows again: bump `CONSENT_VERSION` whenever a tracker or a purpose is added. When the storage cannot be written, `saveConsentFailed` still carries the choice and the reducer applies it for the visit.
- `CookieConsent` dispatches `loadConsentRequested` on mount, so the banner and the preferences `<dialog>` only exist on the client and never in the prerendered HTML. Closing the dialog (Escape or the cross) records nothing; the banner comes back while no choice exists.
- Accept and refuse share `consentButtonClassName` on purpose: the CNIL wants refusing to be as easy and as visible as accepting. Do not turn « Tout accepter » into the orange primary button.
- `src/app/analytics/`: `GoogleTagAnalyticsGateway` injects gtag.js only after consent and only when `VITE_GA_MEASUREMENT_ID` is set at build time; nothing loads without it. GA cookies are capped at 13 months and not renewed on each visit (`cookie_expires`, `cookie_update: false`, CNIL rule). Withdrawing sets `ga-disable-<id>` and expires every `_ga*` cookie on the host and its parent domains.
- `trackConversionEpic` sends `generate_lead` (`form_kind`, `STUDY_REQUEST` for the home form) after every successful form and `click_to_call` (`phone_number`) on any `tel:` link click caught by `usePhoneCallTracking`, only while analytics is accepted. Both must be marked as key events in GA4.
- A new tracker means: its row in `cookies.json` (`list.rows`), the banner and dialog texts in `common:consent`, and a `CONSENT_VERSION` bump.
- `vite preview` serves `/route` with the home HTML (React hydration error #418); open `/route/` with the trailing slash to check a prerendered page locally. OVH serves `/route` correctly.

## External links

Simulate buttons go to the in-site `/simulateur` (option B of the specification); `config.simulatorUrl` still holds the Vesta URL (option A). Soliance Care links go to the in-site `/soliance-care` landing page (`paths.care`), which mirrors the validated Care mockup `01_Accueil_particuliers_desktop` plus the takeover, claim and B2B blocks of the brief (§5). The page is meant to move to its own domain (care.soliance.fr or soliance-care.fr, still open with the client); `src/components/care/` only depends on shared UI, the lead hexagon and `config`.
