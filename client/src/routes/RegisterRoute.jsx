import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Register from "../pages/register";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleRegisterSuccess = (user) => {
    if (user) {
      setAuthenticatedUser(user);
    }

    navigate("/home", { replace: true });
  };

  return <Register onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => navigate("/login")} onBackToWelcome={() => navigate("/")} />;
}
