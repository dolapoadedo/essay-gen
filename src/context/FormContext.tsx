import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FormState {
  basicInfo: {
    fullName: string;
    email: string;
  };
  academics: {
    classRank: string;
    gpa: string;
    subjects: string[];
    majors: string[];
  };
  collegeGoals: {
    collegeTypes: string[];
    specificColleges: string[];
  };
  activities: {
    extracurriculars: string[];
    volunteerWork: string;
  };
  personal: {
    challenge: string;
    values: string[];
    background: string;
  };
  selectedTopic: {
    prompt: string;
    idea: string;
  } | null;
  followUpResponses: Record<string, string>;
}

type FormAction =
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<FormState['basicInfo']> }
  | { type: 'UPDATE_ACADEMICS'; payload: Partial<FormState['academics']> }
  | { type: 'UPDATE_COLLEGE_GOALS'; payload: Partial<FormState['collegeGoals']> }
  | { type: 'UPDATE_ACTIVITIES'; payload: Partial<FormState['activities']> }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<FormState['personal']> }
  | { type: 'SET_SELECTED_TOPIC'; payload: FormState['selectedTopic'] }
  | { type: 'UPDATE_FOLLOW_UP_RESPONSES'; payload: Record<string, string> }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  basicInfo: {
    fullName: '',
    email: '',
  },
  academics: {
    classRank: '',
    gpa: '',
    subjects: [],
    majors: [],
  },
  collegeGoals: {
    collegeTypes: [],
    specificColleges: [],
  },
  activities: {
    extracurriculars: [],
    volunteerWork: '',
  },
  personal: {
    challenge: '',
    values: [],
    background: '',
  },
  selectedTopic: null,
  followUpResponses: {},
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
      };
    case 'UPDATE_ACADEMICS':
      return {
        ...state,
        academics: { ...state.academics, ...action.payload },
      };
    case 'UPDATE_COLLEGE_GOALS':
      return {
        ...state,
        collegeGoals: { ...state.collegeGoals, ...action.payload },
      };
    case 'UPDATE_ACTIVITIES':
      return {
        ...state,
        activities: { ...state.activities, ...action.payload },
      };
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        personal: { ...state.personal, ...action.payload },
      };
    case 'SET_SELECTED_TOPIC':
      return {
        ...state,
        selectedTopic: action.payload,
      };
    case 'UPDATE_FOLLOW_UP_RESPONSES':
      return {
        ...state,
        followUpResponses: {
          ...state.followUpResponses,
          ...action.payload,
        },
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}; 