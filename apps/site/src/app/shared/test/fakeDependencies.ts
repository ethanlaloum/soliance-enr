import { Dependencies } from '@/store/dependencies.interface';

export const fakeDependencies = (overrides: Partial<Dependencies>): Dependencies => overrides as Dependencies;
