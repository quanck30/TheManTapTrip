import React, { useState, useEffect } from "react";
import { useQuestionForm } from "../components/hooks/useQuestionForm";
import "../Styles/home.css";

function Home({ onDiagnoseComplete }) {
    const { questions, answers, handleSelect, handleSubmit, isLoading } = useQuestionForm(onDiagnoseComplete);
    
    const token = localStorage.getItem("authToken") || "guest";
    const userKey = btoa(token.slice(0, 10));
    const stepKey = `diag_step_${userKey}`;
    const confirmKey = `diag_isConfirming_${userKey}`;
    const answersKey = `diag_answers_${userKey}`;

    const [currentStep, setCurrentStep] = useState(() => parseInt(localStorage.getItem(stepKey) || "0", 10));
    const [isConfirming, setIsConfirming] = useState(() => localStorage.getItem(confirmKey) === "true");
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        localStorage.setItem(stepKey, currentStep);
        localStorage.setItem(confirmKey, isConfirming);
        localStorage.setItem(answersKey, JSON.stringify(answers));
    }, [currentStep, isConfirming, answers, stepKey, confirmKey, answersKey]);

    if (questions.length === 0) return <div className="home-container">読み込み中...</div>;

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

    const handleComplete = async () => {
        await handleSubmit();
        localStorage.removeItem(stepKey);
        localStorage.removeItem(confirmKey);
        localStorage.removeItem(answersKey);
        setCurrentStep(0);
        setIsConfirming(false);
        setIsWarning(false);
    };

    const handleBack = () => {
        if (isConfirming) {
            setIsConfirming(false);
            setIsWarning(false);
        } else if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className="home-container">
            <div className="diagnostic-card">
                {isConfirming ? (
                    <>
                        <h2 className="question-title">回答内容の確認</h2>
                        <div className="summary-container">
                            {questions.map((q) => (
                                <div key={q.id} className="summary-item">
                                    <p className="summary-question">{q.title}</p>
                                    <p className="summary-answer">
                                        {(q.queryItems).find(i => i.id === answers[q.id])?.title || "未回答"}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className={`option-item confirm-btn active ${isWarning ? 'warning' : ''}`} onClick={() => isWarning ? handleComplete() : setIsWarning(true)}>
                            <span className="option-text">{isWarning ? "本当に診断を実行しますか？" : (isLoading ? "検索中..." : "診断結果を見る")}</span>
                        </button>
                        <button className="back-button-bottom" onClick={handleBack}>← 修正する</button>
                    </>
                ) : (
                    <>
                        {currentStep > 0 && <button className="back-button" onClick={handleBack}>← 戻る</button>}
                        <div className="progress-container">
                            {questions.map((q, index) => (
                                <button key={q.id} className={`progress-segment ${index === currentStep ? "active" : ""} ${answers[q.id] ? "completed" : ""}`} onClick={() => setCurrentStep(index)} />
                            ))}
                        </div>
                        <div className="question-meta">質問 {currentStep + 1} / {questions.length}</div>
                        <h2 className="question-title">{currentQuestion.title}</h2>
                        <div className="options-group">
                            {currentQuestion.queryItems.map((item) => (
                                <button key={item.id} className={`option-item ${answers[currentQuestion.id] === item.id ? "selected" : ""}`} onClick={() => handleOptionClick(currentQuestion.id, item.id)}>
                                    <span className="option-text">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
export default Home;