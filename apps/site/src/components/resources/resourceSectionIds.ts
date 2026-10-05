export const resourceSectionIds = ['news', 'faq', 'glossary'] as const;

export type ResourceSectionId = (typeof resourceSectionIds)[number];

export const sectionScrollMarginClassName = '!scroll-mt-[calc(var(--hz-header-height)+84px)]';
