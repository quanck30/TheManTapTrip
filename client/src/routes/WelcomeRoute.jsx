import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Welcome from "../pages/Welcome";

export default function WelcomeRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <Welcome onStartExplore={() => navigate("/home")} onNavigateToLogin={() => navigate("/login")} onNavigateToRegister={() => navigate("/register")} />;
}
