import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';

const generateFollowUpQuestions = (prompt: string) => {
  const commonQuestions = [
    "What specific moment or experience inspired this topic?",
    "How has this experience changed your perspective?",
    "What concrete details or examples can you share about this story?",
  ];

  const specificQuestions: Record<string, string[]> = {
    "background": [
      "How has your background influenced your worldview?",
      "What specific traditions or experiences make your story unique?",
    ],
    "challenge": [
      "What specific obstacles did you face?",
      "What strategies did you use to overcome this challenge?",
    ],
    "belief": [
      "What triggered you to question this belief?",
      "How did others react to your perspective?",
    ],
    "gratitude": [
      "Why was this act of kindness surprising?",
      "How has this experience influenced your actions towards others?",
    ],
    "growth": [
      "What specific changes did you notice in yourself?",
      "How has this growth influenced your future goals?",
    ],
    "passion": [
      "When did you first discover this interest?",
      "How do you pursue this passion outside of school?",
    ],
  };

  const promptLower = prompt.toLowerCase();
  let relevantQuestions = [...commonQuestions];

  Object.entries(specificQuestions).forEach(([key, questions]) => {
    if (promptLower.includes(key)) {
      relevantQuestions = [...relevantQuestions, ...questions];
    }
  });

  return relevantQuestions;
};

function FollowupPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  if (!state.selectedTopic) {
    navigate('/topics');
    return null;
  }

  const questions = generateFollowUpQuestions(state.selectedTopic.prompt);

  const handleResponseChange = (question: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const unansweredQuestions = questions.filter(q => !responses[q] || responses[q].trim() === '');
    
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before proceeding');
      return;
    }

    dispatch({
      type: 'UPDATE_FOLLOW_UP_RESPONSES',
      payload: responses
    });

    navigate('/result');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Follow-up Questions</h2>
        <p className="text-gray-600 mb-6">
          Help us understand more about your chosen topic by answering these questions.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question}
              </label>
              <textarea
                value={responses[question] || ''}
                onChange={(e) => handleResponseChange(question, e.target.value)}
                className="form-textarea mt-1 block w-full"
                rows={3}
                placeholder="Your answer..."
              />
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/topics')}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FollowupPage; 