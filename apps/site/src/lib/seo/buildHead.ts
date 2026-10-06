import i18n from '@/lib/i18n/i18n';
import { config } from '@/config';
import { paths } from '@/routes/paths';
import { localBusinessSchema } from '@/lib/seo/localBusinessSchema';
import {
  breadcrumbListSchema,
  extractBreadcrumb,
  extractFaqEntries,
  extractHeroImage,
  faqPageSchema,
  serviceSchema,
} from '@/lib/seo/structuredData';

const defaultShareImage = '/images/hero-vence-villa.webp';

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const jsonLdTag = (value: unknown) => `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`;

const seoKeyPrefixByPath: Record<string, string> = {
  [paths.home]: 'home:seo',
  [paths.solar]: 'solar:seo',
  [paths.heatPump]: 'heatPump:seo',
  [paths.evCharger]: 'evCharger:seo',
  [paths.professionals]: 'professionals:seo',
  [paths.simulator]: 'simulator:seo',
  [paths.referral]: 'referral:seo',
  [paths.projects]: 'projects:seo',
  [paths.resources]: 'resources:seo',
  [paths.care]: 'care:seo',
};

const serviceKeyByPath: Record<string, string> = {
  [paths.solar]: 'solar',
  [paths.heatPump]: 'heatPump',
  [paths.evCharger]: 'evCharger',
  [paths.professionals]: 'professionals',
  [paths.care]: 'care',
};

const projectDetailPrefix = `${paths.projects}/`;

const resolveSeoKeyPrefix = (url: string): string | null => {
  if (seoKeyPrefixByPath[url]) return seoKeyPrefixByPath[url];
  if (url.startsWith(projectDetailPrefix)) {
    const prefix = `projects:fiches.${url.slice(projectDetailPrefix.length)}.seo`;
    return i18n.exists(`${prefix}.title`) ? prefix : null;
  }
  return null;
};

const absoluteUrl = (path: string) => (path.startsWith('http') ? path : `${config.siteUrl}${path}`);

export const buildHead = (url: string, html: string): string => {
  const seoKeyPrefix = resolveSeoKeyPrefix(url);
  const isIndexable = seoKeyPrefix !== null;
  const title = isIndexable ? i18n.t(`${seoKeyPrefix}.title`) : i18n.t('common:notFound.seoTitle');
  const description = isIndexable ? i18n.t(`${seoKeyPrefix}.description`) : i18n.t('common:notFound.seoDescription');
  const canonical = absoluteUrl(url);
  const heroImage = extractHeroImage(html);
  const shareImage = absoluteUrl(heroImage ?? defaultShareImage);
  const areaServed = i18n.t('common:seo.areaServed', { returnObjects: true }) as string[];

  const tags = [
    `<title>${escapeText(title)}</title>`,
    `<meta name="description" content="${escapeAttribute(description)}" />`,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:site_name" content="Soliance" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(shareImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(shareImage)}" />`,
  ];

  if (heroImage) {
    tags.push(`<link rel="preload" as="image" href="${escapeAttribute(heroImage)}" fetchpriority="high" />`);
  }
  if (config.googleSiteVerification && url === paths.home) {
    tags.push(`<meta name="google-site-verification" content="${escapeAttribute(config.googleSiteVerification)}" />`);
  }
  if (!isIndexable) {
    tags.push('<meta name="robots" content="noindex" />');
    return tags.join('\n    ');
  }

  if (url === paths.home) {
    tags.push(jsonLdTag(localBusinessSchema(description)));
  }

  const serviceKey = serviceKeyByPath[url];
  if (serviceKey) {
    tags.push(
      jsonLdTag(
        serviceSchema(
          {
            name: i18n.t(`common:seo.services.${serviceKey}.name`),
            serviceType: i18n.t(`common:seo.services.${serviceKey}.serviceType`),
            description,
            path: url,
          },
          config.siteUrl,
          areaServed,
        ),
      ),
    );
  }

  const faqEntries = extractFaqEntries(html);
  if (faqEntries.length > 0) {
    tags.push(jsonLdTag(faqPageSchema(faqEntries)));
  }

  const breadcrumb = extractBreadcrumb(html, url);
  if (breadcrumb.length > 1) {
    tags.push(jsonLdTag(breadcrumbListSchema(breadcrumb, config.siteUrl)));
  }

  return tags.join('\n    ');
};
