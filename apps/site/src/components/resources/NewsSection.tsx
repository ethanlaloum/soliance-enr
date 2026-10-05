import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
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

const cardEyebrowClassName = 'text-xs font-medium uppercase tracking-[1px] text-solar';

export const NewsSection = () => {
  const { t } = useTranslation('resources');
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('all');

  const isShown = (article: NewsArticle) => activeFilter === 'all' || article.category === activeFilter;
  const meta = (article: NewsArticle) =>
    t('news.meta', { category: t(`news.categories.${article.category}`), date: t(`news.articles.${article.key}.date`) });
  const hasHighlights = [featuredArticle, ...mediaArticles].some(isShown);
  const hasBriefs = briefArticles.some(isShown);

  return (
    <section id="news" aria-labelledby="news-title" className={cn('hz-page-container', sectionScrollMarginClassName, 'flex flex-col gap-8 pb-16 pt-10 lg:gap-10 lg:pb-20 lg:pt-14')}>
      <div data-reveal className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="news-title" className="text-[34px] font-medium leading-[1.12] tracking-[-0.045em] lg:text-[48px]">
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
                  'rounded border px-3.5 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solar',
                  isActive ? 'border-solar bg-solar text-white' : 'border-sand-border bg-transparent text-night hover:border-night',
                )}
              >
                {filter === 'all' ? t('news.filters.all') : t(`news.categories.${filter}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div hidden={!hasHighlights}>
        <ul className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-6">
          <li hidden={!isShown(featuredArticle)} data-reveal style={revealDelay(0)}>
            <article className="relative flex h-full min-h-[360px] flex-col justify-end overflow-hidden rounded-md bg-night p-6 text-white lg:min-h-[420px] lg:p-7">
              <img
                src={featuredArticle.image.src}
                alt=""
                width={featuredArticle.image.width}
                height={featuredArticle.image.height}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(39,37,34,0)_10%,rgba(39,37,34,0.94)_100%)]" />
              <div className="relative flex flex-col gap-2.5">
                <p className="text-xs font-medium uppercase tracking-[1px] text-white/80">{meta(featuredArticle)}</p>
                <h3 className="text-[28px] font-medium leading-[1.15] tracking-[-0.025em] lg:text-[34px]">{t(`news.articles.${featuredArticle.key}.title`)}</h3>
                <p className="text-sm text-slate-light">{t(`news.articles.${featuredArticle.key}.summary`)}</p>
              </div>
            </article>
          </li>
          {mediaArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index + 1)}>
              <article className="flex h-full flex-col gap-4 border-b border-sand-line pb-6">
                <img
                  src={article.image.src}
                  alt={t(`news.articles.${article.key}.imageAlt`)}
                  width={article.image.width}
                  height={article.image.height}
                  loading="lazy"
                  className="block h-[230px] w-full rounded-md object-cover lg:h-[260px]"
                />
                <p className={cardEyebrowClassName}>{meta(article)}</p>
                <h3 className="text-[23px] font-medium leading-[1.25] tracking-[-0.025em]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div hidden={!hasBriefs}>
        <ul className="grid gap-3 lg:grid-cols-3 lg:gap-5">
          {briefArticles.map((article, index) => (
            <li key={article.key} hidden={!isShown(article)} data-reveal style={revealDelay(index)}>
              <article className="flex h-full flex-col gap-3 border-t border-sand-line py-6">
                <p className="text-xs text-slate">{meta(article)}</p>
                <h3 className="text-base font-medium lg:text-[17px]">{t(`news.articles.${article.key}.title`)}</h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
