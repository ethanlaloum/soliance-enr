import { createContext, useContext } from 'react';

export enum ContactFormKind {
  STUDY = 'STUDY',
  PROFESSIONAL = 'PROFESSIONAL',
  REFERRAL = 'REFERRAL',
}

export type ContactDialogControls = {
  open: (kind: ContactFormKind) => void;
};

export const ContactDialogContext = createContext<ContactDialogControls | null>(null);

export const useContactDialog = () => useContext(ContactDialogContext);

export const loadContactForm = {
  [ContactFormKind.STUDY]: () => import('@/components/home/StudyRequestForm').then((module) => ({ default: module.StudyRequestForm })),
  [ContactFormKind.PROFESSIONAL]: () =>
    import('@/components/professionals/ProfessionalStudyForm').then((module) => ({ default: module.ProfessionalStudyForm })),
  [ContactFormKind.REFERRAL]: () => import('@/components/referral/ReferralForm').then((module) => ({ default: module.ReferralForm })),
};

export const contactDialogIdPrefixes: Record<ContactFormKind, string> = {
  [ContactFormKind.STUDY]: 'dialog-study',
  [ContactFormKind.PROFESSIONAL]: 'dialog-pro-study',
  [ContactFormKind.REFERRAL]: 'dialog-referral',
};
