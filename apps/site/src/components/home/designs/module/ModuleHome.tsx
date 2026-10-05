import '@fontsource-variable/schibsted-grotesk';
import '@/components/home/designs/module/module.css';
import { ModuleContact } from '@/components/home/designs/module/ModuleContact';
import { ModuleHero } from '@/components/home/designs/module/ModuleHero';
import { ModulePartners } from '@/components/home/designs/module/ModulePartners';
import { ModuleSimulator } from '@/components/home/designs/module/ModuleSimulator';
import { ModuleSolutions } from '@/components/home/designs/module/ModuleSolutions';
import { ModuleSteps } from '@/components/home/designs/module/ModuleSteps';
import { ModuleTestimonials } from '@/components/home/designs/module/ModuleTestimonials';
import { ModuleTiles } from '@/components/home/designs/module/ModuleTiles';
import { ModuleWhy } from '@/components/home/designs/module/ModuleWhy';

export const ModuleHome = () => (
  <div className="mod-root flex w-full flex-col bg-white">
    <ModuleHero />
    <ModulePartners />
    <ModuleSolutions />
    <ModuleSimulator />
    <ModuleSteps />
    <ModuleWhy />
    <ModuleTestimonials />
    <ModuleTiles />
    <ModuleContact />
  </div>
);
