import { describe, expect, it } from 'vitest';
import { ProfessionalProjectType, ProfessionalStudyFormData } from '@/components/professionals/professionalStudySchema';
import { buildProfessionalLeadFields } from '@/components/professionals/professionalLeadFields';

const formValues: ProfessionalStudyFormData = {
  company: ' Logistique Azur ',
  fullName: ' Claire Martin ',
  jobTitle: ' Directrice technique ',
  email: ' claire.martin@logistique-azur.fr ',
  phone: '06 12.34-56 78',
  projectType: ProfessionalProjectType.PARKING_CARPORT,
  surface: '2 400,5',
  postalCode: ' 06700 ',
  callbackConsent: true,
};

describe('Professional study lead fields', () => {
  it('maps the form to trimmed snake_case lead fields with a compact phone and surface', () => {
    expect(buildProfessionalLeadFields(formValues)).toEqual({
      company: 'Logistique Azur',
      full_name: 'Claire Martin',
      job_title: 'Directrice technique',
      email: 'claire.martin@logistique-azur.fr',
      phone: '0612345678',
      project_type: 'PARKING_CARPORT',
      surface_m2: '2400.5',
      zip: '06700',
    });
  });

  it('keeps an international phone prefix and a whole surface unchanged', () => {
    expect(buildProfessionalLeadFields({ ...formValues, phone: '+33 7 63 54 51 44', surface: '850' })).toEqual({
      company: 'Logistique Azur',
      full_name: 'Claire Martin',
      job_title: 'Directrice technique',
      email: 'claire.martin@logistique-azur.fr',
      phone: '+33763545144',
      project_type: 'PARKING_CARPORT',
      surface_m2: '850',
      zip: '06700',
    });
  });
});
