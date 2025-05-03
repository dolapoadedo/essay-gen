import React from 'react';
import { useNavigate } from 'react-router-dom';

function EssayTypePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Choose Your Essay Type</h2>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/topics')}
            className="w-full p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Common App Personal Statement</h3>
            <p className="text-gray-600">
              Generate a compelling personal statement that tells your unique story and showcases your personality.
            </p>
          </button>

          <button
            onClick={() => navigate('/supplemental')}
            className="w-full p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Supplemental Essays</h3>
            <p className="text-gray-600">
              Create tailored essays for specific schools, including "Why Us" essays and other school-specific prompts.
            </p>
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/form')}
            className="btn btn-secondary"
          >
            Back to Questions
          </button>
        </div>
      </div>
    </div>
  );
}

export default EssayTypePage; 