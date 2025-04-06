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
    if (id === 'writingSampleText' || id === 'writingSampleTitle') {
      const currentSample = insights.writingSample || { text: '', title: '' };
      dispatch({
        type: 'UPDATE_PERSONAL_INSIGHTS',
        payload: {
          writingSample: {
            ...currentSample,
            [id === 'writingSampleText' ? 'text' : 'title']: value
          }
        },
      });
    } else {
      dispatch({
        type: 'UPDATE_PERSONAL_INSIGHTS',
        payload: { [id]: value },
      });
    }
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

        {/* Writing Sample Section */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Writing Sample</h3>
            <p className="text-sm text-gray-600 mb-6">
              Share a piece of writing that represents your style. This could be a short essay, story, or reflection 
              you've written for school or personally. We'll use this to help maintain your authentic voice in your college essay.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title of Your Writing
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Example: My English Class Essay on The Great Gatsby"
                  value={insights.writingSample?.title || ''}
                  onChange={(e) => updateInsight('writingSampleTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Writing Sample
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[200px]"
                  placeholder="Paste your writing sample here..."
                  value={insights.writingSample?.text || ''}
                  onChange={(e) => updateInsight('writingSampleText', e.target.value)}
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500 mt-2 text-right">
                  {(insights.writingSample?.text || '').length}/2000 characters
                </p>
              </div>
            </div>
          </div>
        </div>
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