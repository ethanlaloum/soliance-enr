import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useLeadSubmission } from '@/hooks/useLeadSubmission';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { Button } from '@/components/ui/button';
import { HorizonSelect } from '@/components/ui/Select';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import {
  professionalProjectTypes,
  professionalStudyDefaultValues,
  ProfessionalStudyFormData,
  professionalStudySchema,
} from '@/components/professionals/professionalStudySchema';
import { buildProfessionalLeadFields } from '@/components/professionals/professionalLeadFields';

type TextFieldName = 'company' | 'fullName' | 'jobTitle' | 'email' | 'phone' | 'surface' | 'postalCode';

type TextField = {
  name: TextFieldName;
  type: string;
  autoComplete: string;
  inputMode?: 'tel' | 'email' | 'numeric' | 'decimal';
  wide?: boolean;
};

const identityFields: TextField[] = [
  { name: 'company', type: 'text', autoComplete: 'organization', wide: true },
  { name: 'fullName', type: 'text', autoComplete: 'name' },
  { name: 'jobTitle', type: 'text', autoComplete: 'organization-title' },
  { name: 'email', type: 'email', autoComplete: 'work email', inputMode: 'email' },
  { name: 'phone', type: 'tel', autoComplete: 'work tel', inputMode: 'tel' },
];

const siteFields: TextField[] = [
  { name: 'surface', type: 'text', autoComplete: 'off', inputMode: 'decimal' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code', inputMode: 'numeric' },
];

const darkLabelClassName = cn(fieldLabelClassName, 'text-white');
const darkControlClassName = cn(fieldControlClassName, 'border-night-line bg-night-soft text-white focus:border-solar aria-[invalid=true]:border-red-400');
const darkErrorClassName = cn(fieldErrorClassName, 'text-red-300');
const cardClassName = 'hz-professional-form flex flex-col gap-3.5 rounded-[4px] bg-night p-6 text-white lg:rounded-[4px] lg:p-9';

export const ProfessionalStudyForm = () => {
  const { t } = useTranslation('professionals');
  const { submit, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.PROFESSIONAL_STUDY);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalStudyFormData>({
    resolver: zodResolver(professionalStudySchema),
    defaultValues: professionalStudyDefaultValues,
  });

  const onSubmit = (values: ProfessionalStudyFormData) => {
    submit(buildProfessionalLeadFields(values), values.callbackConsent, t('form.consent'));
  };

  const renderTextField = (field: TextField) => {
    const error = errors[field.name];
    const id = `pro-study-${field.name}`;
    return (
      <div key={field.name} className={cn(darkLabelClassName, field.wide && 'sm:col-span-2')}>
        <label htmlFor={id}>{t(`form.${field.name}`)}</label>
        <input
          id={id}
          type={field.type}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={darkControlClassName}
          {...register(field.name)}
        />
        {error && (
          <p id={`${id}-error`} className={darkErrorClassName}>
            {error.message}
          </p>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h2 id="pro-study-title" className="text-xl font-medium lg:text-[22px]">
          {t('form.successTitle')}
        </h2>
        <p className="text-base text-slate-light">{t('form.successDescription')}</p>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby="pro-study-title" onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <div className="flex flex-col gap-1.5">
        <h2 id="pro-study-title" className="text-xl font-medium lg:text-[22px]">
          {t('form.title')}
        </h2>
        <p className="text-sm text-slate-light">{t('form.lead')}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {identityFields.map(renderTextField)}

        <div className={cn(darkLabelClassName, 'sm:col-span-2')}>
          <label htmlFor="pro-study-projectType">{t('form.projectType')}</label>
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <HorizonSelect
                id="pro-study-projectType"
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                className={cn(darkControlClassName, 'px-3')}
                options={professionalProjectTypes.map((projectType) => ({
                  value: projectType,
                  label: t(`form.projectOptions.${projectType}`),
                }))}
              />
            )}
          />
        </div>

        {siteFields.map(renderTextField)}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id="pro-study-callbackConsent"
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? 'pro-study-callbackConsent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-solar"
            {...register('callbackConsent')}
          />
          <label htmlFor="pro-study-callbackConsent" className="text-[13px] leading-[1.4] text-slate-light">
            {t('form.consent')}
          </label>
        </div>
        <Link to={paths.privacy} className="ml-[30px] text-[13px] font-medium text-solar hover:text-white">
          {t('form.privacyLink')}
        </Link>
        {errors.callbackConsent && (
          <p id="pro-study-callbackConsent-error" className={darkErrorClassName}>
            {errors.callbackConsent.message}
          </p>
        )}
      </div>

      {errorCode && (
        <div role="alert" className="rounded-lg border border-red-300/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
          <p className="font-medium">{t('common:leadForm.errorTitle')}</p>
          <p>{t(`common:leadForm.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting} className="mt-1 h-[54px] text-[17px]">
        {isSubmitting ? t('common:leadForm.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};
