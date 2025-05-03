import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from '../components/form/BasicInfoForm';
import AcademicsForm from '../components/form/AcademicsForm';
import CollegeGoalsForm from '../components/form/CollegeGoalsForm';
import { ActivitiesForm } from '../components/form/ActivitiesForm';
import { PersonalInsightsForm } from '../components/form/PersonalInsightsForm';
import { useForm } from '../context/FormContext';

const steps = [
  { id: 'basic-info', title: 'Basic Information', component: BasicInfoForm },
  { id: 'academics', title: 'Academic Information', component: AcademicsForm },
  { id: 'college-goals', title: 'College Goals', component: CollegeGoalsForm },
  { id: 'activities', title: 'Activities & Involvement', component: ActivitiesForm },
  { id: 'personal-insights', title: 'Personal Insights', component: PersonalInsightsForm },
];

function FormPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    // Try to get saved step from localStorage
    const savedStep = localStorage.getItem('currentFormStep');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  
  const navigate = useNavigate();
  const { state } = useForm();

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentFormStep', currentStepIndex.toString());
  }, [currentStepIndex]);

  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;

  const validateCurrentStep = () => {
    const result = (() => {
      switch (currentStep.id) {
        case 'basic-info':
          return state.basicInfo.fullName && state.basicInfo.email;
        case 'academics':
          return state.academics.classRank && state.academics.subjects.length > 0;
        case 'college-goals':
          return state.collegeGoals.collegeTypes.length > 0;
        case 'activities':
        case 'personal-insights':
          // These sections are optional, so always return true
          return true;
        default:
          return true;
      }
    })();
    console.log('Validation result:', result);
    return result;
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      navigate('/essay-type');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const canProceed = validateCurrentStep();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <CurrentStepComponent onNext={handleNext} onBack={handleBack} isStandalone={false} />
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`btn ${
              currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } btn-secondary`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className={`btn ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''} btn-primary`}
          >
            {isLastStep ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormPage; 