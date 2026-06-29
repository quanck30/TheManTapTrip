import { useNavigate } from "react-router-dom";
import ListItem from "../components/cards/ListItem";
import { mockSpots } from "../data/mockSpots";

export default function SavedRoute() {
  const navigate = useNavigate();

  return (
    <div className="saved-list-container">
      {mockSpots.map((spot) => (
        <ListItem
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
