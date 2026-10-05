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
    border: 'border-sand-line',
    band: 'bg-night text-slate-mist',
    accent: 'text-solar',
    surface: 'bg-ivory',
    line: 'border-sand-line',
    quoteBorder: 'border-solar',
    button: '',
  },
};

export const callToActionTargets: Record<ProjectCallToAction, string> = {
  [ProjectCallToAction.STUDY]: `${paths.home}#${contactAnchor}`,
  [ProjectCallToAction.PROFESSIONAL]: paths.professionals,
  [ProjectCallToAction.SIMULATOR]: paths.simulator,
};
