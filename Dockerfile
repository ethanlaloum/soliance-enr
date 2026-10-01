FROM node:22-slim AS build
ENV HUSKY=0
RUN npm install -g corepack@latest && corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY apps/site/package.json apps/site/
RUN pnpm install --frozen-lockfile
COPY apps/site apps/site
ARG VITE_HUBSPOT_PORTAL_ID
ARG VITE_HUBSPOT_STUDY_REQUEST_FORM_ID
ARG VITE_HUBSPOT_PROFESSIONAL_FORM_ID
ARG VITE_HUBSPOT_REFERRAL_FORM_ID
ARG VITE_HUBSPOT_SIMULATION_FORM_ID
ARG VITE_GOOGLE_SITE_VERIFICATION
RUN pnpm --filter soliance-site build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/site/dist /srv
