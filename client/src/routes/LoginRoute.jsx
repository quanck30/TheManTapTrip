import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";

export default function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticatedUser } = useAuth();

  const handleLoginSuccess = (user) => {
    if (user) {
      setAuthenticatedUser(user);
    }

    const destination = location.state?.from?.pathname || "/home";
    navigate(destination, { replace: true });
  };

  return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigate("/register")} onBackToWelcome={() => navigate("/")} />;
}
