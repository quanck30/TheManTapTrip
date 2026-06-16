import React, { useState, useEffect } from "react";
import { useQuestionForm } from "../hooks/useQuestionForm.jsx";
import "../Styles/home.css";

function Home({ onDiagnoseComplete }) {
    const [currentStep, setCurrentStep] = useState(() =>
        parseInt(localStorage.getItem("diag_step") || "0", 10),
    );
    const [answers, setAnswers] = useState(() =>
        JSON.parse(localStorage.getItem("diag_answers") || "{}"),
    );
    const [isConfirming, setIsConfirming] = useState(
        () => localStorage.getItem("diag_isConfirming") === "true",
    );

    useEffect(() => {
        localStorage.setItem("diag_step", currentStep);
        localStorage.setItem("diag_answers", JSON.stringify(answers));
        localStorage.setItem("diag_isConfirming", isConfirming);
    }, [currentStep, answers, isConfirming]);

    const currentQuestion = useQuestionForm().questions[currentStep];
    const isAllAnswered = useQuestionForm().questions.every(
        (q) => answers[q.id],
    );

    const handleOptionSelect = (option) => {
        const updatedAnswers = { ...answers, [currentQuestion.id]: option };
        setAnswers(updatedAnswers);
        if (currentStep < useQuestionForm().questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsConfirming(true);
        }
    };

    const handleBack = () => {
        if (isConfirming) setIsConfirming(false);
        else if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    return (
        <div className="home-container">
            <div className="diagnostic-card">
                {isConfirming ? (
                    <>
                        <h2 className="question-title">回答内容の確認</h2>
                        <div className="summary-container">
                            {diagnosticQuestions.map((q) => (
                                <div key={q.id} className="summary-item">
                                    <p className="summary-question">
                                        {q.question}
                                    </p>
                                    <p className="summary-answer">
                                        {answers[q.id]}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className={`option-item confirm-btn ${isAllAnswered ? "active" : ""}`}
                            onClick={() =>
                                isAllAnswered && onDiagnoseComplete(answers)
                            }>
                            <span className="option-text">診断結果を見る</span>
                        </button>
                        <button className="back-button" onClick={handleBack}>
                            ← 修正する
                        </button>
                    </>
                ) : (
                    <>
                        {currentStep > 0 && (
                            <button
                                className="back-button"
                                onClick={handleBack}>
                                ← 戻る
                            </button>
                        )}
                        <div className="progress-container">
                            {diagnosticQuestions.map((q, index) => (
                                <button
                                    key={q.id}
                                    className={`progress-segment ${index === currentStep ? "active" : ""} ${answers[q.id] ? "completed" : ""}`}
                                    onClick={() => setCurrentStep(index)}
                                />
                            ))}
                        </div>
                        <div className="question-meta">
                            質問 {currentStep + 1} /{" "}
                            {diagnosticQuestions.length}
                        </div>
                        <h2 className="question-title">
                            {currentQuestion.question}
                        </h2>
                        <div className="options-group">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-item ${answers[currentQuestion.id] === option ? "selected" : ""}`}
                                    onClick={() => handleOptionSelect(option)}>
                                    <span className="option-text">
                                        {option}
                                    </span>
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
