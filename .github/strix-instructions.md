Scope: white-box security review of this repository only. It is the marketing site of Soliance ENR: a Vite + React front end prerendered to static HTML, and two PHP endpoints under `apps/site/public/api/` served by an OVH shared host.

Hard limits:
- Never send a request to soliance-enr.fr, www.soliance-enr.fr, contact.soliance-enr.fr or any other live host.
- Never call the Resend API: `lead.php` e-mails every request to real Soliance staff.
- If you run the site, run it inside the sandbox only.

Focus on:
- `apps/site/public/api/lead.php`: payload validation, the Origin check, header or content injection into the e-mail, the honeypot and fill-time anti-spam, rate limiting, error messages that leak internals.
- `apps/site/public/api/pvgis.php`: server-side request forgery, parameter validation, caching and abuse.
- `apps/site/public/.htaccess`: redirects, security headers, files that should not be served.
- Secrets or credentials committed anywhere in the repository or its history, and `VITE_` variables that would ship a secret to the browser.
- XSS through translated strings, structured data (JSON-LD) or any HTML built from strings in the React code and `scripts/prerender.mjs`.
- Known vulnerabilities in the dependencies of `apps/site/package.json`.
