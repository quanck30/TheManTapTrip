import { FaChevronLeft } from "react-icons/fa";
import CardDisplay from "../components/cards/CardDisplay";
import { usePlaces } from "../context/PlacesContext";

import "../styles/card.css";

const RecommendRoute = () => {
  const { places } = usePlaces();

  return (
    <div className="recommend">
      <div className="recommend-title">
        <button>
          <FaChevronLeft color="#2d3748" />
        </button>
        <h2> おすすめスポット</h2>
        <button></button>
      </div>
      <CardDisplay places={places} />
    </div>
  );
};

export default RecommendRoute;
