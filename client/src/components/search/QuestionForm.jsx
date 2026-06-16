/**
 * @brief 質問と回答候補を表示する
 * @Author J.Naka
 * @Date 26/06/12
 * @Update 26/06/15
 */

import React from "react";
import TempButton from "../buttons/TempButton";
import { useQuestionForm } from "../hooks/useQuestionForm.jsx";

const QuestionForm = ({ onSearchComplete }) => {
    const {
        questions,
        answers,
        isLoading,
        directAddress,
        setDirectAddress,
        isGeoLoading,
        getLocation,
        handleSelect,
        handleSubmit,
    } = useQuestionForm(onSearchComplete);
    console.log(questions);

    return (
        <div className="diagnostic-card">
            {/* 質問リストの描画 */}
            {questions.map((q) => (
                <div key={q.id} className="question-block">
                    <h3 className="question-title">{q.title}</h3>
                    <div className="options-group">
                        {(q.query_items || q.queryItems || []).map((item) => (
                            <button
                                key={item.id}
                                className={`option-item ${answers[q.id] === item.id ? "selected" : ""}`}
                                onClick={() => handleSelect(q.id, item.id)}>
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* 検索条件入力の描画 */}
            <div style={{ marginTop: "20px" }}>
                <input
                    placeholder="場所を直接入力"
                    value={directAddress}
                    onChange={(e) => setDirectAddress(e.target.value)}
                />
                <button onClick={getLocation} disabled={isGeoLoading}>
                    {isGeoLoading ? "取得中..." : "現在地を使用"}
                </button>
            </div>

            {/* 送信ボタンの描画 */}
            <TempButton
                text="検索を実行"
                onClick={handleSubmit}
                disabled={isLoading}
            />
        </div>
    );
};

export default QuestionForm;
