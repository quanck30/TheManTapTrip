/**
 * @brief 質問と回答候補を表示する
 * @Author J.Naka
 * @Date 26/06/12
 * @Update 26/06/12
 */

import React, { useState, useEffect } from "react";
import { fetchQuestions, saveAnswers } from "../../api/questionApi";
import { searchPlaces } from "../../api/placeSearchApi";
import TempButton from "../buttons/TempButton";

const QuestionForm = ({ userId, onSearchComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { queId: itemId }
    const [isLoading, setIsLoading] = useState(false);

    // 範囲や位置情報のState
    const [searchParams] = useState({
        latitude: 34.7024, // 現実的な現在地取得に置き換え推奨
        longitude: 135.4959,
        radius: 1000,
    });

    useEffect(() => {
        // バックエンドから取得したデータ構造に合わせて調整
        fetchQuestions().then((res) => setQuestions(res.data.questions));
    }, []);

    const handleSelect = (queId, itemId) => {
        setAnswers((prev) => ({ ...prev, [queId]: itemId }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // choices配列の作成（バックエンドの saveAnswers 用）
            const choices = Object.entries(answers).map(([queId, itemId]) => ({
                userId: userId, // ログインしていれば付与
                questionId: Number(queId),
                queryItemId: Number(itemId),
            }));

            // 1. 登録処理 (userId がある場合のみ)
            if (userId) {
                await saveAnswers(userId, choices);
            }

            // 2. 検索処理 (全ユーザー共通)
            // バリデーションルール(PlaceSearchRequest)に合わせる
            const payload = {
                latitude: searchParams.latitude,
                longitude: searchParams.longitude,
                radius: searchParams.radius,
                answers: {
                    withChildren: false, // 必要に応じて追加
                    travelMode: "driving", // 必要に応じて追加
                    // ...その他のフィールド
                },
            };

            const results = await searchPlaces(payload);
            onSearchComplete(results);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="diagnostic-card">
            {questions.map((q) => (
                <div key={q.id} className="question-block">
                    <h3 className="question-title">{q.text}</h3>
                    <div className="options-group">
                        {q.queryItems.map((item) => (
                            <button
                                key={item.id}
                                className={`option-item ${answers[q.id] === item.id ? "selected" : ""}`}
                                onClick={() => handleSelect(q.id, item.id)}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <TempButton
                text="検索＆登録"
                onClick={handleSubmit}
                disabled={isLoading}
            />
        </div>
    );
};

export default QuestionForm;
