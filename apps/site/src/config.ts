import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { paths } from '@/routes/paths';

const readEnv = (value: string | undefined): string | null => (value && value.trim().length > 0 ? value.trim() : null);

export const config = {
  siteUrl: 'https://soliance.fr',
  careUrl: paths.care,
  carePhoneHref: 'tel:+33633251179',
  careEmail: 'technique@soliance-enr.fr',
  simulatorUrl: 'https://vesta.eco/simulateur/soliance',
  showroomMapUrl: 'https://www.google.com/maps/search/?api=1&query=30+avenue+du+G%C3%A9n%C3%A9ral+Leclerc+06700+Saint-Laurent-du-Var',
  salesPhoneHref: 'tel:+33763545144',
  adminPhoneHref: 'tel:+33659403888',
  referralPhoneHref: 'tel:+33608628471',
  googleSiteVerification: readEnv(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION),
  hubspot: {
    portalId: readEnv(import.meta.env.VITE_HUBSPOT_PORTAL_ID),
    studyRequestFormId: readEnv(import.meta.env.VITE_HUBSPOT_STUDY_REQUEST_FORM_ID),
    leadFormIds: {
      [LeadFormKind.PROFESSIONAL_STUDY]: readEnv(import.meta.env.VITE_HUBSPOT_PROFESSIONAL_FORM_ID),
      [LeadFormKind.REFERRAL]: readEnv(import.meta.env.VITE_HUBSPOT_REFERRAL_FORM_ID),
      [LeadFormKind.SIMULATION]: readEnv(import.meta.env.VITE_HUBSPOT_SIMULATION_FORM_ID),
      [LeadFormKind.CARE_REQUEST]: readEnv(import.meta.env.VITE_HUBSPOT_CARE_FORM_ID),
    },
  },
};
