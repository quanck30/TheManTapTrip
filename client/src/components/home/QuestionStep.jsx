/**
 * @brief 診断フローの質問選択画面（isConfirming === false）
 */

import { FaArrowLeft } from "react-icons/fa";
import { useQuestion } from "../../context/QuestionContext";
import { FaArrowRight } from "react-icons/fa";

export default function QuestionStep({ onDiagnoseComplete }) {
  const { questions, answers, currentStep, setCurrentStep, setIsConfirming, handleSelect, handleSubmit } = useQuestion();

  const currentQuestion = questions[currentStep];

  const handleOptionClick = async (qId, itemId) => {
    handleSelect(qId, itemId);
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const resutl = await handleSubmit();
      onDiagnoseComplete(resutl);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="question-meta">
        質問 {currentStep + 1} / {questions.length}
      </div>
      <div className="progress-container">
        {questions.map((q, index) => (
          <button key={q.id} className={`progress-segment ${index === currentStep ? "active" : answers[q.id] ? "completed" : ""}`} onClick={() => setCurrentStep(index)} />
        ))}
      </div>
      <div>
        <p>あなたに合った目的地をご提案するため、いくつか質問します</p>
      </div>

      <h2 className="question-title">{currentQuestion.title}</h2>
      <div className="options-group">
        {currentQuestion.queryItems.map((item) => (
          <button
            id={item.itemId}
            key={item.itemId}
            className={`option-item ${String(answers[currentQuestion.id]) === String(item.itemId) ? "selected" : ""}`}
            onClick={() => handleOptionClick(currentQuestion.id, item.itemId)}
          >
            <span className="option-text">{item.title}</span>
            <FaArrowRight />
          </button>
        ))}
      </div>
      {currentStep > 0 && (
        <button className="back-button-bottom" onClick={handleBack}>
          <FaArrowLeft style={{ verticalAlign: "middle", marginRight: 4 }} />
          前に戻る
        </button>
      )}
    </>
  );
}
