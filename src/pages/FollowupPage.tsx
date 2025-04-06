import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { generateFollowUpQuestions } from '../services/openai';

function FollowupPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [responses, setResponses] = useState<Record<string, string>>(() => state.followUpResponses || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateFollowUpQuestions(
        state,
        state.selectedTopic!.prompt,
        state.selectedTopic!.idea
      );
      dispatch({
        type: 'SET_FOLLOW_UP_QUESTIONS',
        payload: generatedQuestions
      });
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeQuestions = async () => {
      if (!state.selectedTopic) {
        navigate('/topics');
        return;
      }

      // Only generate questions if we don't have any saved
      if (state.followUpQuestions.length === 0) {
        await generateQuestions();
      }
    };

    initializeQuestions();
  }, [state.selectedTopic]);

  if (!state.selectedTopic) {
    navigate('/topics');
    return null;
  }

  const handleResponseChange = (question: string, value: string) => {
    console.log('Previous responses:', responses);
    const updatedResponses = {
      ...responses,
      [question]: value
    };
    console.log('Updated responses:', updatedResponses);
    setResponses(updatedResponses);
    // Save to context immediately so it's not lost
    dispatch({
      type: 'UPDATE_FOLLOW_UP_RESPONSES',
      payload: updatedResponses
    });
    console.log('Current form state after dispatch:', state);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Count how many questions have been answered
    const answeredQuestions = state.followUpQuestions.filter(q => responses[q] && responses[q].trim() !== '').length;
    
    if (answeredQuestions < 3) {
      setError('Please answer at least 3 questions before proceeding');
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
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Please answer at least 3 of the following questions to help us generate a more personalized essay. The more questions you answer, the better!</p>
          <button
            type="button"
            onClick={generateQuestions}
            disabled={isLoading}
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {isLoading ? 'Generating...' : 'Regenerate Questions'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {state.followUpQuestions.map((question, index) => (
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
      )}
    </div>
  );
}

export default FollowupPage; 