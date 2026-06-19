/**
 * @brief 質問と回答を表示するカスタムフック
 * @Author J.Naka
 * @Date 26/06/15
 * @Update 26/06/15
 */

import { useState, useEffect } from "react";
import { queConf, defaultRadMap } from "../../Data/answerMap.js";
import { fetchQuestions, saveAnswers } from "../../api/questionApi";
import { searchPlaces } from "../../api/placeSearchApi";
import { useGeolocation } from "./useGeolocation";

export const useQuestionForm = (onSearchComplete) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [directAddress, setDirectAddress] = useState("");
    const [radius, setRadius] = useState(1000);

    const { location, getLocation, isLoading: isGeoLoading } = useGeolocation();

    /**
     * 起動時に位置情報を取得する
     */
    useEffect(() => {
        getLocation();
    }, []);

    /**
     * 起動時にDBから質問を取得する
     */
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const res = await fetchQuestions();
                const fetchedQuestions = res.data.questions;
                setQuestions(fetchedQuestions);

                const initialAnswers = {};
                fetchedQuestions.forEach((q) => {
                    if (q.choice !== null) {
                        initialAnswers[q.id] = q.choice;
                    }
                });
                setAnswers(initialAnswers);
            } catch (err) {
                console.error("質問の取得エラー:", err);
            }
        };
        loadQuestions();
    }, []);

    /**
     * 質問の選択を更新する
     */
    const handleSelect = (queId, itemId) => {
        setAnswers((prev) => ({ ...prev, [queId]: itemId }));
    };

    /**
     * 回答を保存して検索を実行する
     */
    const handleSubmit = async () => {
        if (!directAddress && (!location || !location.lat)) {
            alert(
                "現在地が取得できませんでした。位置情報を許可するか、場所を入力してください。",
            );
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            if (token) {
                const savePromises = Object.entries(answers).map(([qId, iId]) =>
                    saveAnswers(Number(qId), Number(iId)),
                );
                await Promise.all(savePromises);
            }

            const formattedAnswers = {};

            for (const [qIdStr, config] of Object.entries(queConf)) {
                const qId = Number(qIdStr);
                const userAnswerId = answers[qId];
                const targetQuestion = questions.find(
                    (q) => String(q.id) === String(qId),
                );

                const items = targetQuestion?.queryItems || [];
                const selectedItem = items.find(
                    (i) => String(i.itemId) === String(userAnswerId),
                );
                const mappedItemId = selectedItem
                    ? Number(selectedItem.itemId)
                    : null;

                console.log(
                    `Q${qId} | 主キー:${userAnswerId} | 変換用ID:${mappedItemId} | 変換後:${config.values[mappedItemId]}`,
                );

                formattedAnswers[config.apiKey] =
                    config.values[mappedItemId] ?? config.default;
            }

            console.log("2. 変換後の formattedAnswers:", formattedAnswers);
            const finalRadius = radius
                ? Number(radius)
                : defaultRadMap[formattedAnswers.travelMode] || 1000;

            const searchData = {
                radius: finalRadius,
                answers: formattedAnswers,
                ...(directAddress
                    ? { address: directAddress }
                    : { latitude: location?.lat, longitude: location?.lng }),
            };
            console.log(searchData);

            console.log("🚀 APIへ送信する検索データ:", searchData);

            const results = await searchPlaces(searchData);

            if (onSearchComplete) onSearchComplete(results);
        } catch (err) {
            console.error(err);
            alert("処理中にエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        questions,
        answers,
        isLoading,
        directAddress,
        setDirectAddress,
        radius,
        setRadius,
        isGeoLoading,
        getLocation,
        handleSelect,
        handleSubmit,
    };
};
