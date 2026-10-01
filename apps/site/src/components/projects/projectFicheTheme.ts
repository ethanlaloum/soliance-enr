import { contactAnchor, paths } from '@/routes/paths';
import { ProjectCallToAction, ProjectDetailTheme } from '@/app/projects/domain/entities/ProjectDetail';

type FicheThemeClassNames = {
  border: string;
  band: string;
  accent: string;
  surface: string;
  line: string;
  quoteBorder: string;
  button: string;
};

export const ficheThemeClassNames: Record<ProjectDetailTheme, FicheThemeClassNames> = {
  [ProjectDetailTheme.SOLAR]: {
    border: 'border-sand-line',
    band: 'bg-night text-slate-mist',
    accent: 'text-solar',
    surface: 'bg-ivory',
    line: 'border-sand-line',
    quoteBorder: 'border-solar',
    button: '',
  },
  [ProjectDetailTheme.HEAT]: {
    border: 'border-heat-line',
    band: 'bg-heat text-heat-mist',
    accent: 'text-heat',
    surface: 'bg-heat-surface',
    line: 'border-heat-line',
    quoteBorder: 'border-heat',
    button: 'bg-heat hover:bg-[#083d82] hover:shadow-[0_12px_24px_-10px_rgba(10,77,162,0.6)]',
  },
};

export const callToActionTargets: Record<ProjectCallToAction, string> = {
  [ProjectCallToAction.STUDY]: `${paths.home}#${contactAnchor}`,
  [ProjectCallToAction.PROFESSIONAL]: paths.professionals,
  [ProjectCallToAction.SIMULATOR]: paths.simulator,
};
