import { ReactNode } from 'react';

export const Responsive = ({ mobile, desktop }: { mobile: ReactNode; desktop: ReactNode }) => (
  <>
    <span className="lg:hidden">{mobile}</span>
    <span className="hidden lg:inline">{desktop}</span>
  </>
);
