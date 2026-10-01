export type FaqEntry = { question: string; answer: string };

export type BreadcrumbEntry = { name: string; path: string };

export type ServiceDescription = { name: string; description: string; serviceType: string; path: string };

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

export const extractHeroImage = (html: string): string | null => {
  const tag = html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*>/i);
  return tag ? readAttribute(tag[0], 'src') : null;
};

export const businessId = (siteUrl: string) => `${siteUrl}/#business`;

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

export const serviceSchema = (service: ServiceDescription, siteUrl: string, areaServed: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  serviceType: service.serviceType,
  description: service.description,
  url: `${siteUrl}${service.path}`,
  provider: { '@type': 'Electrician', '@id': businessId(siteUrl), name: 'Soliance', url: siteUrl },
  areaServed: areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
});
