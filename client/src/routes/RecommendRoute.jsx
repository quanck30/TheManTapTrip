import React from "react";
import { useLocation } from "react-router-dom";
import CardDisplay from "../components/cards/CardDisplay";

const RecommendRoute = () => {
    const location = useLocation();

    // Homeから渡された state.places を受け取る。無ければ空配列。
    const places = location.state?.places || [];

    return (
        <div className="recommend-page" style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                あなたへのおすすめの場所
            </h2>

            {/* CardDisplay に配列を渡す！ */}
            <CardDisplay places={places} />
        </div>
    );
};

export default RecommendRoute;
