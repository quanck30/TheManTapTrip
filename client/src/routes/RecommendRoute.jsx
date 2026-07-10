import { FaChevronLeft } from "react-icons/fa";
import CardDisplay from "../components/cards/CardDisplay";
import { usePlaces } from "../context/PlacesContext";
import { useNavigate } from "react-router-dom";

const RecommendRoute = () => {
  const { places } = usePlaces();
  const navigate = useNavigate();

  return (
    <div className="recommend">
      <div className="recommend-title">
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
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
