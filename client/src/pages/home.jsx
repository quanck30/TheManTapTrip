import React, { useState } from 'react';
import { diagnosticQuestions } from '../Data/questions';

function Home({ onDiagnoseComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = diagnosticQuestions[currentStep];
  const progressPercent = ((currentStep + 1) / diagnosticQuestions.length) * 100;

  const handleOptionSelect = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    if (currentStep < diagnosticQuestions.length - 1) {
      // 次の質問へ
      setCurrentStep(prev => prev + 1);
    } else {
      // すべての質問に答え終わったらApp.jsx側に通知（recommendタブへ遷移）
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
        {/* 進捗プログレスバー */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* ステップカウンター */}
        <div className="question-meta">
          質問 {currentStep + 1} / {diagnosticQuestions.length}
        </div>

        {/* 質問タイトル */}
        <h2 className="question-title">{currentQuestion.question}</h2>

        {/* 選択肢リスト */}
        <div className="options-group">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-item"
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option}</span>
              <span style={{ color: '#3b82f6' }}>➔</span>
            </button>
          ))}
        </div>

        {/* 下部ナビゲーション補助アクション */}
        <div className="action-footer">
          {currentStep > 0 ? (
            <button className="btn-secondary" onClick={handleBack}>
              ⬅ 戻る
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;