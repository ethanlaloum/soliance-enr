import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName } from '@/components/home/containerClassName';
import { ProjectCompactFiche } from '@/components/projects/ProjectCompactFiche';
import { ProjectStoryFiche } from '@/components/projects/ProjectStoryFiche';
import { ProjectDetailLayout, type ProjectDetail } from '@/app/projects/domain/entities/ProjectDetail';

export const ProjectDetailView = ({ detail }: { detail: ProjectDetail }) => {
  useScrollReveal();
  const { t } = useTranslation('projects');

  return (
    <div className={cn(containerClassName, 'flex flex-col gap-5 pb-14 pt-6 lg:gap-6 lg:pb-20 lg:pt-10')}>
      <Breadcrumb
        items={[{ label: t('portfolio.breadcrumb'), to: paths.projects }, { label: t(`items.${detail.slug}.title`) }]}
        tone="light"
        className="motion-safe:animate-fade-up"
      />
      {detail.layout === ProjectDetailLayout.STORY ? <ProjectStoryFiche detail={detail} /> : <ProjectCompactFiche detail={detail} />}
    </div>
  );
};
