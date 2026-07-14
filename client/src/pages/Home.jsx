import { useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useQuestion } from "../hooks/useQuestion";
import QuestionStep from "../components/home/QuestionStep";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Home({ onDiagnoseComplete }) {
  const {
    questions,
    questionsStatus,
    questionsError,
    getLocation,
    loadQuestions,
    locationStatus,
    locationError,
  } = useQuestion();

  // Home表示時に質問の取得と現在地の取得を行う
  useEffect(() => {
    loadQuestions();
    getLocation();
  }, []);

  // 位置情報が許可されるまでは質問フローに進ませない（厳格に必須）
  const isLocationGranted = locationStatus === "granted";
  const isLocating = locationStatus === "loading";
  // ブラウザ設定でブロック済み/非対応の場合は、再試行してもプロンプトが出ないため案内を切り替える
  const needsBrowserSettings = locationStatus === "denied" || locationStatus === "unsupported";

  return (
    <div className="home-container">
      {isLocationGranted ? (
        questionsStatus === "error" ? (
          // 取得失敗・質問が無い場合はエラーを表示して再読み込みを促す
          <div className="question-status">
            <p className="question-status-message">
              {questionsError || "質問の取得に失敗しました。"}
            </p>
            <Button onClick={loadQuestions}>再読み込み</Button>
          </div>
        ) : questions.length === 0 ? (
          // 読み込み中（idle / loading）はローディングを表示する
          <div className="question-status">
            <Loader2 className="question-status-spinner" />
            <span>質問を読み込み中...</span>
          </div>
        ) : (
          <div className="diagnostic-card">
            <QuestionStep onDiagnoseComplete={onDiagnoseComplete} />
          </div>
        )
      ) : null}

      {/* 位置情報の許可を必須にするゲート。許可されるまで閉じられない。 */}
      <AlertDialog open={!isLocationGranted}>
        <AlertDialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              位置情報の許可が必要です
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locationError
                ? locationError
                : "現在地の周辺からおすすめスポットをご提案するため、位置情報の利用を許可してください。"}
              {needsBrowserSettings && (
                <span className="mt-2 block">
                  ブラウザの設定で位置情報を「許可」に変更してから、もう一度お試しください。
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={getLocation} disabled={isLocating}>
              {isLocating ? "取得中..." : "位置情報を許可する"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Home;
