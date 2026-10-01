export const resourceSectionIds = ['news', 'faq', 'glossary'] as const;

export type ResourceSectionId = (typeof resourceSectionIds)[number];

export const sectionScrollMarginClassName = 'scroll-mt-12 lg:scroll-mt-14';
