import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { generateSupplementalEssay } from '../services/openai';

function SupplementalEssayPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const [prompt, setPrompt] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !wordCount.trim()) {
      setError('Please provide both the prompt and word count');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const essay = await generateSupplementalEssay(
        state,
        prompt,
        parseInt(wordCount)
      );

      dispatch({
        type: 'ADD_SUPPLEMENTAL_ESSAY',
        payload: {
          prompt,
          wordCount: parseInt(wordCount),
          generatedEssay: essay,
        },
      });
    } catch (err) {
      setError('Failed to generate essay. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate Supplemental Essay</h1>
        <p className="text-gray-600 mb-6">
          Paste the supplemental essay prompt and specify the word count limit. We'll generate an essay based on your profile information.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Essay Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            placeholder="Paste the supplemental essay prompt here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Count Limit
          </label>
          <input
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g. 250"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary"
        >
          {isLoading ? 'Generating...' : 'Generate Essay'}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Generated Essays</h2>
        {state.supplementalEssays.map((essay, index) => (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">Prompt:</h3>
              <p className="text-gray-600">{essay.prompt}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">Word Count Limit:</h3>
              <p className="text-gray-600">{essay.wordCount} words</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Generated Essay:</h3>
              <div className="prose max-w-none">
                {essay.generatedEssay.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate('/essay-type')}
          className="btn btn-secondary"
        >
          Back to Common App Essay
        </button>
      </div>
    </div>
  );
}

export default SupplementalEssayPage; 