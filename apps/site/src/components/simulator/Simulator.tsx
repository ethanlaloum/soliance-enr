import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { cn } from '@/lib/utils';
import { cumulativeSavingsEur, panelCountRange, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import {
  consumptionSourceOf,
  effectiveRoofTilt,
  geocodedAnswersPatch,
  initialSimulatorAnswers,
  nextSimulatorStep,
  previewSolarEstimate,
  previewTypicalDay,
  previousSimulatorStep,
  SimulatorAnswers,
  SimulatorStep,
  validateSimulatorStep,
} from '@/app/simulator/domain/entities/SimulatorWizard';
import { containerClassName } from '@/components/home/containerClassName';
import { PanelCountField } from '@/components/simulator/controls/PanelCountField';
import { ShadingField } from '@/components/simulator/controls/ShadingField';
import { EstimatePanel } from '@/components/simulator/EstimatePanel';
import { HousePreviewCard } from '@/components/simulator/HousePreviewCard';
import { loadHouseCanvas } from '@/components/simulator/house/houseCanvasLoader';
import { ResultDashboard } from '@/components/simulator/ResultDashboard';
import { SimulationCaptureForm } from '@/components/simulator/SimulationCaptureForm';
import { SimulatorHeader } from '@/components/simulator/SimulatorHeader';
import { SimulatorResultCard } from '@/components/simulator/SimulatorResultCard';
import { SimulatorStepForm } from '@/components/simulator/SimulatorStepForm';
import { simulatorCardClassName, simulatorStepTitleId } from '@/components/simulator/simulatorStyles';
import { TuneEstimatePanel } from '@/components/simulator/TuneEstimatePanel';
import { useCommuneSolarYield } from '@/hooks/useCommuneSolarYield';
import { useAppSelector } from '@/store/redux';
import { selectAddressSuggestions } from '@/selectors/address/addressSelectors';

const loadSolarYieldMap = () => import('@/components/simulator/SolarYieldMap');

const SolarYieldMap = lazy(() => loadSolarYieldMap().then((module) => ({ default: module.SolarYieldMap })));

const mapPlaceholderClassName = cn(simulatorCardClassName, 'min-h-[420px] lg:min-h-[640px]');

const stepTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] } as const;

const pinnedCardClassName =
  '[@media(max-width:1023px)_and_(min-height:640px)]:sticky [@media(max-width:1023px)_and_(min-height:640px)]:top-[calc(var(--site-header-height)+8px)] [@media(max-width:1023px)_and_(min-height:640px)]:z-20';

export const Simulator = () => {
  const [step, setStep] = useState<SimulatorStep>(SimulatorStep.ADDRESS);
  const [answers, setAnswers] = useState<SimulatorAnswers>(initialSimulatorAnswers);
  const [showsErrors, setShowsErrors] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const hasNavigated = useRef(false);
  const displayedStep = useRef(step);

  const suggestions = useAppSelector(selectAddressSuggestions);
  const communeYield = useCommuneSolarYield(answers.location);

  const errors = showsErrors ? validateSimulatorStep(step, answers) : {};
  const preview = useMemo(() => previewSolarEstimate(answers, step, communeYield), [answers, step, communeYield]);
  const isResultStep = step === SimulatorStep.RESULT;
  const consumptionIsComplete = Object.keys(validateSimulatorStep(SimulatorStep.CONSUMPTION, answers)).length === 0;
  const showsCapture = (step === SimulatorStep.CONSUMPTION && consumptionIsComplete) || isResultStep;
  const hasStartedAddress = answers.address.trim() !== '';

  const typicalDays = useMemo(() => {
    if (!isResultStep) return null;
    const summer = previewTypicalDay(answers, step, 6, communeYield);
    const winter = previewTypicalDay(answers, step, 0, communeYield);
    return summer && winter ? { summer, winter } : null;
  }, [answers, step, communeYield, isResultStep]);

  const cumulativeEur = useMemo(
    () =>
      preview
        ? cumulativeSavingsEur(preview.estimate.annualSavingsEur, {
            years: answers.projectionYears,
            priceTrendPercent: answers.priceTrendPercent,
            degradationPercent: solarEstimateParameters.savingsProjection.degradationPercent,
          })
        : [],
    [preview, answers.projectionYears, answers.priceTrendPercent],
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasStartedAddress) void loadHouseCanvas();
  }, [hasStartedAddress]);

  const focusStepTitle = (enteredStep: SimulatorStep) => {
    if (hasNavigated.current && enteredStep === displayedStep.current) document.getElementById(simulatorStepTitleId)?.focus();
  };

  const changeAnswers = (patch: Partial<SimulatorAnswers>) => setAnswers((current) => ({ ...current, ...patch }));

  const goTo = (target: SimulatorStep) => {
    hasNavigated.current = true;
    displayedStep.current = target;
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
    if (step === SimulatorStep.ADDRESS) {
      const geocoded = geocodedAnswersPatch(answers, suggestions);
      if (geocoded) changeAnswers(geocoded);
    }
    goTo(nextSimulatorStep(step));
  };

  const goBack = () => goTo(previousSimulatorStep(step));

  const roof = { areaM2: answers.roofAreaM2, orientation: answers.orientation, tilt: effectiveRoofTilt(answers) };

  return (
    <MotionConfig reducedMotion="user">
      <SimulatorHeader step={step} />
      <div className={cn(containerClassName, 'pb-10 lg:pb-16')}>
        <div className="grid items-start gap-5 motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="flex flex-col gap-5 lg:contents">
            {preview && (
              <HousePreviewCard
                answers={answers}
                estimate={preview.estimate}
                isPinned={!isResultStep}
                className={cn('lg:col-start-2 lg:row-start-1', !isResultStep && pinnedCardClassName)}
              />
            )}
            <div className={cn(preview && 'lg:col-start-1 lg:row-span-2 lg:row-start-1')}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={stepTransition}
                  onAnimationComplete={() => focusStepTitle(step)}
                  className="flex flex-col gap-5"
                >
                  {isResultStep && preview ? (
                    <>
                      <SimulatorResultCard estimate={preview.estimate} consumptionSource={consumptionSourceOf(answers)} onBack={goBack} />
                      <TuneEstimatePanel
                        batteryKwh={answers.batteryKwh}
                        recommendedBatteryKwh={preview.estimate.recommendedBatteryKwh}
                        kwhPriceEur={answers.kwhPriceEur}
                        priceTrendPercent={answers.priceTrendPercent}
                        projectionYears={answers.projectionYears}
                        onChange={changeAnswers}
                      >
                        <PanelCountField
                          id="simulator-tune-panelCount"
                          panelCount={preview.estimate.panelCount}
                          installedKwc={preview.estimate.installedKwc}
                          recommendedPanelCount={preview.estimate.recommendedPanelCount}
                          recommendedKwc={preview.estimate.recommendedKwc}
                          isCustom={answers.panelCount !== null}
                          range={panelCountRange(roof)}
                          onChange={(panelCount) => changeAnswers({ panelCount })}
                        />
                        <ShadingField value={answers.shading} onChange={(shading) => changeAnswers({ shading })} />
                      </TuneEstimatePanel>
                    </>
                  ) : (
                    <SimulatorStepForm
                      step={step}
                      answers={answers}
                      estimate={preview?.estimate ?? null}
                      errors={errors}
                      onChange={changeAnswers}
                      onBack={goBack}
                      onNext={goNext}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className={cn('flex flex-col gap-4', preview && 'lg:col-start-2')}>
            {step === SimulatorStep.ADDRESS ? (
              hasMounted ? (
                <Suspense fallback={<div aria-hidden="true" className={mapPlaceholderClassName} />}>
                  <SolarYieldMap postalCode={answers.postalCode} location={answers.location} city={answers.city} communeYield={communeYield} />
                </Suspense>
              ) : (
                <div aria-hidden="true" className={mapPlaceholderClassName} />
              )
            ) : isResultStep && preview ? (
              <ResultDashboard estimate={preview.estimate} typicalDays={typicalDays} cumulativeEur={cumulativeEur} projectionYears={answers.projectionYears} />
            ) : (
              <EstimatePanel preview={preview} isFinal={isResultStep} />
            )}
            {showsCapture && preview && (
              <div className={isResultStep ? undefined : 'hidden lg:block'}>
                <SimulationCaptureForm answers={answers} estimate={preview.estimate} sunshine={preview.sunshine} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};
