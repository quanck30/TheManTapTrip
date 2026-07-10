/**
 * @brief 質問・回答・診断フローの状態をアプリ全体で保持するコンテキスト
 */

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
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

  const { location, status: locationStatus, error: locationError, getLocation } = useGeolocation();

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
      // バックエンドが返すメッセージをそのままトースト表示
      toast.error(err.message);
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
      // /home の位置情報必須ゲートを通過していれば通常ここには来ない（保険）
      toast.error("現在地が取得できませんでした。位置情報を許可してください。");
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
          // バックエンドが返すメッセージをそのままトースト表示
          toast.error(saveErr.message);

          // 401エラー（認証切れ）だった場合は、ログアウトしてAuthContextの状態をクリアする
          if (saveErr.message.includes("Unauthenticated") || saveErr.message.includes("401")) {
            logout();
          }
        }
      }

      const formattedAnswers = {};
      let radius = 1000;
      questions.forEach((q) => {
        const selectedItemId = answers[q.id];
        const selectedItem = q.queryItems.find((item) => item.itemId === selectedItemId);
        if (selectedItem) {
          formattedAnswers[q.questionType] = selectedItem.searchValue;
        }
        if (q.questionType === "travelMode" && selectedItem && selectedItem.radius) {
          // 移動手段で選ばれた検索半径を反映する（未指定なら既定の 1000 を維持）
          radius = selectedItem.radius;
        }
        if (q.questionType === "withChildren" && selectedItem) {
          formattedAnswers[q.questionType] = Boolean(selectedItem.searchValue);
        }
      });

      const searchData = {
        radius: radius,
        answers: formattedAnswers,
        ...(directAddress ? { address: directAddress } : { latitude: location?.lat, longitude: location?.lng }),
      };
      return await searchPlaces(searchData);
    } catch (err) {
      console.error(err);
      // バックエンドが返すメッセージをそのままトースト表示
      toast.error(err.message);
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
        locationStatus,
        locationError,
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
