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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Essay</h1>
        <div className="space-x-4">
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
            className="btn btn-primary"
          >
            Download
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="prose max-w-none">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Generating your essay...</span>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                Word count: {wordCount}/650
              </div>
              {essay.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('/followup')}
          className="btn btn-secondary"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ResultPage; 