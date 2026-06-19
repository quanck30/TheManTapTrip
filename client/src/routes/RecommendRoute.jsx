import { useNavigate } from "react-router-dom";
import CardDisplay from "../components/cards/CardDisplay";
import { mockSpots } from "../Data/questions";

export default function RecommendRoute() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="recommend-title">おススメスポット</h2>
      <div className="spot-list">
        {mockSpots.map((spot) => (
          <CardDisplay
            key={spot.id}
            spot={spot}
            onCardClick={() => {
              navigate(`/detail/${spot.id}`, {
                state: { spot, from: "/recommend" },
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
