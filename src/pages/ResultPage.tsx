import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { generateEssay } from '../services/openai';

function ResultPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Redirect if no topic selected
  if (!state.selectedTopic) {
    navigate('/topics');
    return null;
  }

  useEffect(() => {
    let isMounted = true;
    const generateEssayIfNeeded = async () => {
      // Only generate if we don't have an essay yet
      if (!state.generatedEssay && isMounted) {
        await generateInitialEssay();
      } else if (state.generatedEssay) {
        updateWordCount(state.generatedEssay);
      }
    };
    generateEssayIfNeeded();
    return () => {
      isMounted = false;
    };
  }, []);

  const generateInitialEssay = async () => {
    if (!state.selectedTopic) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const generatedEssay = await generateEssay(
        state,
        state.selectedTopic.prompt,
        state.selectedTopic.idea,
        state.followUpResponses
      );
      dispatch({
        type: 'SET_GENERATED_ESSAY',
        payload: generatedEssay
      });
      updateWordCount(generatedEssay);
    } catch (err) {
      setError('Failed to generate essay. Please try again.');
      console.error('Error generating essay:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    generateInitialEssay();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.generatedEssay);
  };

  const handleDownload = () => {
    const blob = new Blob([state.generatedEssay], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'college-essay.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your College Essay</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRegenerate}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              {isLoading ? 'Generating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleCopy}
              disabled={isLoading || !state.generatedEssay}
              className="btn btn-secondary"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || !state.generatedEssay}
              className="btn btn-secondary"
            >
              Download
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="font-medium text-blue-900 mb-2">Selected Prompt:</p>
          <p className="text-blue-800">{state.selectedTopic.prompt}</p>
          <p className="font-medium text-blue-900 mt-4 mb-2">Your Topic:</p>
          <p className="text-blue-800">{state.selectedTopic.idea}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">Word Count: {wordCount}/650</span>
          </div>

          <div className="prose max-w-none">
            {state.generatedEssay.split('\n\n').map((paragraph, index) => {
              // If it's the first paragraph and doesn't start with a common sentence starter,
              // treat it as the title
              if (index === 0 && !/^(The|A|An|In|On|At|When|While|After|Before|He|She|They|We|I|My|Our|Your|It|This|That)/i.test(paragraph)) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {paragraph}
                  </h2>
                );
              }
              return (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate('/followup')}
          className="btn btn-secondary"
        >
          Back to Follow-up
        </button>
      </div>
    </div>
  );
}

export default ResultPage; 