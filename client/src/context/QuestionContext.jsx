/**
 * @brief 質問・回答・診断フローの状態をアプリ全体で保持するコンテキスト
 */

import { createContext, useContext, useEffect, useState } from "react";
import { queConf, defaultRadMap } from "../data/answerMap.js";
import { fetchQuestions, saveAnswers } from "../services/questionService";
import { searchPlaces } from "../services/placeService";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "./AuthContext";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  // 質問一覧・回答・診断フローの状態（sessionStorage から復元し、Homeに戻っても回答を保持）
  const [questionForm, setQuestionForm] = useState(() => ({
    questions: [],
    answers: {},
  }));
  const [currentStep, setCurrentStep] = useState(() => parseInt("0", 10));
  const [isConfirming, setIsConfirming] = useState();
  const [directAddress, setDirectAddress] = useState("");

  const { location, getLocation } = useGeolocation();

  /**
   * DBから質問を取得する（取得済みならスキップ）
   */
  const loadQuestions = async () => {
    if (questionForm.questions.length > 0) return;
    try {
      const res = await fetchQuestions();
      const fetchedQuestions = res.data.questions;

      // 回答はユーザーが実際に選択したときのみ設定する（事前入力しない）
      setQuestionForm((prev) => ({ ...prev, questions: fetchedQuestions }));
    } catch (err) {
      console.error("質問の取得エラー:", err);
    }
  };

  /**
   * 質問の選択を更新する
   */
  const handleSelect = (queId, itemId) => {
    setQuestionForm((prev) => ({
      ...prev,
      answers: { ...prev.answers, [queId]: itemId },
    }));
  };

  /**
   * 回答を保存して検索を実行する。検索結果を返す（呼び出し側で遷移を行う）
   */
  const handleSubmit = async () => {
    if (!directAddress && (!location || !location.lat)) {
      alert("現在地が取得できませんでした。位置情報を許可するか、場所を入力してください。");
      return null;
    }

    const { questions, answers } = questionForm;

    try {
      if (isAuthenticated) {
        try {
          const savePromises = Object.entries(answers).map(([questionId, itemId]) => saveAnswers(Number(questionId), Number(itemId)));
          await Promise.all(savePromises);
        } catch (saveErr) {
          // 保存に失敗しても、検索処理を止めないようにここでエラーを吸収する
          console.warn("⚠️ 回答の保存に失敗しましたが、検索を続行します:", saveErr);

          // 401エラー（認証切れ）だった場合は、ログアウトしてAuthContextの状態をクリアする
          if (saveErr.message.includes("Unauthenticated") || saveErr.message.includes("401")) {
            logout();
          }
        }
      }

      const formattedAnswers = {};
      const radius = 1000;
      questions.forEach((q) => {
        const selectedItemId = answers[q.id];
        const selectedItem = q.queryItems.find((item) => item.itemId === selectedItemId);
        if (selectedItem) {
          formattedAnswers[q.questionType] = selectedItem.searchValue;
        }
        if (q.questionType === "travelMode" && selectedItem) {
          const radius = selectedItem.radius;
        }
      });

      const searchData = {
        radius: radius,
        answers: formattedAnswers,
        ...(directAddress ? { address: directAddress } : { latitude: location?.lat, longitude: location?.lng }),
      };
      console.log("検索データ:", searchData);
      return await searchPlaces(searchData);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  /**
   * 表示位置のみ最初の質問に戻す（回答は保持する）
   */
  const reset = () => {
    setCurrentStep(0);
    setIsConfirming(false);
  };

  return (
    <QuestionContext.Provider
      value={{
        questions: questionForm.questions,
        answers: questionForm.answers,
        currentStep,
        setCurrentStep,
        isConfirming,
        setIsConfirming,
        directAddress,
        setDirectAddress,
        getLocation,
        loadQuestions,
        handleSelect,
        handleSubmit,
        reset,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => useContext(QuestionContext);
