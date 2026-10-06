import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';

export const NotFoundPage = () => {
  const { t } = useTranslation('common');

  return (
    <section className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-start justify-center gap-5 px-5 py-24">
      <h1 className="text-[32px] font-bold tracking-[-0.02em] lg:text-[44px]">{t('notFound.title')}</h1>
      <p className="text-lg text-slate-ink">{t('notFound.description')}</p>
      <Link to={paths.home} className={cn(buttonVariants({ size: 'md' }))}>
        {t('notFound.backHome')}
      </Link>
    </section>
  );
};
