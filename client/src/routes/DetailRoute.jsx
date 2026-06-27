import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import Detail from "../pages/Detail";
import { mockSpots } from "../data/mockSpots";
import { usePlaces } from "../context/PlacesContext";

export default function DetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { spotId } = useParams();
  const { getSpotById } = usePlaces();
  const spot = getSpotById(spotId) || mockSpots.find((item) => String(item.id) === String(spotId));

  if (!spot) {
    return <Navigate to="/recommend" replace />;
  }

  return (
    <>
      <Detail spot={spot} onBack={() => navigate(location.state?.from || "/recommend")} />
    </>
  );
}
