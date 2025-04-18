import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { initializeUser, saveFormData, loadFormData } from '../services/firebase';

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
    description: string;
  } | null;
  followUpResponses: Record<string, string>;
  followUpQuestions: string[];
  activitiesAndInvolvement: {
    activities: Array<{
      category: string;
      otherCategory?: string;
      years: string[];
      leadership: string;
      description: string;
      hoursPerWeek: string;
    }>;
  };
  personalInsights: {
    happy: string;
    roleModel: string;
    lesson: string;
    hobby: string;
    unique: string;
    writingSample: {
      text: string;
      title: string;
    };
  };
  topicSuggestions: Record<string, Array<{
    title: string;
    description: string;
  }>>;
  generatedEssay: string;
}

type FormAction =
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<FormState['basicInfo']> }
  | { type: 'UPDATE_ACADEMICS'; payload: Partial<FormState['academics']> }
  | { type: 'UPDATE_COLLEGE_GOALS'; payload: Partial<FormState['collegeGoals']> }
  | { type: 'UPDATE_ACTIVITIES'; payload: Partial<FormState['activities']> }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<FormState['personal']> }
  | { type: 'SET_SELECTED_TOPIC'; payload: FormState['selectedTopic'] }
  | { type: 'UPDATE_FOLLOW_UP_RESPONSES'; payload: Record<string, string> }
  | { type: 'SET_FOLLOW_UP_QUESTIONS'; payload: string[] }
  | { type: 'UPDATE_ACTIVITIES_AND_INVOLVEMENT'; payload: Partial<FormState['activitiesAndInvolvement']> }
  | { type: 'UPDATE_PERSONAL_INSIGHTS'; payload: Partial<FormState['personalInsights']> }
  | { type: 'UPDATE_TOPIC_SUGGESTIONS'; payload: FormState['topicSuggestions'] }
  | { type: 'SET_GENERATED_ESSAY'; payload: string }
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
  followUpQuestions: [],
  activitiesAndInvolvement: {
    activities: [],
  },
  personalInsights: {
    happy: '',
    roleModel: '',
    lesson: '',
    hobby: '',
    unique: '',
    writingSample: {
      text: '',
      title: ''
    }
  },
  topicSuggestions: {},
  generatedEssay: '',
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
    case 'SET_FOLLOW_UP_QUESTIONS':
      return {
        ...state,
        followUpQuestions: action.payload,
      };
    case 'UPDATE_ACTIVITIES_AND_INVOLVEMENT':
      return {
        ...state,
        activitiesAndInvolvement: { ...state.activitiesAndInvolvement, ...action.payload },
      };
    case 'UPDATE_PERSONAL_INSIGHTS':
      return {
        ...state,
        personalInsights: { ...state.personalInsights, ...action.payload },
      };
    case 'UPDATE_TOPIC_SUGGESTIONS':
      return {
        ...state,
        topicSuggestions: action.payload,
      };
    case 'SET_GENERATED_ESSAY':
      return {
        ...state,
        generatedEssay: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        topicSuggestions: {}
      };
    default:
      return state;
  }
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase user and load data when component mounts
  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        console.log('Initializing data...');
        await initializeUser();
        
        if (!mounted) return;

        const savedData = await loadFormData();
        console.log('Loaded saved data:', savedData);
        
        if (!mounted) return;

        if (savedData) {
          // Map of saved data keys to their corresponding action types
          const actionTypeMap: Record<string, string> = {
            basicInfo: 'UPDATE_BASIC_INFO',
            academics: 'UPDATE_ACADEMICS',
            collegeGoals: 'UPDATE_COLLEGE_GOALS',
            activities: 'UPDATE_ACTIVITIES',
            personal: 'UPDATE_PERSONAL',
            selectedTopic: 'SET_SELECTED_TOPIC',
            followUpResponses: 'UPDATE_FOLLOW_UP_RESPONSES',
            activitiesAndInvolvement: 'UPDATE_ACTIVITIES_AND_INVOLVEMENT',
            personalInsights: 'UPDATE_PERSONAL_INSIGHTS',
            topicSuggestions: 'UPDATE_TOPIC_SUGGESTIONS',
            generatedEssay: 'SET_GENERATED_ESSAY'
          };

          Object.entries(savedData).forEach(([key, value]) => {
            if (key in actionTypeMap) {
              dispatch({
                type: actionTypeMap[key] as any,
                payload: value,
              });
            }
          });
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        if (mounted) {
          setError('Failed to load your saved data. Please try refreshing the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    let saveTimeout: NodeJS.Timeout;

    const saveData = async () => {
      if (loading) return; // Don't save during initial load

      console.log('Save effect triggered with state:', state);
      try {
        await saveFormData(state);
        setError(null);
      } catch (err) {
        console.error('Error saving form data:', err);
        setError('Failed to save your changes. They might not persist if you refresh.');
      }
    };

    // Debounce saves to prevent too many writes
    console.log('Scheduling save with timeout...');
    saveTimeout = setTimeout(saveData, 500);

    return () => {
      console.log('Cleaning up save timeout');
      clearTimeout(saveTimeout);
    };
  }, [state, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}
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