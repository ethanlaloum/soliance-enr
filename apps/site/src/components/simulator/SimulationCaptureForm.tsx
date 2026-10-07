import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { paths } from '@/routes/paths';
import { useLeadSubmission } from '@/hooks/useLeadSubmission';
import { useSpamTrap } from '@/hooks/useSpamTrap';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { SolarEstimate } from '@/app/simulator/domain/entities/SolarEstimate';
import { SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';
import { buildSimulationLeadFields } from '@/app/simulator/domain/entities/SimulationLead';
import { Button } from '@/components/ui/button';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import { simulatorCaptureId } from '@/components/simulator/simulatorStyles';
import {
  SimulationCaptureFormData,
  simulationCaptureDefaultValues,
  simulationCaptureSchema,
} from '@/components/simulator/simulationCaptureSchema';

type ContactFieldName = 'email' | 'phone';

const contactFields: { name: ContactFieldName; type: string; autoComplete: string; inputMode: 'email' | 'tel' }[] = [
  { name: 'email', type: 'email', autoComplete: 'email', inputMode: 'email' },
  { name: 'phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
];

type SimulationCaptureFormProps = {
  answers: SimulatorAnswers;
  estimate: SolarEstimate;
};

const cardClassName = 'flex scroll-mt-24 flex-col gap-2.5 rounded-2xl border border-sand-line bg-white p-5 lg:p-6';

export const SimulationCaptureForm = ({ answers, estimate }: SimulationCaptureFormProps) => {
  const { t } = useTranslation('simulator');
  const { submit, isSubmitting, isSubmitted, errorCode } = useLeadSubmission(LeadFormKind.SIMULATION);
  const { honeypotRef, readSpamTrap } = useSpamTrap();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimulationCaptureFormData>({
    resolver: zodResolver(simulationCaptureSchema),
    defaultValues: simulationCaptureDefaultValues,
  });

  const onSubmit = (values: SimulationCaptureFormData) => {
    submit(
      buildSimulationLeadFields(answers, estimate, { email: values.email, phone: values.phone }),
      values.callbackConsent,
      t('capture.consent'),
      readSpamTrap(),
    );
  };

  if (isSubmitted) {
    return (
      <div id={simulatorCaptureId} role="status" className={cardClassName}>
        <h2 className="text-[17px] font-bold">{t('capture.successTitle')}</h2>
        <p className="text-sm leading-normal text-slate-ink">{t('capture.successDescription')}</p>
      </div>
    );
  }

  return (
    <form id={simulatorCaptureId} noValidate aria-labelledby="simulator-capture-title" onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
      <HoneypotField ref={honeypotRef} />
      <h2 id="simulator-capture-title" className="text-[17px] font-bold">
        {t('capture.title')}
      </h2>
      <p className="text-sm leading-normal text-slate-ink">{t('capture.description')}</p>

      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        {contactFields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={fieldLabelClassName}>
              <label htmlFor={`simulator-capture-${field.name}`}>{t(`capture.${field.name}`)}</label>
              <input
                id={`simulator-capture-${field.name}`}
                type={field.type}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `simulator-capture-${field.name}-error` : undefined}
                className={fieldControlClassName}
                {...register(field.name)}
              />
              {error && (
                <p id={`simulator-capture-${field.name}-error`} className={fieldErrorClassName}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-[46px] rounded-lg bg-night px-[18px] py-0 text-[15px] hover:bg-night-soft hover:shadow-soft sm:mt-[26px] sm:h-12"
        >
          {isSubmitting ? t('common:leadForm.submitting') : t('capture.submit')}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id="simulator-capture-callbackConsent"
            type="checkbox"
            aria-invalid={errors.callbackConsent ? true : undefined}
            aria-describedby={errors.callbackConsent ? 'simulator-capture-callbackConsent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-solar"
            {...register('callbackConsent')}
          />
          <label htmlFor="simulator-capture-callbackConsent" className="text-[13px] leading-[1.4] text-slate-ink">
            {t('capture.consent')}
          </label>
        </div>
        <Link to={paths.privacy} className="ml-[30px] text-[13px] font-semibold text-solar hover:text-solar-dark">
          {t('capture.privacyLink')}
        </Link>
        {errors.callbackConsent && (
          <p id="simulator-capture-callbackConsent-error" className={fieldErrorClassName}>
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
    </form>
  );
};
