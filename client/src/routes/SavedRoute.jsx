import { useNavigate } from "react-router-dom";
import SaveListCard from "../components/cards/SaveListCard";
import { mockSpots } from "../data/mockSpots";

export default function SavedRoute() {
  const navigate = useNavigate();

  return (
    <div className="saved-list-container">
      {mockSpots.map((spot) => (
        <SaveListCard
          key={spot.id}
          spot={spot}
          onClick={() => {
            navigate(`/detail/${spot.id}`, {
              state: { spot, from: "/saved" },
            });
          }}
        />
      ))}
    </div>
  );
}
