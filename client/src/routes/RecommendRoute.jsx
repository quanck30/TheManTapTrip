import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CardDisplay from "../components/cards/CardDisplay";

const RecommendRoute = () => {
    const location = useLocation();
    const places =
        location.state?.places ||
        JSON.parse(sessionStorage.getItem("recommendPlaces") || "[]");

    useEffect(() => {
        if (location.state?.places) {
            sessionStorage.setItem(
                "recommendPlaces",
                JSON.stringify(location.state.places),
            );
        }
    }, [location.state]);

    return (
        <div>
            <h2 className="recommend-title" style={{ padding: "0 20px" }}>
                おすすめスポット
            </h2>
            <CardDisplay places={places} />
        </div>
    );
};

export default RecommendRoute;
