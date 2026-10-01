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

const cardEyebrowClassName = 'text-xs font-semibold uppercase tracking-[1px] text-solar';

export const NewsSection = () => {
  const { t } = useTranslation('resources');
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('all');

  const isShown = (article: NewsArticle) => activeFilter === 'all' || article.category === activeFilter;
  const meta = (article: NewsArticle) =>
    t('news.meta', { category: t(`news.categories.${article.category}`), date: t(`news.articles.${article.key}.date`) });
  const hasHighlights = [featuredArticle, ...mediaArticles].some(isShown);
  const hasBriefs = briefArticles.some(isShown);

  return (
    <section id="news" aria-labelledby="news-title" className={cn(containerClassName, sectionScrollMarginClassName, 'flex flex-col gap-5 pb-8 pt-7 lg:gap-6 lg:pb-12 lg:pt-8')}>
      <div data-reveal className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="news-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
          {t('news.title')}
        </h2>
        <div role="group" aria-label={t('news.filters.label')} className="flex flex-wrap gap-2 text-[13px]">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'rounded-[14px] border px-3 py-[7px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solar',
                  isActive ? 'border-night bg-night text-white' : 'border-sand-border bg-white text-night hover:border-night',
                )}
              >
                {filter === 'all' ? t('news.filters.all') : t(`news.categories.${filter}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div hidden={!hasHighlights}>
        <ul className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-5">
          <li hidden={!isShown(featuredArticle)} data-reveal style={revealDelay(0)}>
            <article className="relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-[18px] bg-night p-6 text-white lg:min-h-[300px] lg:p-7">
              <img
                src={featuredArticle.image.src}
                alt=""
                width={featuredArticle.image.width}
                height={featuredArticle.image.height}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.45]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,32,0)_20%,rgba(11,17,32,0.95)_100%)]" />
              <div className="relative flex flex-col gap-2.5">
                <p className={cardEyebrowClassName}>{meta(featuredArticle)}</p>
                <h3 className="text-[22px] font-bold leading-[1.2] lg:text-[26px]">{t(`news.articles.${featuredArticle.key}.title`)}</h3>
                <p className="text-sm text-slate-light">{t(`news.articles.${featuredArticle.key}.summary`)}</p>
              </div>
            </article>
          </li>
          {mediaArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index + 1)}>
              <article className="flex h-full flex-col gap-2.5 rounded-[18px] border border-sand-line bg-white p-5 lg:p-6">
                <img
                  src={article.image.src}
                  alt={t(`news.articles.${article.key}.imageAlt`)}
                  width={article.image.width}
                  height={article.image.height}
                  loading="lazy"
                  className="block h-[150px] w-full rounded-[10px] object-cover lg:h-[110px]"
                />
                <p className={cardEyebrowClassName}>{meta(article)}</p>
                <h3 className="text-lg font-bold leading-[1.25] lg:text-[19px]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div hidden={!hasBriefs}>
        <ul className="grid gap-3 lg:grid-cols-3 lg:gap-5">
          {briefArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index)}>
              <article className="flex h-full flex-col gap-1.5 rounded-[14px] border border-sand-line bg-white p-5">
                <p className="text-xs text-slate">{meta(article)}</p>
                <h3 className="text-base font-bold lg:text-[17px]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
