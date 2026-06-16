import { useNavigate } from "react-router-dom";
import Home from "../pages/home";

export default function HomeRoute() {
  const navigate = useNavigate();

  return (
    <Home
      onDiagnoseComplete={(answers) => {
        navigate("/recommend", { state: { answers } });
      }}
    />
  );
}
