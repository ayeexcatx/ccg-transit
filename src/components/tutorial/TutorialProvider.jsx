import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CircleHelp } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';
import TutorialWelcomeModal from './TutorialWelcomeModal';
import {
  COMPANY_OWNER_TUTORIAL_COMPLETED_KEY,
  COMPANY_OWNER_TUTORIAL_DISMISSED_KEY,
  companyOwnerTutorialSteps,
} from './tutorialConfig';

const TutorialContext = createContext({
  startTutorial: () => {},
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getVisibleRect = (selector) => {
  if (!selector) return null;
  const targets = Array.from(document.querySelectorAll(selector));
  const visible = targets.find((el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  });
  return visible?.getBoundingClientRect() || null;
};

export default function TutorialProvider({ session, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isCompanyOwner = session?.code_type === 'CompanyOwner';

  const [isRunning, setIsRunning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const totalSteps = companyOwnerTutorialSteps.length;
  const isCompletion = isRunning && stepIndex >= totalSteps;
  const currentStep = !isCompletion ? companyOwnerTutorialSteps[stepIndex] : null;

  const stopTutorial = useCallback(() => {
    setIsRunning(false);
    setTargetRect(null);
  }, []);

  const startTutorial = useCallback(() => {
    if (!isCompanyOwner) return;
    setShowWelcome(false);
    setStepIndex(0);
    setIsRunning(true);
  }, [isCompanyOwner]);

  const markCompleted = useCallback(() => {
    localStorage.setItem(COMPANY_OWNER_TUTORIAL_COMPLETED_KEY, 'true');
  }, []);

  const handleSkipForNow = useCallback(() => {
    setShowWelcome(false);
    stopTutorial();
  }, [stopTutorial]);

  const handleDismissPermanently = useCallback(() => {
    localStorage.setItem(COMPANY_OWNER_TUTORIAL_DISMISSED_KEY, 'true');
    setShowWelcome(false);
    stopTutorial();
  }, [stopTutorial]);

  const handleFinish = useCallback(() => {
    markCompleted();
    stopTutorial();
  }, [markCompleted, stopTutorial]);

  const handleStepChange = useCallback((nextIndex) => {
    setStepIndex(clamp(nextIndex, 0, totalSteps));
  }, [totalSteps]);

  const goToNextStep = useCallback(() => {
    if (isCompletion) {
      handleFinish();
      return;
    }
    handleStepChange(stepIndex + 1);
  }, [handleFinish, handleStepChange, isCompletion, stepIndex]);

  const goToPreviousStep = useCallback(() => {
    if (isCompletion) {
      handleStepChange(totalSteps - 1);
      return;
    }
    handleStepChange(stepIndex - 1);
  }, [handleStepChange, isCompletion, stepIndex, totalSteps]);

  useEffect(() => {
    if (!isCompanyOwner) {
      setShowWelcome(false);
      stopTutorial();
      return;
    }

    const dismissed = localStorage.getItem(COMPANY_OWNER_TUTORIAL_DISMISSED_KEY) === 'true';
    const completed = localStorage.getItem(COMPANY_OWNER_TUTORIAL_COMPLETED_KEY) === 'true';

    if (!dismissed && !completed) {
      setShowWelcome(true);
    }
  }, [isCompanyOwner, stopTutorial]);

  useEffect(() => {
    if (!isRunning || isCompletion || !currentStep?.page) return;
    if (location.pathname !== currentStep.page) {
      navigate(currentStep.page);
    }
  }, [currentStep?.page, isCompletion, isRunning, location.pathname, navigate]);

  useEffect(() => {
    if (!isRunning || isCompletion || !currentStep) return;

    let cancelled = false;
    let attempts = 0;

    const resolveTarget = () => {
      if (cancelled) return;
      const rect = getVisibleRect(currentStep.target);
      if (rect) {
        setTargetRect(rect);
        return;
      }

      attempts += 1;
      if (attempts >= 8) {
        handleStepChange(stepIndex + 1);
        return;
      }

      window.setTimeout(resolveTarget, 120);
    };

    window.setTimeout(resolveTarget, 80);

    return () => {
      cancelled = true;
    };
  }, [currentStep, handleStepChange, isCompletion, isRunning, stepIndex]);

  useEffect(() => {
    if (!isRunning || isCompletion) return;

    const updatePosition = () => {
      const rect = getVisibleRect(currentStep?.target);
      if (rect) setTargetRect(rect);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep?.target, isCompletion, isRunning]);

  const tooltipStyle = useMemo(() => {
    if (isCompletion || !targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const margin = 16;
    const top = clamp(targetRect.bottom + 14, margin, window.innerHeight - 230);
    const left = clamp(targetRect.left, margin, window.innerWidth - 400);
    return { top: `${top}px`, left: `${left}px` };
  }, [isCompletion, targetRect]);

  const value = useMemo(() => ({ startTutorial }), [startTutorial]);

  return (
    <TutorialContext.Provider value={value}>
      {children}

      {isCompanyOwner && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={startTutorial}
          className="fixed bottom-5 right-5 z-[180] shadow-lg"
        >
          <CircleHelp className="mr-1 h-4 w-4" />
          Tutorial
        </Button>
      )}

      <TutorialWelcomeModal
        open={showWelcome}
        onStart={startTutorial}
        onSkip={handleSkipForNow}
        onDismiss={handleDismissPermanently}
      />

      <TutorialOverlay
        active={isRunning}
        targetRect={targetRect}
        tooltipStyle={tooltipStyle}
        step={isCompletion ? { title: "You're all set", description: 'You can replay this tutorial anytime using the Tutorial button.' } : currentStep}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        isCompletion={isCompletion}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onSkip={handleSkipForNow}
        onFinish={handleFinish}
        onReplay={startTutorial}
      />
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}
