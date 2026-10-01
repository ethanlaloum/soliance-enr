import '@/lib/i18n/namespaces/projects';
import { useParams } from 'react-router';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';
import { findProjectDetail, projectDetails } from '@/app/projects/domain/entities/ProjectDetail';

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const detail = findProjectDetail(projectDetails, slug);

  if (!detail) return <NotFoundPage />;

  return <ProjectDetailView key={detail.slug} detail={detail} />;
};
