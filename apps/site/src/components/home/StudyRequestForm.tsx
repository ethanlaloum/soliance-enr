import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { projectTypes } from '@/app/lead/domain/entities/StudyRequest';
import { submitStudyRequestRequested } from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import {
  selectSubmitStudyRequestError,
  selectSubmitStudyRequestLoading,
  selectSubmitStudyRequestSuccess,
} from '@/selectors/lead/leadSelectors';
import { Button } from '@/components/ui/button';
import { HorizonSelect } from '@/components/ui/Select';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import { studyRequestDefaultValues, StudyRequestFormData, studyRequestSchema } from '@/components/home/studyRequestSchema';

type TextFieldName = 'fullName' | 'phone' | 'email' | 'postalCode';

const textFields: { name: TextFieldName; type: string; autoComplete: string; inputMode?: 'tel' | 'email' | 'numeric' }[] = [
  { name: 'fullName', type: 'text', autoComplete: 'name' },
  { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', type: 'email', autoComplete: 'email', inputMode: 'email' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code', inputMode: 'numeric' },
];

type StudyRequestFormProps = {
  cardClassName?: string;
  titleClassName?: string;
  submitClassName?: string;
};

const defaultCardClassName = 'flex flex-col gap-4 rounded-[20px] border border-sand-line bg-white p-6 lg:gap-5 lg:rounded-[28px] lg:p-12';
const defaultTitleClassName = 'text-2xl font-bold tracking-[-0.02em] lg:text-[28px]';
const defaultSubmitClassName = 'mt-1 text-night hover:bg-night hover:text-white';

export const StudyRequestForm = ({
  cardClassName = defaultCardClassName,
  titleClassName = defaultTitleClassName,
  submitClassName = defaultSubmitClassName,
}: StudyRequestFormProps) => {
  const { t } = useTranslation('home');
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectSubmitStudyRequestLoading);
  const isSubmitted = useAppSelector(selectSubmitStudyRequestSuccess);
  const errorCode = useAppSelector(selectSubmitStudyRequestError);

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
        },
      }),
    );
  };

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h3 className={titleClassName}>{t('contact.form.successTitle')}</h3>
        <p className="text-base text-slate-ink">{t('contact.form.successDescription')}</p>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby="study-request-title" onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <h3 id="study-request-title" className={titleClassName}>
        {t('contact.form.title')}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:gap-3.5">
        {textFields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={fieldLabelClassName}>
              <label htmlFor={`study-${field.name}`}>{t(`contact.form.${field.name}`)}</label>
              <input
                id={`study-${field.name}`}
                type={field.type}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `study-${field.name}-error` : undefined}
                className={fieldControlClassName}
                {...register(field.name)}
              />
              {error && (
                <p id={`study-${field.name}-error`} className={fieldErrorClassName}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={fieldLabelClassName}>
        <label htmlFor="study-projectType">{t('contact.form.projectType')}</label>
        <Controller
          name="projectType"
          control={control}
          render={({ field }) => (
            <HorizonSelect
              id="study-projectType"
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              className={cn(fieldControlClassName, 'px-3')}
              options={projectTypes.map((projectType) => ({ value: projectType, label: t(`contact.form.projectOptions.${projectType}`) }))}
            />
          )}
        />
      </div>

      <div className={fieldLabelClassName}>
        <label htmlFor="study-monthlyBill">{t('contact.form.monthlyBill')}</label>
        <input
          id="study-monthlyBill"
          type="text"
          inputMode="decimal"
          placeholder={t('contact.form.monthlyBillPlaceholder')}
          aria-invalid={errors.monthlyBill ? true : undefined}
          aria-describedby={errors.monthlyBill ? 'study-monthlyBill-error' : undefined}
          className={fieldControlClassName}
          {...register('monthlyBill')}
        />
        {errors.monthlyBill && (
          <p id="study-monthlyBill-error" className={fieldErrorClassName}>
            {errors.monthlyBill.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id="study-callbackConsent"
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? 'study-callbackConsent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-solar"
            {...register('callbackConsent')}
          />
          <label htmlFor="study-callbackConsent" className="text-[13px] leading-[1.4] text-slate-ink">
            {t('contact.form.consent')}
          </label>
        </div>
        <Link to={paths.privacy} className="ml-[30px] text-[13px] font-semibold text-solar hover:text-solar-dark">
          {t('contact.form.privacyLink')}
        </Link>
        {errors.callbackConsent && (
          <p id="study-callbackConsent-error" className={fieldErrorClassName}>
            {errors.callbackConsent.message}
          </p>
        )}
      </div>

      {errorCode && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">{t('contact.form.errorTitle')}</p>
          <p>{t(`contact.form.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting} className={submitClassName}>
        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      </Button>
    </form>
  );
};
