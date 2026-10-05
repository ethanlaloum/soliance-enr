import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { HorizonSelect } from '@/components/ui/Select';
import { HorizonArrow } from '@/components/home/designs/horizon/HorizonParts';
import { useLeadSubmission } from '@/hooks/useLeadSubmission';
import { config } from '@/config';
import { buildCareLeadFields, careDefaultValues, careInterests, careRequestSchema, type CareInterest, type CareRequestData } from './careRequestSchema';

const fields = [
  { name: 'fullName', type: 'text', autoComplete: 'name' },
  { name: 'phone', type: 'tel', autoComplete: 'tel' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code' },
  { name: 'email', type: 'email', autoComplete: 'email' },
] as const;

export const CareRequestForm = ({ interest, onInterestChange }: { interest: CareInterest; onInterestChange: (interest: CareInterest) => void }) => {
  const { t } = useTranslation('care');
  const { submit, reset: resetSubmission, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.CARE_REQUEST);
  const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CareRequestData>({ resolver: zodResolver(careRequestSchema), defaultValues: careDefaultValues });
  useEffect(() => { setValue('interest', interest); resetSubmission(); }, [interest, setValue, resetSubmission]);

  if (isSubmitted) return <div className="care-form care-form-success" role="status"><h3>{t('form.successTitle')}</h3><p>{t('form.successBody')}</p><button type="button" className="hz-text-link" onClick={() => { reset({ ...careDefaultValues, interest }); resetSubmission(); }}>{t('form.another')}<HorizonArrow /></button></div>;

  return (
    <form className="care-form" aria-labelledby="care-form-title" noValidate onSubmit={handleSubmit((values) => submit(buildCareLeadFields(values), values.callbackConsent, t('form.consent')))}>
      <h3 id="care-form-title">{t('form.title')}</h3><p className="care-form-lead">{t('form.lead')}</p>
      <div className="care-form-grid">
        {fields.map(({ name, type, autoComplete }) => <div className="care-field" key={name}>
          <label htmlFor={`care-${name}`}>{t(`form.${name}`)}</label>
          <input id={`care-${name}`} type={type} autoComplete={autoComplete} inputMode={name === 'postalCode' ? 'numeric' : undefined} aria-required={name !== 'email'} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `care-${name}-error` : undefined} {...register(name)} />
          {errors[name] && <p className="care-field-error" id={`care-${name}-error`}>{errors[name]?.message}</p>}
        </div>)}
        <div className="care-field">
          <label htmlFor="care-interest">{t('form.interest')}</label>
          <Controller
            name="interest"
            control={control}
            render={({ field }) => (
              <HorizonSelect
                id="care-interest"
                name={field.name}
                value={field.value}
                onValueChange={(value) => { field.onChange(value); onInterestChange(value as CareInterest); }}
                onBlur={field.onBlur}
                ref={field.ref}
                options={careInterests.map((value) => ({ value, label: t(`form.options.${value}`) }))}
              />
            )}
          />
        </div>
        <div className="care-field"><label htmlFor="care-brand">{t('form.brand')}</label><input id="care-brand" type="text" autoComplete="off" {...register('brand')} /></div>
        <div className="care-field care-field-wide"><label htmlFor="care-situation">{t('form.situation')}</label><textarea id="care-situation" rows={3} placeholder={t('form.situationHint')} aria-invalid={!!errors.situation} aria-describedby={errors.situation ? 'care-situation-error' : undefined} {...register('situation')} />{errors.situation && <p className="care-field-error" id="care-situation-error">{errors.situation.message}</p>}</div>
      </div>
      <div className="care-consent"><input id="care-consent" type="checkbox" aria-required="true" aria-invalid={!!errors.callbackConsent} aria-describedby={errors.callbackConsent ? 'care-consent-error' : undefined} {...register('callbackConsent')} /><label htmlFor="care-consent">{t('form.consent')}</label></div>
      {errors.callbackConsent && <p id="care-consent-error" className="care-field-error">{errors.callbackConsent.message}</p>}
      <p className="care-privacy">{t('form.privacy')}</p>
      {errorCode && <div className="care-form-error" role="alert"><p>{t('form.error')}</p><a href={`mailto:${config.careEmail}`}>{config.careEmail}</a></div>}
      <button className="hz-button" type="submit" disabled={isSubmitting}>{t(isSubmitting ? 'form.submitting' : 'form.submit')}<HorizonArrow diagonal /></button>
    </form>
  );
};
