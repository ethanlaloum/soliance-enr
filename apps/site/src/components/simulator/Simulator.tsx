import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  initialSimulatorAnswers,
  nextSimulatorStep,
  previewSolarEstimate,
  previousSimulatorStep,
  SimulatorAnswers,
  SimulatorStep,
  validateSimulatorStep,
} from '@/app/simulator/domain/entities/SimulatorWizard';
import { containerClassName } from '@/components/home/containerClassName';
import { EstimatePanel } from '@/components/simulator/EstimatePanel';
import { SimulationCaptureForm } from '@/components/simulator/SimulationCaptureForm';
import { SimulatorHeader } from '@/components/simulator/SimulatorHeader';
import { SimulatorResultCard } from '@/components/simulator/SimulatorResultCard';
import { SimulatorStepForm } from '@/components/simulator/SimulatorStepForm';
import { simulatorCardClassName, simulatorStepTitleId } from '@/components/simulator/simulatorStyles';

const loadSolarYieldMap = () => import('@/components/simulator/SolarYieldMap');

const SolarYieldMap = lazy(() => loadSolarYieldMap().then((module) => ({ default: module.SolarYieldMap })));

const mapPlaceholderClassName = cn(simulatorCardClassName, 'min-h-[420px] lg:min-h-[640px]');

export const Simulator = () => {
  const [step, setStep] = useState<SimulatorStep>(SimulatorStep.ADDRESS);
  const [answers, setAnswers] = useState<SimulatorAnswers>(initialSimulatorAnswers);
  const [showsErrors, setShowsErrors] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const hasNavigated = useRef(false);

  const errors = showsErrors ? validateSimulatorStep(step, answers) : {};
  const preview = previewSolarEstimate(answers, step);
  const isResultStep = step === SimulatorStep.RESULT;
  const showsCapture = step === SimulatorStep.CONSUMPTION || isResultStep;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasNavigated.current) return;
    document.getElementById(simulatorStepTitleId)?.focus();
  }, [step]);

  const changeAnswers = (patch: Partial<SimulatorAnswers>) => setAnswers((current) => ({ ...current, ...patch }));

  const goTo = (target: SimulatorStep) => {
    hasNavigated.current = true;
    setShowsErrors(false);
    setStep(target);
  };

  const goNext = () => {
    const [firstInvalidField] = Object.keys(validateSimulatorStep(step, answers));
    if (firstInvalidField) {
      setShowsErrors(true);
      document.getElementById(`simulator-${firstInvalidField}`)?.focus();
      return;
    }
    goTo(nextSimulatorStep(step));
  };

  const goBack = () => goTo(previousSimulatorStep(step));

  return (
    <>
      <SimulatorHeader step={step} />
      <div className={cn(containerClassName, 'pb-10 lg:pb-16')}>
        <div className="grid items-start gap-5 motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {isResultStep && preview ? (
            <SimulatorResultCard estimate={preview.estimate} onBack={goBack} />
          ) : (
            <SimulatorStepForm step={step} answers={answers} errors={errors} onChange={changeAnswers} onBack={goBack} onNext={goNext} />
          )}
          <div className="flex flex-col gap-4">
            {step === SimulatorStep.ADDRESS ? (
              hasMounted ? (
                <Suspense fallback={<div aria-hidden="true" className={mapPlaceholderClassName} />}>
                  <SolarYieldMap postalCode={answers.postalCode} location={answers.location} />
                </Suspense>
              ) : (
                <div aria-hidden="true" className={mapPlaceholderClassName} />
              )
            ) : (
              <EstimatePanel preview={preview} isFinal={isResultStep} />
            )}
            {showsCapture && preview && (
              <div className={isResultStep ? undefined : 'hidden lg:block'}>
                <SimulationCaptureForm answers={answers} estimate={preview.estimate} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
