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

    // 通常のログイン画面には `from` がないため、必ずホームへ遷移する。
    // 保護ページから来た場合だけ、ログイン前のページへ戻す。
    const from = location.state?.from;
    const destination = from?.pathname && from.pathname !== "/login"
      ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
      : "/home";
    navigate(destination, { replace: true });
  };

  return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigate("/register")} onBackToWelcome={() => navigate("/")} />;
}
