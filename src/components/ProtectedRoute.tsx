import React from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredStep: 'form' | 'essay-type' | 'topics' | 'followup' | 'result';
}

export function ProtectedRoute({ children, requiredStep }: ProtectedRouteProps) {
  const { state } = useForm();
  
  const isStepComplete = () => {
    switch (requiredStep) {
      case 'form':
        return state.basicInfo.fullName && state.academics.classRank && state.collegeGoals.collegeTypes.length > 0;
      case 'essay-type':
        return state.basicInfo.fullName && state.academics.classRank && state.collegeGoals.collegeTypes.length > 0;
      case 'topics':
        return state.selectedTopic !== null;
      case 'followup':
        return state.selectedTopic !== null;
      case 'result':
        return Object.keys(state.followUpResponses).length > 0;
      default:
        return true;
    }
  };

  if (!isStepComplete()) {
    return <Navigate to="/form" replace />;
  }

  return <>{children}</>;
} 