import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage.tsx';
import TopicsPage from './pages/TopicsPage.tsx';
import FollowupPage from './pages/FollowupPage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import Header from './components/layout/Header.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/form" replace />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/followup" element={<FollowupPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 