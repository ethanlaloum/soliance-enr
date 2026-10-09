import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { projectTypes } from '@/app/lead/domain/entities/StudyRequest';
import { submitStudyRequestRequested } from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import {
  selectSubmitStudyRequestError,
  selectSubmitStudyRequestLoading,
  selectSubmitStudyRequestSuccess,
} from '@/selectors/lead/leadSelectors';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useSpamTrap } from '@/hooks/useSpamTrap';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import { studyRequestDefaultValues, StudyRequestFormData, studyRequestSchema } from '@/components/home/studyRequestSchema';
import { LeadPrivacyNotice } from '@/components/page/LeadPrivacyNotice';

type TextFieldName = 'fullName' | 'phone' | 'email' | 'postalCode';

const textFields: { name: TextFieldName; type: string; autoComplete: string; inputMode?: 'tel' | 'email' | 'numeric' }[] = [
  { name: 'fullName', type: 'text', autoComplete: 'name' },
  { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', type: 'email', autoComplete: 'email', inputMode: 'email' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code', inputMode: 'numeric' },
];

type StudyRequestFormProps = {
  idPrefix?: string;
};

export const StudyRequestForm = ({ idPrefix = 'study' }: StudyRequestFormProps) => {
  const { t } = useTranslation('home');
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectSubmitStudyRequestLoading);
  const isSubmitted = useAppSelector(selectSubmitStudyRequestSuccess);
  const errorCode = useAppSelector(selectSubmitStudyRequestError);
  const { honeypotRef, readSpamTrap } = useSpamTrap();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyRequestFormData>({
    resolver: zodResolver(studyRequestSchema),
    defaultValues: studyRequestDefaultValues,
  });

  const onSubmit = (values: StudyRequestFormData) => {
    dispatch(
      submitStudyRequestRequested({
        form: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || null,
          postalCode: values.postalCode,
          projectType: values.projectType,
          monthlyBill: values.monthlyBill || null,
          callbackConsent: values.callbackConsent,
          consentText: t('contact.form.consent'),
          pageUri: window.location.href,
          pageName: document.title,
          spamTrap: readSpamTrap(),
        },
      }),
    );
  };

  const cardClassName = 'flex flex-col gap-3 rounded-2xl border border-sand-line bg-white p-[22px] lg:gap-4 lg:rounded-[20px] lg:p-9';

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h3 className="text-xl font-bold lg:text-[22px]">{t('contact.form.successTitle')}</h3>
        <p className="text-base text-slate-ink">{t('contact.form.successDescription')}</p>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby={`${idPrefix}-request-title`} onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <HoneypotField ref={honeypotRef} />
      <h3 id={`${idPrefix}-request-title`} className="text-xl font-bold lg:text-[22px]">
        {t('contact.form.title')}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:gap-3.5">
        {textFields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={fieldLabelClassName}>
              <label htmlFor={`${idPrefix}-${field.name}`}>{t(`contact.form.${field.name}`)}</label>
              <input
                id={`${idPrefix}-${field.name}`}
                type={field.type}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${idPrefix}-${field.name}-error` : undefined}
                className={fieldControlClassName}
                {...register(field.name)}
              />
              {error && (
                <p id={`${idPrefix}-${field.name}-error`} className={fieldErrorClassName}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={fieldLabelClassName}>
        <label id={`${idPrefix}-projectType-label`} htmlFor={`${idPrefix}-projectType`}>
          {t('contact.form.projectType')}
        </label>
        <Controller
          control={control}
          name="projectType"
          render={({ field }) => (
            <Select
              id={`${idPrefix}-projectType`}
              labelId={`${idPrefix}-projectType-label`}
              name={field.name}
              value={field.value}
              options={projectTypes.map((projectType) => ({ value: projectType, label: t(`contact.form.projectOptions.${projectType}`) }))}
              className={fieldControlClassName}
              ref={field.ref}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className={fieldLabelClassName}>
        <label htmlFor={`${idPrefix}-monthlyBill`}>{t('contact.form.monthlyBill')}</label>
        <input
          id={`${idPrefix}-monthlyBill`}
          type="text"
          inputMode="decimal"
          placeholder={t('contact.form.monthlyBillPlaceholder')}
          aria-invalid={errors.monthlyBill ? true : undefined}
          aria-describedby={errors.monthlyBill ? `${idPrefix}-monthlyBill-error` : undefined}
          className={fieldControlClassName}
          {...register('monthlyBill')}
        />
        {errors.monthlyBill && (
          <p id={`${idPrefix}-monthlyBill-error`} className={fieldErrorClassName}>
            {errors.monthlyBill.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id={`${idPrefix}-callbackConsent`}
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? `${idPrefix}-callbackConsent-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-solar"
            {...register('callbackConsent')}
          />
          <label htmlFor={`${idPrefix}-callbackConsent`} className="text-[13px] leading-[1.4] text-slate-ink">
            {t('contact.form.consent')}
          </label>
        </div>
        {errors.callbackConsent && (
          <p id={`${idPrefix}-callbackConsent-error`} className={fieldErrorClassName}>
            {errors.callbackConsent.message}
          </p>
        )}
        <LeadPrivacyNotice />
      </div>

      {errorCode && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">{t('contact.form.errorTitle')}</p>
          <p>{t(`contact.form.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting}>
        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      </Button>
    </form>
  );
};
