import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import Detail from "../pages/Detail";
import { usePlaces } from "../hooks/usePlaces";

export default function DetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { spotId } = useParams();
  const { getSpotById } = usePlaces();
  const spot = getSpotById(spotId) || location.state?.spot;

  if (!spot) {
    return <Navigate to="/recommend" replace />;
  }

  return (
    <>
      {/* 一覧から渡された状態を初期値にし、Detail側でDBの最新状態も確認する */}
      <Detail
        spot={spot}
        initialSaved={location.state?.isSaved ?? Boolean(spot.id || spot.isSaved)}
        onBack={() => navigate(location.state?.from || "/recommend")}
      />
    </>
  );
}
