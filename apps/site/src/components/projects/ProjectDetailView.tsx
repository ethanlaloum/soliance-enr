import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { ProjectCompactFiche } from '@/components/projects/ProjectCompactFiche';
import { ProjectStoryFiche } from '@/components/projects/ProjectStoryFiche';
import { ProjectDetailLayout, type ProjectDetail } from '@/app/projects/domain/entities/ProjectDetail';

export const ProjectDetailView = ({ detail }: { detail: ProjectDetail }) => {
  useScrollReveal();
  const { t } = useTranslation('projects');

  return (
    <div className={cn('hz-page-container', 'flex flex-col gap-8 pb-20 pt-10 lg:gap-10 lg:pb-28 lg:pt-12')}>
      <Breadcrumb
        items={[{ label: t('portfolio.breadcrumb'), to: paths.projects }, { label: t(`items.${detail.slug}.title`) }]}
        tone="light"
        className="motion-safe:animate-fade-up"
      />
      {detail.layout === ProjectDetailLayout.STORY ? <ProjectStoryFiche detail={detail} /> : <ProjectCompactFiche detail={detail} />}
    </div>
  );
};
