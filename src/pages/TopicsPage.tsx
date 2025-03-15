import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { generateTopicSuggestions, TopicIdea } from '../services/openai';

const commonAppPrompts = {
  '1': 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.',
  '2': 'The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?',
  '3': 'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?',
  '4': 'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?',
  '5': 'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.',
  '6': 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?'
};

function TopicsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, TopicIdea[]>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    generateTopics();
  }, []);

  const generateTopics = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate progress during generation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const topics = await generateTopicSuggestions(state);
      setSuggestions(topics);
      setProgress(100);
      
      // Clear interval if it's still running
      clearInterval(progressInterval);
    } catch (err) {
      setError('Failed to generate topic suggestions. Please try again.');
      console.error('Error generating topics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (prompt: string, idea: TopicIdea) => {
    dispatch({
      type: 'SET_SELECTED_TOPIC',
      payload: {
        prompt,
        idea: idea.title,
      },
    });
    navigate('/followup');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Essay Topic</h1>
        <button
          onClick={generateTopics}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          {isLoading ? 'Generating...' : 'Regenerate Topics'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Generating personalized topics...</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(commonAppPrompts).map(([number, prompt]) => (
          <div key={number} className="card">
            <h2 className="text-lg font-semibold mb-4">
              Prompt {number}
            </h2>
            <p className="text-gray-600 mb-6">{prompt}</p>
            
            <div className="space-y-4">
              {suggestions[number]?.map((idea, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-md hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => handleSelectTopic(prompt, idea)}
                >
                  <h3 className="font-medium text-blue-600 mb-2">{idea.title}</h3>
                  <p className="text-gray-600 text-sm">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate('/form')}
          className="btn btn-secondary"
        >
          Back to Questions
        </button>
      </div>
    </div>
  );
}

export default TopicsPage; 