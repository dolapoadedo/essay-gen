import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import TopicsPage from './pages/TopicsPage';
import FollowupPage from './pages/FollowupPage';
import ResultPage from './pages/ResultPage';
import Header from './components/layout/Header';

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