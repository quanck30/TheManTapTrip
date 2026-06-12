import React, { useState } from 'react';
import { diagnosticQuestions } from '../Data/questions';
import '../Styles/home.css';

function Home({ onDiagnoseComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = diagnosticQuestions[currentStep];

  const handleOptionSelect = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    if (currentStep < diagnosticQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onDiagnoseComplete(updatedAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="home-container">
      <div className="diagnostic-card">
        
        {/* クリック可能な進捗バー */}
        <div className="progress-container">
          {diagnosticQuestions.map((_, index) => (
            <button
              key={index}
              className={`progress-segment ${index <= currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`質問 ${index + 1} へ移動`}
            />
          ))}
        </div>

        <div className="question-meta">
          質問 {currentStep + 1} / {diagnosticQuestions.length}
        </div>

        <h2 className="question-title">{currentQuestion.question}</h2>

        <div className="options-group">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-item"
              onClick={() => handleOptionSelect(option)}
            >
              <span className="option-text">{option}</span>
              <span className="option-arrow">➔</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;