import { useEffect } from 'react';
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
import {
  careRequestDefaultValues,
  CareRequestFormData,
  careRequestSchema,
  CareRequestType,
  careRequestTypes,
} from '@/components/care/careRequestSchema';
import { buildCareLeadFields } from '@/components/care/careLeadFields';

type TextFieldName = 'fullName' | 'phone' | 'postalCode' | 'email' | 'inverterBrand';

type TextField = {
  name: TextFieldName;
  type: string;
  autoComplete: string;
  inputMode?: 'tel' | 'email' | 'numeric';
  wide?: boolean;
};

const textFields: TextField[] = [
  { name: 'fullName', type: 'text', autoComplete: 'name', wide: true },
  { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code', inputMode: 'numeric' },
  { name: 'email', type: 'email', autoComplete: 'email', inputMode: 'email' },
  { name: 'inverterBrand', type: 'text', autoComplete: 'off' },
];

const controlClassName = cn(fieldControlClassName, 'border-care-line focus:border-care focus:ring-care/30');
const cardClassName = 'flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.06),0_16px_40px_rgba(15,42,31,0.1)] lg:p-9';

type CareRequestFormProps = {
  requestType: CareRequestType;
  onRequestTypeChange: (requestType: CareRequestType) => void;
};

export const CareRequestForm = ({ requestType, onRequestTypeChange }: CareRequestFormProps) => {
  const { t } = useTranslation('care');
  const { submit, reset: resetSubmission, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.CARE_REQUEST);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CareRequestFormData>({
    resolver: zodResolver(careRequestSchema),
    defaultValues: { ...careRequestDefaultValues, requestType },
  });

  useEffect(() => {
    setValue('requestType', requestType);
    resetSubmission();
  }, [requestType, setValue, resetSubmission]);

  const onSubmit = (values: CareRequestFormData) => {
    submit(buildCareLeadFields(values), values.callbackConsent, t('form.consent'));
  };

  const startAnotherRequest = () => {
    reset({ ...careRequestDefaultValues, requestType });
    resetSubmission();
  };

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h3 id="care-request-form-title" className="text-xl font-bold lg:text-2xl">
          {t('form.successTitle')}
        </h3>
        <p className="text-base text-care-muted">{t('form.successDescription')}</p>
        <button type="button" onClick={startAnotherRequest} className="self-start text-[15px] font-bold text-care hover:text-care-deep">
          {t('form.another')}
        </button>
      </div>
    );
  }

  const renderTextField = (field: TextField) => {
    const error = errors[field.name];
    const id = `care-request-${field.name}`;
    return (
      <div key={field.name} className={cn(fieldLabelClassName, 'text-care-ink', field.wide && 'sm:col-span-2')}>
        <label htmlFor={id}>{t(`form.${field.name}`)}</label>
        <input
          id={id}
          type={field.type}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={controlClassName}
          {...register(field.name)}
        />
        {error && (
          <p id={`${id}-error`} className={fieldErrorClassName}>
            {error.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate aria-labelledby="care-request-form-title" onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <div className="flex flex-col gap-1">
        <h3 id="care-request-form-title" className="text-xl font-bold lg:text-2xl">
          {t('form.title')}
        </h3>
        <p className="text-sm text-care-muted lg:text-[15px]">{t('form.lead')}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className={cn(fieldLabelClassName, 'text-care-ink sm:col-span-2')}>
          <label htmlFor="care-request-requestType">{t('form.interest')}</label>
          <select
            id="care-request-requestType"
            className={cn(controlClassName, 'bg-care-chip px-3')}
            {...register('requestType', { onChange: (event) => onRequestTypeChange(event.target.value as CareRequestType) })}
          >
            {careRequestTypes.map((type) => (
              <option key={type} value={type}>
                {t(`form.interests.${type}`)}
              </option>
            ))}
          </select>
        </div>

        {textFields.map(renderTextField)}

        <div className={cn(fieldLabelClassName, 'text-care-ink sm:col-span-2')}>
          <label htmlFor="care-request-situation">{t('form.situation')}</label>
          <textarea
            id="care-request-situation"
            rows={3}
            placeholder={t('form.situationHint')}
            aria-invalid={errors.situation ? true : undefined}
            aria-describedby={errors.situation ? 'care-request-situation-error' : undefined}
            className={cn(controlClassName, 'h-auto py-3 placeholder:text-care-muted/70 sm:h-auto')}
            {...register('situation')}
          />
          {errors.situation && (
            <p id="care-request-situation-error" className={fieldErrorClassName}>
              {errors.situation.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id="care-request-callbackConsent"
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? 'care-request-callbackConsent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-care"
            {...register('callbackConsent')}
          />
          <label htmlFor="care-request-callbackConsent" className="text-[13px] leading-[1.4] text-care-muted">
            {t('form.consent')}
          </label>
        </div>
        <Link to={paths.privacy} className="ml-[30px] text-[13px] font-semibold text-care hover:text-care-deep">
          {t('form.privacyLink')}
        </Link>
        {errors.callbackConsent && (
          <p id="care-request-callbackConsent-error" className={fieldErrorClassName}>
            {errors.callbackConsent.message}
          </p>
        )}
      </div>

      {errorCode && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">{t('form.errorTitle')}</p>
          <p>{t(`form.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting} className="mt-1 h-[54px] text-[17px]">
        {isSubmitting ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};
