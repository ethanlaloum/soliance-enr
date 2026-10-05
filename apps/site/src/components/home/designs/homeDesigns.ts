import { ComponentType, lazy, LazyExoticComponent } from 'react';

export type HomeDesignId = 'horizon' | 'nuit' | 'riviera' | 'module' | 'garrigue';

export type HomeDesign = {
  id: HomeDesignId;
  label: string;
  swatches: string[];
  Component: LazyExoticComponent<ComponentType> | null;
};

export const defaultHomeDesign: HomeDesignId = 'horizon';

export const homeDesigns: HomeDesign[] = [
  {
    id: 'horizon',
    label: 'Horizon',
    swatches: ['#F7F4EE', '#BC502D'],
    Component: lazy(() => import('@/components/home/designs/horizon/HorizonHome').then((module) => ({ default: module.HorizonHome }))),
  },
  { id: 'nuit', label: 'Nuit', swatches: ['#0B1120', '#E07B28'], Component: null },
  {
    id: 'riviera',
    label: 'Riviera',
    swatches: ['#1B3FA0', '#E07B28'],
    Component: lazy(() => import('@/components/home/designs/riviera/RivieraHome').then((module) => ({ default: module.RivieraHome }))),
  },
  {
    id: 'module',
    label: 'Module',
    swatches: ['#F4F6F8', '#10243F'],
    Component: lazy(() => import('@/components/home/designs/module/ModuleHome').then((module) => ({ default: module.ModuleHome }))),
  },
  {
    id: 'garrigue',
    label: 'Garrigue',
    swatches: ['#1E3A2F', '#C4673A'],
    Component: lazy(() => import('@/components/home/designs/garrigue/GarrigueHome').then((module) => ({ default: module.GarrigueHome }))),
  },
];

export const designStorageKey = 'soliance-home-design';

export const isHomeDesignId = (value: string | null): value is HomeDesignId => homeDesigns.some((design) => design.id === value);
