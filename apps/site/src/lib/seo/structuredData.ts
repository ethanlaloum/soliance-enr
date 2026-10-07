export type FaqEntry = { question: string; answer: string };

export type BreadcrumbEntry = { name: string; path: string };

export type MonthlyOffer = { name: string; price: number };

export type ServiceDescription = { name: string; description: string; serviceType: string; path: string; offers?: MonthlyOffer[] };

export type HeroImage = { src: string; alt: string | null; width: number | null; height: number | null; preloadMedia: string | null };

const namedEntities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export const decodeHtml = (value: string): string =>
  value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith('#')) return String.fromCodePoint(parseInt(code.slice(1), 10));
    return namedEntities[code.toLowerCase()] ?? entity;
  });

const toPlainText = (fragment: string): string =>
  decodeHtml(fragment.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

const readAttribute = (tag: string, name: string): string | null => {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return match ? decodeHtml(match[1]) : null;
};

export const extractFaqEntries = (html: string): FaqEntry[] =>
  Array.from(html.matchAll(/<details\b[^>]*\bdata-faq-item\b[^>]*>([\s\S]*?)<\/details>/gi)).flatMap(([, block]) => {
    const question = block.match(/<span\b[^>]*\bdata-faq-question\b[^>]*>([\s\S]*?)<\/span>/i);
    const answer = block.match(/<p\b[^>]*\bdata-faq-answer\b[^>]*>([\s\S]*?)<\/p>/i);
    if (!question || !answer) return [];
    return [{ question: toPlainText(question[1]), answer: toPlainText(answer[1]) }];
  });

export const extractBreadcrumb = (html: string, currentPath: string): BreadcrumbEntry[] =>
  Array.from(html.matchAll(/<(a|span)\b([^>]*\bdata-breadcrumb-name\b[^>]*)>([\s\S]*?)<\/\1>/gi)).map(([, , attributes, content]) => ({
    name: toPlainText(content),
    path: readAttribute(attributes, 'data-breadcrumb-path') ?? readAttribute(attributes, 'href') ?? currentPath,
  }));

const readDimension = (tag: string, name: string): number | null => {
  const value = Number(readAttribute(tag, name));
  return Number.isInteger(value) && value > 0 ? value : null;
};

export const extractHeroImage = (html: string): HeroImage | null => {
  const tag = html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*>/i)?.[0];
  const src = tag ? readAttribute(tag, 'src') : null;
  if (!tag || !src) return null;
  return {
    src,
    alt: readAttribute(tag, 'alt') || null,
    width: readDimension(tag, 'width'),
    height: readDimension(tag, 'height'),
    preloadMedia: readAttribute(tag, 'data-preload-media'),
  };
};

export const parseEuroAmount = (value: string): number | null => {
  const match = value.replace(/\s/g, '').match(/\d+(?:,\d{1,2})?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

export const businessId = (siteUrl: string) => `${siteUrl}/#business`;

export const webSiteSchema = (siteUrl: string, name: string, alternateName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name,
  alternateName,
  url: `${siteUrl}/`,
  inLanguage: 'fr-FR',
  publisher: { '@id': businessId(siteUrl) },
});

export const faqPageSchema = (entries: FaqEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: entries.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: { '@type': 'Answer', text: entry.answer },
  })),
});

export const breadcrumbListSchema = (entries: BreadcrumbEntry[], siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: entries.map((entry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: entry.name,
    item: `${siteUrl}${entry.path}`,
  })),
});

export type AreaServedType = 'AdministrativeArea' | 'City';

export const serviceSchema = (service: ServiceDescription, siteUrl: string, areaServed: string[], areaServedType: AreaServedType = 'AdministrativeArea') => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  serviceType: service.serviceType,
  description: service.description,
  url: `${siteUrl}${service.path}`,
  provider: { '@type': 'Electrician', '@id': businessId(siteUrl), name: 'Soliance', url: siteUrl },
  areaServed: areaServed.map((name) => ({ '@type': areaServedType, name })),
  ...(service.offers && service.offers.length > 0
    ? {
        offers: service.offers.map((offer) => ({
          '@type': 'Offer',
          name: offer.name,
          price: offer.price,
          priceCurrency: 'EUR',
          url: `${siteUrl}${service.path}`,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: offer.price,
            priceCurrency: 'EUR',
            unitCode: 'MON',
            valueAddedTaxIncluded: true,
          },
        })),
      }
    : {}),
});
