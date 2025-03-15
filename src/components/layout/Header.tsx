import React from 'react';
import { useLocation } from 'react-router-dom';

const steps = [
  { name: 'Information', path: '/form' },
  { name: 'Topics', path: '/topics' },
  { name: 'Follow-up', path: '/followup' },
  { name: 'Result', path: '/result' },
];

function Header() {
  const location = useLocation();
  const currentStep = steps.findIndex(step => step.path === location.pathname) + 1;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">EssayLift</h1>
          <div className="hidden sm:block">
            <nav className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.name}
                  className={`flex items-center ${
                    index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current">
                    {index + 1}
                  </span>
                  <span className="ml-2">{step.name}</span>
                  {index < steps.length - 1 && (
                    <span className="ml-4 text-gray-300">→</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 