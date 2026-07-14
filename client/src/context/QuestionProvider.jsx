/**
 * @brief 質問・回答・診断フローの状態をアプリ全体で保持するコンテキスト
 */

import { useState } from "react";
import { toast } from "sonner";
import { fetchQuestions, saveAnswers, validateAnswersComplete } from "../services/questionService";
import { searchPlaces } from "../services/placeService";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../hooks/useAuth";
import { QuestionContext } from "./QuestionContext";

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

  // 質問取得の状態: "idle" | "loading" | "success" | "error"
  const [questionsStatus, setQuestionsStatus] = useState("idle");
  const [questionsError, setQuestionsError] = useState(null);

  const { location, status: locationStatus, error: locationError, getLocation } = useGeolocation();

  /**
   * DBから質問を取得する（取得済みならスキップ）
   */
  const loadQuestions = async () => {
    // 取得済みなら何もしない（多重取得防止）
    if (questionForm.questions.length > 0) return;

    // 読み込み開始：UI 側に「読み込み中」を伝える
    setQuestionsStatus("loading");
    setQuestionsError(null);

    try {
      const res = await fetchQuestions();
      const fetchedQuestions = res?.data?.questions ?? [];

      // データが空（＝まだ質問が用意されていない）の場合はエラー扱いにする
      if (fetchedQuestions.length === 0) {
        setQuestionsStatus("error");
        setQuestionsError("現在、診断に使える質問がありません。しばらくしてからお試しください。");
        return;
      }

      // 回答はユーザーが実際に選択したときのみ設定する（事前入力しない）
      setQuestionForm((prev) => ({ ...prev, questions: fetchedQuestions }));
      setQuestionsStatus("success");
    } catch (err) {
      console.error("質問の取得エラー:", err);
      setQuestionsStatus("error");
      // バックエンドが返すメッセージを画面に表示する
      setQuestionsError(err.message || "質問の取得に失敗しました。");
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
   * @param {Object} answers - 送信する回答（questionId -> itemId）。呼び出し側（QuestionStep）で
   *   選択直後に確定させた最新の値を渡す。questionForm.answers は setState 反映前で
   *   stale な可能性があるため、ここでは読み直さない。
   */
  const submitAnswers = async (answers) => {
    if (!directAddress && (!location || !location.lat)) {
      // /home の位置情報必須ゲートを通過していれば通常ここには来ない（保険）
      toast.error("現在地が取得できませんでした。位置情報を許可してください。");
      return null;
    }

    const { questions } = questionForm;

    try {
      validateAnswersComplete(questions, answers);
    } catch (validationErr) {
      toast.error(validationErr.message);
      return null;
    }

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
        questionsStatus,
        questionsError,
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
        submitAnswers,
        reset,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
