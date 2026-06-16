import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import Detail from "../pages/detail";
import { mockSpots } from "../Data/questions";

export default function DetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { spotId } = useParams();
  const spot = location.state?.spot || mockSpots.find((item) => String(item.id) === String(spotId));

  if (!spot) {
    return <Navigate to="/recommend" replace />;
  }

  return (
    <div className="app-content-area">
      <Detail spot={spot} onBack={() => navigate(location.state?.from || "/recommend")} />
    </div>
  );
}
