/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUBSPOT_PORTAL_ID?: string;
  readonly VITE_HUBSPOT_STUDY_REQUEST_FORM_ID?: string;
  readonly VITE_HUBSPOT_PROFESSIONAL_FORM_ID?: string;
  readonly VITE_HUBSPOT_REFERRAL_FORM_ID?: string;
  readonly VITE_HUBSPOT_SIMULATION_FORM_ID?: string;
  readonly VITE_HUBSPOT_CARE_FORM_ID?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
