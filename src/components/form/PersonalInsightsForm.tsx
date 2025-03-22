import React from 'react';
import { useForm } from '../../context/FormContext';

const questions = [
  {
    id: 'happy',
    question: "What's one thing you've done that made you really happy?",
    placeholder: "Example: Starting a community garden at my school brought me joy because...",
  },
  {
    id: 'roleModel',
    question: "Who's someone you look up to, and why?",
    placeholder: "Example: My grandfather inspires me because...",
  },
  {
    id: 'lesson',
    question: "What's a time you messed up but learned something?",
    placeholder: "Example: When I forgot my lines during the school play...",
  },
  {
    id: 'hobby',
    question: "What do you like to do when you're not at school?",
    placeholder: "Example: I spend my free time experimenting with digital art...",
  },
  {
    id: 'unique',
    question: "What's something you wish people knew about you?",
    placeholder: "Example: Despite being quiet in class, I actually...",
  },
];

interface PersonalInsightsFormProps {
  onNext: () => void;
  onBack: () => void;
  isStandalone?: boolean;
}

export function PersonalInsightsForm({ onNext, onBack, isStandalone = false }: PersonalInsightsFormProps) {
  const { state, dispatch } = useForm();
  const insights = state.personalInsights;

  const updateInsight = (id: string, value: string) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INSIGHTS',
      payload: { [id]: value },
    });
  };

  return (
    <div className="p-6">
      <p className="text-lg mb-6">
        These questions help us understand your unique perspective. You don't need to answer all of them.
      </p>

      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {q.question}
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                  placeholder={q.placeholder}
                  value={insights[q.id as keyof typeof insights] || ''}
                  onChange={(e) => updateInsight(q.id, e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2 text-right">
                  {(insights[q.id as keyof typeof insights] || '').length}/500 characters
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isStandalone && (
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="py-2 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 