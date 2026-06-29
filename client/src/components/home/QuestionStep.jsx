/**
 * @brief 診断フローの質問選択画面（isConfirming === false）
 */

import { FaArrowLeft } from "react-icons/fa";
import { useQuestion } from "../../context/QuestionContext";

export default function QuestionStep() {
    const {
        questions,
        answers,
        currentStep,
        setCurrentStep,
        setIsConfirming,
        handleSelect,
    } = useQuestion();

    const currentQuestion = questions[currentStep];

    const handleOptionClick = (qId, itemId) => {
        handleSelect(qId, itemId);
        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep((prev) => prev + 1);
            } else {
                setIsConfirming(true);
            }
        }, 300);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <>
            <div className="progress-container">
                {questions.map((q, index) => (
                    <button
                        key={q.id}
                        className={`progress-segment ${index === currentStep ? "active" : answers[q.id] ? "completed" : ""}`}
                        onClick={() => setCurrentStep(index)}
                    />
                ))}
            </div>
            <div className="question-meta">
                質問 {currentStep + 1} / {questions.length}
            </div>
            <h2 className="question-title">{currentQuestion.title}</h2>
            <div className="options-group">
                {currentQuestion.queryItems.map((item) => (
                    <button
                        id={item.itemId}
                        key={item.itemId}
                        className={`option-item ${String(answers[currentQuestion.id]) === String(item.itemId) ? "selected" : ""}`}
                        onClick={() =>
                            handleOptionClick(currentQuestion.id, item.itemId)
                        }>
                        <span className="option-text">{item.title}</span>
                    </button>
                ))}
            </div>
            {currentStep > 0 && (
                <button className="back-button-bottom" onClick={handleBack}>
                    <FaArrowLeft style={{ verticalAlign: "middle", marginRight: 4 }} />前に戻る
                </button>
            )}
        </>
    );
}
