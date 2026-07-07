import React from "react";
import { FaArrowLeft, FaStar, FaYenSign, FaMapMarkerAlt } from "react-icons/fa";
import TempButton from "../components/buttons/TempButton";
import "../styles/detail.css";
import noImage from "../assets/no_image.jpg";

function Home({ onDiagnoseComplete }) {
  const { questions, isConfirming, getLocation, loadQuestions } = useQuestion();

  // Home表示時に質問の取得と現在地の取得を行う
  useEffect(() => {
    loadQuestions();
    getLocation();
  }, []);

  if (questions.length === 0) return <div className="home-container">読み込み中...</div>;

  return (
    <div className="home-container">
      <div className="diagnostic-card">
        <QuestionStep onDiagnoseComplete={onDiagnoseComplete} />
      </div>
    </div>
  );
}

export default Detail;