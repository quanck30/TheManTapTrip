/**
 * @brief 診断フローの質問選択画面（isConfirming === false）
 */

import { toast } from "sonner";
import { FaArrowLeft } from "react-icons/fa";
import { useQuestion } from "../../context/QuestionContext";
import { validateAnswersComplete } from "../../services/questionService";
import { FaArrowRight } from "react-icons/fa";

export default function QuestionStep({ onDiagnoseComplete }) {
  const { questions, answers, currentStep, setCurrentStep, setIsConfirming, handleSelect, submitAnswers } = useQuestion();

  const currentQuestion = questions[currentStep];

  const handleOptionClick = async (qId, itemId) => {
    if (currentStep < questions.length - 1) {
      handleSelect(qId, itemId);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // 最後の質問: state の反映を待たず、その場で回答をマージして検証する。
    // handleSelect 直後に state を読むと setState 未反映で stale な場合があるため。
    const mergedAnswers = { ...answers, [qId]: itemId };

    try {
      validateAnswersComplete(questions, mergedAnswers);
    } catch (err) {
      toast.error(err.message);
      return;
    }

    handleSelect(qId, itemId);
    const result = await submitAnswers(mergedAnswers);
    onDiagnoseComplete(result);
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
