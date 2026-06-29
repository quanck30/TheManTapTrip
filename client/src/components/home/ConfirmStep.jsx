/**
 * @brief 診断フローの回答確認画面（isConfirming === true）
 */

import { FaArrowLeft } from "react-icons/fa";
import { useQuestion } from "../../context/QuestionContext";

export default function ConfirmStep({ onDiagnoseComplete }) {
  const { questions, answers, handleSubmit, reset, setIsConfirming, setCurrentStep } = useQuestion();

  const handleComplete = async () => {
    const results = await handleSubmit();
    // 完了時に診断フローを初期化
    reset();
    if (results) onDiagnoseComplete(results);
  };

  const handleBack = () => {
    // 確認画面から戻る場合は「最初の質問」へ戻す
    setIsConfirming(false);
    setCurrentStep(0);
  };

  return (
    <>
      <h2 className="question-title">回答内容の確認</h2>
      <div className="summary-container">
        {questions.map((q) => (
          <div key={q.id} className="summary-item">
            <p className="summary-question">{q.title}</p>
            <p className="summary-answer">{q.queryItems.find((i) => i.itemId === answers[q.id])?.title || "未回答"}</p>
          </div>
        ))}
      </div>
      <button className={`option-item confirm-btn active `} onClick={() => handleComplete()}>
        <span className="option-text">おススメを見る</span>
      </button>
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft style={{ verticalAlign: "middle", marginRight: 4 }} />修正する
      </button>
    </>
  );
}
