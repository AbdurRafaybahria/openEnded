import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFeedbackSubmitted = () => {
    // Increment the refresh trigger to cause the FeedbackList to reload
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <h1>Student Feedback Management System</h1>
      <div className="main-content">
        <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
        <FeedbackList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
