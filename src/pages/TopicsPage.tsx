import React, { useState } from 'react';
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function TopicsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Initialize selected topic from saved state
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(() => 
    state.selectedTopic ? state.selectedTopic.prompt : null
  );
  const [selectedIdea, setSelectedIdea] = useState<TopicIdea | null>(() => {
    if (state.selectedTopic) {
      return {
        title: state.selectedTopic.idea,
        description: state.selectedTopic.description
      };
    }
    return null;
  });

  const generateTopics = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    let progressInterval: NodeJS.Timeout | undefined;
    
    try {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const topics = await generateTopicSuggestions(state);
      dispatch({
        type: 'UPDATE_TOPIC_SUGGESTIONS',
        payload: topics
      });
      setProgress(100);
      if (progressInterval) clearInterval(progressInterval);
    } catch (err: any) {
      if (progressInterval) clearInterval(progressInterval);
      console.error('Error generating topics:', err);
      
      // Handle rate limit errors
      if (err?.status === 429 && retryCount < 3) {
        setError('Rate limit reached. Retrying in 5 seconds...');
        await delay(5000); // Wait 5 seconds before retrying
        return generateTopics(retryCount + 1);
      }

      setError(
        err?.status === 429
          ? 'OpenAI rate limit reached. Please wait a minute and try again.'
          : 'Failed to generate topic suggestions. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (prompt: string, idea: TopicIdea) => {
    setSelectedPrompt(prompt);
    setSelectedIdea(idea);
  };

  const handleNext = () => {
    if (selectedPrompt && selectedIdea) {
      dispatch({
        type: 'SET_SELECTED_TOPIC',
        payload: {
          prompt: selectedPrompt,
          idea: selectedIdea.title,
          description: selectedIdea.description,
        },
      });
      navigate('/followup');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Essay Topic</h1>
        <button
          onClick={() => generateTopics()}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          {isLoading ? 'Generating...' : 'Generate Topics'}
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
              {state.topicSuggestions[number]?.map((idea, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedIdea?.title === idea.title && selectedPrompt === prompt
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
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
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedPrompt || !selectedIdea}
          className={`btn btn-primary ${
            !selectedPrompt || !selectedIdea ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TopicsPage; 