import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useLeadSubmission } from '@/hooks/useLeadSubmission';
import { useSpamTrap } from '@/hooks/useSpamTrap';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { Button } from '@/components/ui/button';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import {
  portfolioRequestDefaultValues,
  PortfolioRequestFormData,
  portfolioRequestSchema,
} from '@/components/projects/portfolioRequestSchema';
import { buildPortfolioLeadFields } from '@/components/projects/portfolioLeadFields';
import { LeadPrivacyNotice } from '@/components/page/LeadPrivacyNotice';

type TextFieldName = 'firstName' | 'lastName' | 'email' | 'phone';

const textFields: { name: TextFieldName; type: string; autoComplete: string; inputMode?: 'tel' | 'email'; wide?: boolean }[] = [
  { name: 'firstName', type: 'text', autoComplete: 'given-name' },
  { name: 'lastName', type: 'text', autoComplete: 'family-name' },
  { name: 'email', type: 'email', autoComplete: 'email', inputMode: 'email', wide: true },
  { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel', wide: true },
];

const cardClassName = 'flex flex-col gap-3 rounded-2xl border border-sand-line bg-white p-[22px] lg:gap-4 lg:rounded-[20px] lg:p-9';

type PortfolioRequestFormProps = {
  idPrefix?: string;
};

export const PortfolioRequestForm = ({ idPrefix = 'portfolio' }: PortfolioRequestFormProps) => {
  const { t } = useTranslation('projects');
  const { submit, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.PORTFOLIO_REQUEST);
  const { honeypotRef, readSpamTrap } = useSpamTrap();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PortfolioRequestFormData>({
    resolver: zodResolver(portfolioRequestSchema),
    defaultValues: portfolioRequestDefaultValues,
  });

  const onSubmit = (values: PortfolioRequestFormData) => {
    submit(buildPortfolioLeadFields(values), values.callbackConsent, t('portfolioRequest.consent'), readSpamTrap());
  };

  if (isSubmitted) {
    return (
      <div role="status" className={cardClassName}>
        <h2 id={`${idPrefix}-form-title`} className="text-xl font-bold lg:text-[22px]">
          {t('portfolioRequest.successTitle')}
        </h2>
        <p className="text-base leading-normal text-slate-ink">{t('portfolioRequest.successDescription', { email: getValues('email').trim() })}</p>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby={`${idPrefix}-form-title`} onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <HoneypotField ref={honeypotRef} />
      <div className="flex flex-col gap-1.5">
        <h2 id={`${idPrefix}-form-title`} className="text-xl font-bold lg:text-[22px]">
          {t('portfolioRequest.title')}
        </h2>
        <p className="text-[15px] leading-normal text-slate-ink">{t('portfolioRequest.description')}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:gap-3.5">
        {textFields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={cn(fieldLabelClassName, field.wide && 'sm:col-span-2')}>
              <label htmlFor={`${idPrefix}-${field.name}`}>{t(`portfolioRequest.fields.${field.name}`)}</label>
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
            {t('portfolioRequest.consent')}
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
          <p className="font-bold">{t('common:leadForm.errorTitle')}</p>
          <p>{t(`common:leadForm.errors.${errorCode}`)}</p>
        </div>
      )}

      <Button type="submit" size="block" disabled={isSubmitting}>
        {isSubmitting ? t('common:leadForm.submitting') : t('portfolioRequest.submit')}
      </Button>
    </form>
  );
};
