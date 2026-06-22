import React from "react";
import { useLocation } from "react-router-dom";
import CardDisplay from "../components/cards/CardDisplay";

const RecommendRoute = () => {
    const location = useLocation();

    // 💡 HomeRouteから渡されたデータを受け取る（無ければ空配列）
    const places = location.state?.places || [];

    return (
        <div className="recommend-page">
            <h2>あなたへのおすすめ</h2>
            {/* CardDisplay に配列データを渡す！ */}
            <CardDisplay places={places} />
        </div>
    );
};

export default RecommendRoute;
