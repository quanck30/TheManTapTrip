import { useLocation } from "react-router-dom";
import CardDisplay from "../components/cards/CardDisplay";

const RecommendRoute = () => {
    const location = useLocation();
    const places = location.state?.places || [];

    return (
        <div>
            <h2 className="recommend-title">おススメスポット</h2>

            <CardDisplay places={places} />
        </div>
    );
};

export default RecommendRoute;
