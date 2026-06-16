/**
 * @brief QuestionForm用のカスタムフック
 * @Author J.Naka
 * @Date 26/06/15
 * @Update 26/06/15
 */

import { useState, useEffect } from "react";
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

    const handleSelect = (queId, itemId) => {
        setAnswers((prev) => ({ ...prev, [queId]: itemId }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            if (token) {
                const choices = Object.entries(answers).map(([qId, iId]) => ({
                    questionId: Number(qId),
                    queryItemId: Number(iId),
                }));
                await saveAnswers(choices);
            }

            const searchData = {
                radius: Number(radius),
                ...(directAddress
                    ? { address: directAddress }
                    : { latitude: location?.lat, longitude: location?.lng }),
            };

            const results = await searchPlaces(searchData);
            onSearchComplete(results);
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
