import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Register from "../pages/Register";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleRegisterSuccess = (user) => {
    if (user) {
      setAuthenticatedUser(user);
    }

    // 登録完了後は、戻る履歴に依存せずホーム画面へ移動する
    navigate("/home", { replace: true });
  };

  return <Register onRegisterSuccess={handleRegisterSuccess} />;
}
