import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { sectionScrollMarginClassName } from '@/components/resources/resourceSectionIds';

const newsCategories = ['aids', 'regulation', 'advice', 'soliance'] as const;

type NewsCategory = (typeof newsCategories)[number];

type NewsFilter = NewsCategory | 'all';

type NewsImage = { src: string; width: number; height: number };

type NewsArticle = {
  key: string;
  category: NewsCategory;
  image?: NewsImage;
};

const featuredArticle: NewsArticle & { image: NewsImage } = {
  key: 'surplusBattery',
  category: 'aids',
  image: { src: '/images/resources/news-surplus-battery.webp', width: 900, height: 900 },
};

const mediaArticles: (NewsArticle & { image: NewsImage })[] = [
  { key: 'inverterSigns', category: 'advice', image: { src: '/images/resources/news-inverter-signs.webp', width: 640, height: 640 } },
  { key: 'aperCarports', category: 'regulation', image: { src: '/images/resources/news-aper-carports.webp', width: 640, height: 640 } },
];

const briefArticles: NewsArticle[] = [
  { key: 'heatPumpGrant', category: 'aids' },
  { key: 'batterySize', category: 'advice' },
  { key: 'showroomOpening', category: 'soliance' },
];

const filters: NewsFilter[] = ['all', ...newsCategories];

const cardEyebrowClassName = 'text-[11px] font-semibold uppercase tracking-[0.14em]';

export const NewsSection = () => {
  const { t } = useTranslation('resources');
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('all');

  const isShown = (article: NewsArticle) => activeFilter === 'all' || article.category === activeFilter;
  const meta = (article: NewsArticle) =>
    t('news.meta', { category: t(`news.categories.${article.category}`), date: t(`news.articles.${article.key}.date`) });
  const hasHighlights = [featuredArticle, ...mediaArticles].some(isShown);
  const hasBriefs = briefArticles.some(isShown);

  return (
    <section id="news" aria-labelledby="news-title" className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-6 pb-10 pt-12 lg:gap-9 lg:pb-16 lg:pt-20')}>
      <div data-reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p aria-hidden="true" className="energy-kicker tabular-nums">01 / 03</p>
          <h2 id="news-title" className="energy-title">
            {t('news.title')}
          </h2>
        </div>
        <div role="group" aria-label={t('news.filters.label')} className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button key={filter} type="button" aria-pressed={filter === activeFilter} onClick={() => setActiveFilter(filter)} className="energy-chip">
              {filter === 'all' ? t('news.filters.all') : t(`news.categories.${filter}`)}
            </button>
          ))}
        </div>
      </div>

      <div hidden={!hasHighlights}>
        <ul className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-5">
          <li hidden={!isShown(featuredArticle)} data-reveal style={revealDelay(0)}>
            <article className="relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-lg bg-night p-6 text-ivory lg:min-h-[360px] lg:p-8">
              <img
                src={featuredArticle.image.src}
                alt=""
                width={featuredArticle.image.width}
                height={featuredArticle.image.height}
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
              />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,17,32,0)_15%,rgba(11,17,32,0.96)_100%)]" />
              <div className="flex flex-col gap-3">
                <p className={cn(cardEyebrowClassName, 'text-solar')}>{meta(featuredArticle)}</p>
                <h3 className="text-[24px] font-medium leading-[1.15] tracking-[-0.03em] lg:text-[30px]">{t(`news.articles.${featuredArticle.key}.title`)}</h3>
                <p className="max-w-[520px] text-sm leading-[1.6] text-slate-light">{t(`news.articles.${featuredArticle.key}.summary`)}</p>
              </div>
            </article>
          </li>
          {mediaArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index + 1)}>
              <article className="flex h-full flex-col gap-3 rounded-md border border-sand-line bg-white p-4 lg:p-5">
                <img
                  src={article.image.src}
                  alt={t(`news.articles.${article.key}.imageAlt`)}
                  width={article.image.width}
                  height={article.image.height}
                  loading="lazy"
                  className="block h-[170px] w-full rounded object-cover lg:h-[150px]"
                />
                <p className={cn(cardEyebrowClassName, 'mt-1 text-solar-dark')}>{meta(article)}</p>
                <h3 className="text-lg font-medium leading-[1.25] tracking-[-0.02em] lg:text-[19px]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div hidden={!hasBriefs}>
        <ul className="grid gap-3 lg:grid-cols-3 lg:gap-5">
          {briefArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index)}>
              <article className="flex h-full flex-col gap-2 border-t border-night pt-4">
                <p className={cn(cardEyebrowClassName, 'text-slate')}>{meta(article)}</p>
                <h3 className="text-base font-medium leading-snug tracking-[-0.015em] lg:text-[17px]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
