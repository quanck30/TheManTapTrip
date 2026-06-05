import React, { useState } from 'react';
import { diagnosticQuestions } from '../Data/questions';
import '../Styles/home.css';

/**
 * 診断質問を表示するコンポーネント
 * 質問データを順次表示し、選択結果を親コンポーネントへ渡す役割を持つ
 */
function Home({ onDiagnoseComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = diagnosticQuestions[currentStep];
  const progressPercent = ((currentStep + 1) / diagnosticQuestions.length) * 100;

  const handleOptionSelect = (option) => {
    // 回答を保存して次のステップへ（最後の場合は完了イベントを発火）
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);

    if (currentStep < diagnosticQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onDiagnoseComplete(updatedAnswers);
    }
  };

  return (
    <div className="home-container">
      <div className="diagnostic-card">
        {/* 進捗バー */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="question-meta">
          質問 {currentStep + 1} / {diagnosticQuestions.length}
        </div>

        <h2 className="question-title">{currentQuestion.question}</h2>

        {/* 選択肢リスト */}
        <div className="options-group">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-item"
              onClick={() => handleOptionSelect(option)}
            >
              {/* テキストと矢印を分離することでスタイル制御を容易にしている */}
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