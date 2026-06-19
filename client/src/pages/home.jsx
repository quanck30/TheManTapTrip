import React, { useState, useEffect } from "react";
import { useQuestionForm } from "../components/hooks/useQuestionForm";
import "../Styles/home.css";

function Home({ onDiagnoseComplete }) {
    const { questions, answers, handleSelect, handleSubmit, isLoading } =
        useQuestionForm(onDiagnoseComplete);

    // ユーザー識別用のキー（authToken依存）
    const token = localStorage.getItem("authToken") || "guest";
    const userKey = btoa(token.slice(0, 10));
    const stepKey = `diag_step_${userKey}`;
    const confirmKey = `diag_isConfirming_${userKey}`;
    const answersKey = `diag_answers_${userKey}`;

    // ステップと確認状態をローカルストレージから復元
    const [currentStep, setCurrentStep] = useState(() =>
        parseInt(localStorage.getItem(stepKey) || "0", 10),
    );
    const [isConfirming, setIsConfirming] = useState(
        () => localStorage.getItem(confirmKey) === "true",
    );
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        localStorage.setItem(stepKey, currentStep);
        localStorage.setItem(confirmKey, isConfirming);
        localStorage.setItem(answersKey, JSON.stringify(answers));
    }, [currentStep, isConfirming, answers, stepKey, confirmKey, answersKey]);

    if (questions.length === 0)
        return <div className="home-container">読み込み中...</div>;

    const currentQuestion = questions[currentStep];
    console.log(currentQuestion);

    const isAllAnswered = questions.every((q) => answers[q.id]);

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
        // 完了時にそのユーザーのデータのみ消去
        localStorage.removeItem(stepKey);
        localStorage.removeItem(confirmKey);
        localStorage.removeItem(answersKey);
        setCurrentStep(0);
        setIsConfirming(false);
        setIsWarning(false);
    };

    const handleBack = () => {
        if (isConfirming) {
            // 確認画面から戻る場合は「最初の質問」へ戻す
            setIsConfirming(false);
            setCurrentStep(0);
            setIsWarning(false);
        } else if (currentStep > 0) {
            // 通常の戻る動作
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
                                    <p className="summary-question">
                                        {q.title}
                                    </p>
                                    <p className="summary-answer">
                                        {q.queryItems.find(
                                            (i) => i.itemId === answers[q.id],
                                        )?.title || "未回答"}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className={`option-item confirm-btn active ${isWarning ? "warning" : ""}`}
                            onClick={() =>
                                isWarning
                                    ? handleComplete()
                                    : setIsWarning(true)
                            }>
                            <span className="option-text">
                                {isWarning
                                    ? "本当に診断を実行しますか？"
                                    : isLoading
                                      ? "検索中..."
                                      : "診断結果を見る"}
                            </span>
                        </button>
                        <button className="back-button" onClick={handleBack}>
                            ← 修正する
                        </button>
                    </>
                ) : (
                    <>
                        <div className="progress-container">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    className={`progress-segment ${index === currentStep ? "active" : ""} ${answers[q.id] ? "completed" : ""}`}
                                    onClick={() => setCurrentStep(index)}
                                />
                            ))}
                        </div>
                        <div className="question-meta">
                            質問 {currentStep + 1} / {questions.length}
                        </div>
                        <h2 className="question-title">
                            {currentQuestion.title}
                        </h2>
                        <div className="options-group">
                            {currentQuestion.queryItems.map((item) => (
                                <button
                                    id={item.itemId}
                                    key={item.itemId}
                                    className={`option-item ${answers[currentQuestion.id] === item.itemId ? "selected" : ""}`}
                                    onClick={() =>
                                        handleOptionClick(
                                            currentQuestion.id,
                                            item.itemId,
                                        )
                                    }>
                                    <span className="option-text">
                                        {item.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {currentStep > 0 && (
                            <button
                                className="back-button-bottom"
                                onClick={handleBack}>
                                ← 前に戻る
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
