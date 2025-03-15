import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { generateEssay } from '../services/openai';

function ResultPage() {
  const navigate = useNavigate();
  const { state } = useForm();
  const [essay, setEssay] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Redirect if no topic selected
  if (!state.selectedTopic) {
    navigate('/topics');
    return null;
  }

  useEffect(() => {
    generateInitialEssay();
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
      setEssay(generatedEssay);
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
    navigator.clipboard.writeText(essay);
  };

  const handleDownload = () => {
    const blob = new Blob([essay], { type: 'text/plain' });
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
              disabled={isLoading || !essay}
              className="btn btn-secondary"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || !essay}
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

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Word Count: {wordCount}/650
            </span>
            <span className={`text-sm ${wordCount > 650 ? 'text-red-600' : 'text-gray-600'}`}>
              {wordCount > 650 ? 'Essay exceeds maximum word limit' : ''}
            </span>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">Generating your essay...</span>
              </div>
            ) : (
              <div className="prose max-w-none">
                {essay.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate('/followup')}
          className="btn btn-secondary"
        >
          Back to Questions
        </button>
      </div>
    </div>
  );
}

export default ResultPage; 