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

  // Determine which specific questions to add based on prompt keywords
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
  const [responses, setResponses] = useState<Record<string, string>>(() => state.followUpResponses || {});
  const [error, setError] = useState<string | null>(null);

  if (!state.selectedTopic) {
    navigate('/topics');
    return null;
  }

  const questions = generateFollowUpQuestions(state.selectedTopic.prompt);

  const handleResponseChange = (question: string, value: string) => {
    const updatedResponses = {
      ...responses,
      [question]: value
    };
    setResponses(updatedResponses);
    // Save to context immediately so it's not lost
    dispatch({
      type: 'UPDATE_FOLLOW_UP_RESPONSES',
      payload: updatedResponses
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all questions have been answered
    const unansweredQuestions = questions.filter(q => !responses[q] || responses[q].trim() === '');
    
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before proceeding');
      return;
    }

    // Navigate to result page
    navigate('/result');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tell Us More About Your Topic</h1>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="font-medium text-blue-900 mb-2">Selected Prompt:</p>
          <p className="text-blue-800 mb-4">{state.selectedTopic.prompt}</p>
          <p className="font-medium text-blue-900 mb-2">Your Topic:</p>
          <p className="text-blue-800 mb-2">{state.selectedTopic.idea}</p>
          <p className="text-blue-800 text-sm">{state.selectedTopic.description}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="card">
            <label className="block mb-2 font-medium text-gray-900">
              {question}
            </label>
            <textarea
              value={responses[question] || ''}
              onChange={(e) => handleResponseChange(question, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Type your response here..."
            />
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate('/topics')}
            className="btn btn-secondary"
          >
            Back to Topics
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Generate Essay
          </button>
        </div>
      </form>
    </div>
  );
}

export default FollowupPage; 