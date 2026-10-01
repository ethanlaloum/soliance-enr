export enum ProjectDetailLayout {
  STORY = 'story',
  COMPACT = 'compact',
}

export enum ProjectDetailTheme {
  SOLAR = 'solar',
  HEAT = 'heat',
}

export enum ProjectStoryBlock {
  NEED = 'need',
  SOLUTION = 'solution',
  PROCESS = 'process',
  RESULT = 'result',
  FOLLOW_UP = 'followUp',
}

export enum ProjectPanelKind {
  EXPECTED_RESULTS = 'expectedResults',
  EXPLANATION = 'explanation',
}

export enum ProjectCallToAction {
  STUDY = 'study',
  PROFESSIONAL = 'professional',
  SIMULATOR = 'simulator',
}

export enum TechnicalSheetRow {
  POWER = 'power',
  SOLAR = 'solar',
  PANELS = 'panels',
  INVERTER = 'inverter',
  INVERTERS = 'inverters',
  INVERTER_STORAGE = 'inverterStorage',
  STORAGE = 'storage',
  HEAT_PUMP = 'heatPump',
  STRUCTURE = 'structure',
  ROOF = 'roof',
  ROOFS = 'roofs',
  SCHEME = 'scheme',
  BUILDING = 'building',
  OWNER = 'owner',
  COMMISSIONING = 'commissioning',
  AIDS = 'aids',
}

export interface ProjectDetailImage {
  key: string;
  src: string;
  width: number;
  height: number;
  objectPosition: string;
  columnWeight: number;
}

export interface ProjectPanel {
  kind: ProjectPanelKind;
  hasMetrics: boolean;
  hasChart: boolean;
}

export interface ProjectStoryDetail {
  layout: ProjectDetailLayout.STORY;
  slug: string;
  theme: ProjectDetailTheme;
  heroImages: ProjectDetailImage[];
  videoImageKey: string | null;
  sideImages: ProjectDetailImage[];
  storyBlocks: ProjectStoryBlock[];
  testimonialHasAuthor: boolean;
  panel: ProjectPanel | null;
  technicalSheetRows: TechnicalSheetRow[];
  hasEstimateNote: boolean;
  callToAction: ProjectCallToAction;
}

export interface ProjectCompactDetail {
  layout: ProjectDetailLayout.COMPACT;
  slug: string;
  mainImage: ProjectDetailImage;
  mainImageFirst: boolean;
  secondaryImages: ProjectDetailImage[];
  callToAction: ProjectCallToAction;
}

export type ProjectDetail = ProjectStoryDetail | ProjectCompactDetail;

const image = (
  slug: string,
  key: string,
  name: string,
  size: { width: number; height: number },
  options: { objectPosition?: string; columnWeight?: number } = {},
): ProjectDetailImage => ({
  key,
  src: `/images/projects/${slug}-${name}.webp`,
  width: size.width,
  height: size.height,
  objectPosition: options.objectPosition ?? '50% 50%',
  columnWeight: options.columnWeight ?? 1,
});

const landscape = { width: 1280, height: 720 };
const portrait = { width: 800, height: 1067 };

const storyBlocksWithResult = [ProjectStoryBlock.NEED, ProjectStoryBlock.SOLUTION, ProjectStoryBlock.PROCESS, ProjectStoryBlock.RESULT];

export const projectDetails: ProjectDetail[] = [
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'vence-villa-16-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [],
    videoImageKey: null,
    sideImages: [
      image('vence-villa-16-kwc', 'panelsHills', 'panels-hills', { width: 1280, height: 853 }, { columnWeight: 2 }),
      image('vence-villa-16-kwc', 'inverterBattery', 'inverter-battery', { width: 800, height: 1201 }),
      image('vence-villa-16-kwc', 'technicians', 'technicians', { width: 1280, height: 853 }),
    ],
    storyBlocks: [ProjectStoryBlock.NEED, ProjectStoryBlock.SOLUTION, ProjectStoryBlock.PROCESS, ProjectStoryBlock.FOLLOW_UP],
    testimonialHasAuthor: false,
    panel: { kind: ProjectPanelKind.EXPECTED_RESULTS, hasMetrics: true, hasChart: true },
    technicalSheetRows: [],
    hasEstimateNote: false,
    callToAction: ProjectCallToAction.STUDY,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'immeuble-bureaux-148-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [image('immeuble-bureaux-148-kwc', 'rooftop', 'rooftop', landscape)],
    videoImageKey: null,
    sideImages: [
      image('immeuble-bureaux-148-kwc', 'seaView', 'sea-view', landscape),
      image('immeuble-bureaux-148-kwc', 'panelRows', 'panel-rows', landscape),
    ],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: null,
    technicalSheetRows: [
      TechnicalSheetRow.POWER,
      TechnicalSheetRow.PANELS,
      TechnicalSheetRow.INVERTER,
      TechnicalSheetRow.STRUCTURE,
      TechnicalSheetRow.SCHEME,
      TechnicalSheetRow.BUILDING,
    ],
    hasEstimateNote: true,
    callToAction: ProjectCallToAction.PROFESSIONAL,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'pertuis-gymnase-163-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [image('pertuis-gymnase-163-kwc', 'village', 'village', landscape), image('pertuis-gymnase-163-kwc', 'roof', 'roof', landscape)],
    videoImageKey: null,
    sideImages: [image('pertuis-gymnase-163-kwc', 'stadium', 'stadium', landscape)],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: null,
    technicalSheetRows: [TechnicalSheetRow.POWER, TechnicalSheetRow.ROOF, TechnicalSheetRow.INVERTERS, TechnicalSheetRow.SCHEME, TechnicalSheetRow.OWNER],
    hasEstimateNote: true,
    callToAction: ProjectCallToAction.PROFESSIONAL,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'plan-de-la-tour-villa-20-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [
      image('plan-de-la-tour-villa-20-kwc', 'villaDrone', 'villa-drone', landscape, { columnWeight: 1.6 }),
      image('plan-de-la-tour-villa-20-kwc', 'inverter', 'inverter', portrait),
    ],
    videoImageKey: null,
    sideImages: [image('plan-de-la-tour-villa-20-kwc', 'garage', 'garage', landscape)],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: null,
    technicalSheetRows: [TechnicalSheetRow.POWER, TechnicalSheetRow.PANELS, TechnicalSheetRow.INVERTER, TechnicalSheetRow.STORAGE, TechnicalSheetRow.ROOFS],
    hasEstimateNote: true,
    callToAction: ProjectCallToAction.STUDY,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'seranon-spar-36-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [
      image('seranon-spar-36-kwc', 'drone', 'drone', { width: 800, height: 1423 }, { objectPosition: '50% 62%' }),
      image('seranon-spar-36-kwc', 'facade', 'facade', { width: 1280, height: 960 }, { objectPosition: '50% 55%' }),
      image('seranon-spar-36-kwc', 'installation', 'installation', { width: 800, height: 1423 }, { objectPosition: '50% 55%' }),
    ],
    videoImageKey: 'installation',
    sideImages: [],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: true,
    panel: { kind: ProjectPanelKind.EXPLANATION, hasMetrics: true, hasChart: false },
    technicalSheetRows: [TechnicalSheetRow.POWER, TechnicalSheetRow.ROOF, TechnicalSheetRow.INVERTER, TechnicalSheetRow.SCHEME, TechnicalSheetRow.COMMISSIONING],
    hasEstimateNote: false,
    callToAction: ProjectCallToAction.PROFESSIONAL,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'vence-villa-28-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [image('vence-villa-28-kwc', 'villaDrone', 'villa-drone', landscape), image('vence-villa-28-kwc', 'roofRows', 'roof-rows', landscape)],
    videoImageKey: null,
    sideImages: [image('vence-villa-28-kwc', 'garageBatteries', 'garage-batteries', portrait, { objectPosition: '50% 40%' })],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: { kind: ProjectPanelKind.EXPECTED_RESULTS, hasMetrics: true, hasChart: false },
    technicalSheetRows: [TechnicalSheetRow.POWER, TechnicalSheetRow.INVERTER, TechnicalSheetRow.STORAGE, TechnicalSheetRow.ROOFS],
    hasEstimateNote: false,
    callToAction: ProjectCallToAction.STUDY,
  },
  {
    layout: ProjectDetailLayout.COMPACT,
    slug: 'villeneuve-loubet-maison-4-kwc',
    mainImage: image('villeneuve-loubet-maison-4-kwc', 'seaView', 'sea-view', landscape, { objectPosition: '50% 55%' }),
    mainImageFirst: true,
    secondaryImages: [image('villeneuve-loubet-maison-4-kwc', 'roof', 'roof', landscape, { objectPosition: '50% 65%' })],
    callToAction: ProjectCallToAction.SIMULATOR,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'saint-laurent-du-var-hangar-agricole-15-kwc',
    theme: ProjectDetailTheme.SOLAR,
    heroImages: [
      image('saint-laurent-du-var-hangar-agricole-15-kwc', 'orchards', 'orchards', landscape, { objectPosition: '50% 55%', columnWeight: 1.4 }),
      image('saint-laurent-du-var-hangar-agricole-15-kwc', 'roof', 'roof', landscape),
    ],
    videoImageKey: null,
    sideImages: [image('saint-laurent-du-var-hangar-agricole-15-kwc', 'technicalRoom', 'technical-room', portrait, { objectPosition: '50% 30%' })],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: null,
    technicalSheetRows: [TechnicalSheetRow.POWER, TechnicalSheetRow.ROOF, TechnicalSheetRow.INVERTER, TechnicalSheetRow.STORAGE, TechnicalSheetRow.SCHEME],
    hasEstimateNote: false,
    callToAction: ProjectCallToAction.PROFESSIONAL,
  },
  {
    layout: ProjectDetailLayout.COMPACT,
    slug: 'saint-jeannet-villa-6-kwc',
    mainImage: image('saint-jeannet-villa-6-kwc', 'villaDrone', 'villa-drone', landscape, { objectPosition: '40% 55%' }),
    mainImageFirst: false,
    secondaryImages: [
      image('saint-jeannet-villa-6-kwc', 'lowRoofs', 'low-roofs', landscape),
      image('saint-jeannet-villa-6-kwc', 'inverter', 'inverter', { width: 679, height: 576 }, { objectPosition: '50% 30%' }),
    ],
    callToAction: ProjectCallToAction.SIMULATOR,
  },
  {
    layout: ProjectDetailLayout.STORY,
    slug: 'la-colle-sur-loup-pac-13-kwc',
    theme: ProjectDetailTheme.HEAT,
    heroImages: [
      image('la-colle-sur-loup-pac-13-kwc', 'villa', 'villa', landscape, { objectPosition: '50% 55%', columnWeight: 1.3 }),
      image('la-colle-sur-loup-pac-13-kwc', 'bufferTank', 'buffer-tank', portrait, { objectPosition: '50% 45%' }),
      image('la-colle-sur-loup-pac-13-kwc', 'outdoorUnit', 'outdoor-unit', { width: 800, height: 1064 }),
    ],
    videoImageKey: null,
    sideImages: [],
    storyBlocks: storyBlocksWithResult,
    testimonialHasAuthor: false,
    panel: { kind: ProjectPanelKind.EXPLANATION, hasMetrics: false, hasChart: false },
    technicalSheetRows: [TechnicalSheetRow.SOLAR, TechnicalSheetRow.INVERTER_STORAGE, TechnicalSheetRow.HEAT_PUMP, TechnicalSheetRow.AIDS],
    hasEstimateNote: false,
    callToAction: ProjectCallToAction.STUDY,
  },
];

export const projectDetailSlugs: string[] = projectDetails.map((detail) => detail.slug);

export const findProjectDetail = (list: ProjectDetail[], slug: string | undefined): ProjectDetail | null =>
  list.find((detail) => slug !== undefined && detail.slug === slug) ?? null;
