import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { fetchQuestions, saveAnswers } from "../services/questionService";
import { searchPlaces } from "../services/placeService";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "./AuthContext";

export const QuestionContext = createContext();

const QUESTIONS_STORAGE_KEY = "questionForm";

export const QuestionProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  // 質問一覧・回答・診断フローの状態（sessionStorage から復元し、Homeに戻っても回答を保持）
  const [questionForm, setQuestionForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem(QUESTIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // 壊れていたら無視して初期値を使う
    }
    return { questions: [], answers: {} };
  });

  const [currentStep, setCurrentStep] = useState(() => parseInt("0", 10));
  const [isConfirming, setIsConfirming] = useState();
  const [directAddress, setDirectAddress] = useState("");

  const { location, status: locationStatus, error: locationError, getLocation } = useGeolocation();

  // questionForm が変わるたびに sessionStorage へ同期
  const updateQuestionForm = (updater) => {
    setQuestionForm((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        sessionStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 保存失敗（容量超過など）は無視
      }
      return next;
    });
  };

  /**
   * DBから質問を取得する（取得済みならスキップ）
   */
  const loadQuestions = async () => {
    if (questionForm.questions.length > 0) return; // sessionStorage復元済みならここでスキップされる
    try {
      const res = await fetchQuestions();
      const fetchedQuestions = res.data.questions;
      updateQuestionForm((prev) => ({ ...prev, questions: fetchedQuestions }));
    } catch (err) {
      console.error("質問の取得エラー:", err);
      toast.error(err.message);
    }
  };

  const handleSelect = (queId, itemId) => {
    updateQuestionForm((prev) => ({
      ...prev,
      answers: { ...prev.answers, [queId]: itemId },
    }));
  };

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
