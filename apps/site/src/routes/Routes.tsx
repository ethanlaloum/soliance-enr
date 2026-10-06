import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { SiteLayout } from '@/layout/SiteLayout';
import { paths } from '@/routes/paths';

const HomePage = lazy(() => import('@/pages/home/HomePage').then((module) => ({ default: module.HomePage })));
const SolarPage = lazy(() => import('@/pages/solar/SolarPage').then((module) => ({ default: module.SolarPage })));
const HeatPumpPage = lazy(() => import('@/pages/heat-pump/HeatPumpPage').then((module) => ({ default: module.HeatPumpPage })));
const EvChargerPage = lazy(() => import('@/pages/ev-charger/EvChargerPage').then((module) => ({ default: module.EvChargerPage })));
const ProfessionalsPage = lazy(() => import('@/pages/professionals/ProfessionalsPage').then((module) => ({ default: module.ProfessionalsPage })));
const SimulatorPage = lazy(() => import('@/pages/simulator/SimulatorPage').then((module) => ({ default: module.SimulatorPage })));
const ReferralPage = lazy(() => import('@/pages/referral/ReferralPage').then((module) => ({ default: module.ReferralPage })));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage').then((module) => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/pages/projects/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })));
const ResourcesPage = lazy(() => import('@/pages/resources/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const CarePage = lazy(() => import('@/pages/care/CarePage').then((module) => ({ default: module.CarePage })));
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export const AppRoutes = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={paths.care} element={<CarePage />} />
      <Route element={<SiteLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.solar} element={<SolarPage />} />
        <Route path={paths.heatPump} element={<HeatPumpPage />} />
        <Route path={paths.evCharger} element={<EvChargerPage />} />
        <Route path={paths.professionals} element={<ProfessionalsPage />} />
        <Route path={paths.simulator} element={<SimulatorPage />} />
        <Route path={paths.referral} element={<ReferralPage />} />
        <Route path={paths.projects} element={<ProjectsPage />} />
        <Route path={paths.projectDetail} element={<ProjectDetailPage />} />
        <Route path={paths.resources} element={<ResourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);
