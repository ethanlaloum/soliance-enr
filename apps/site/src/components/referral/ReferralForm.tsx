import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useLeadSubmission } from '@/hooks/useLeadSubmission';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { Button } from '@/components/ui/button';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import { toReferralLeadFields } from '@/components/referral/referralLeadFields';
import { referralDefaultValues, ReferralFormData, referralSchema, refereeProjects } from '@/components/referral/referralSchema';

type TextFieldName = 'referrerFullName' | 'referrerContact' | 'refereeFullName' | 'refereePhone';

const textFields: { name: TextFieldName; type: string; autoComplete?: string; inputMode?: 'tel' }[] = [
  { name: 'referrerFullName', type: 'text', autoComplete: 'name' },
  { name: 'referrerContact', type: 'text' },
  { name: 'refereeFullName', type: 'text', autoComplete: 'off' },
  { name: 'refereePhone', type: 'tel', autoComplete: 'off', inputMode: 'tel' },
];

const cardClassName = 'flex flex-col gap-3 rounded-2xl border border-sand-line bg-white p-[22px] lg:gap-4 lg:rounded-[20px] lg:p-9';

export const ReferralForm = () => {
  const { t } = useTranslation('referral');
  const { submit, reset: resetSubmission, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.REFERRAL);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: referralDefaultValues,
  });

  const onSubmit = (values: ReferralFormData) => {
    submit(toReferralLeadFields(values), values.callbackConsent, t('form.consent'));
  };

  const referAnother = () => {
    reset({
      ...referralDefaultValues,
      referrerFullName: getValues('referrerFullName'),
      referrerContact: getValues('referrerContact'),
    });
    resetSubmission();
  };

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h2 className="text-xl font-bold lg:text-[22px]">{t('form.successTitle')}</h2>
        <p className="text-base leading-normal text-slate-ink">{t('form.successDescription')}</p>
        <button type="button" onClick={referAnother} className="self-start text-[15px] font-semibold text-solar transition-colors hover:text-solar-dark">
          {t('form.referAnother')}
        </button>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby="referral-form-title" onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <h2 id="referral-form-title" className="text-xl font-bold lg:text-[22px]">
        {t('form.title')}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:gap-3.5">
        {textFields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={fieldLabelClassName}>
              <label htmlFor={`referral-${field.name}`}>{t(`form.fields.${field.name}`)}</label>
              <input
                id={`referral-${field.name}`}
                type={field.type}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `referral-${field.name}-error` : undefined}
                className={fieldControlClassName}
                {...register(field.name)}
              />
              {error && (
                <p id={`referral-${field.name}-error`} className={fieldErrorClassName}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={fieldLabelClassName}>
        <label htmlFor="referral-refereeProject">{t('form.fields.refereeProject')}</label>
        <select id="referral-refereeProject" className={cn(fieldControlClassName, 'px-3')} {...register('refereeProject')}>
          {refereeProjects.map((project) => (
            <option key={project} value={project}>
              {t(`form.projectOptions.${project}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id="referral-callbackConsent"
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? 'referral-callbackConsent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-solar"
            {...register('callbackConsent')}
          />
          <label htmlFor="referral-callbackConsent" className="text-[13px] leading-[1.4] text-slate-ink">
            {t('form.consent')}
          </label>
        </div>
        <Link to={paths.privacy} className="ml-[30px] text-[13px] font-semibold text-solar hover:text-solar-dark">
          {t('form.privacyLink')}
        </Link>
        {errors.callbackConsent && (
          <p id="referral-callbackConsent-error" className={fieldErrorClassName}>
            {errors.callbackConsent.message}
          </p>
        )}
      </div>

      {errorCode && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">{t('common:leadForm.errorTitle')}</p>
          <p>{t(`common:leadForm.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting}>
        {isSubmitting ? t('common:leadForm.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};
