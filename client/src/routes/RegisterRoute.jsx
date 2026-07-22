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

    navigate(-1, { replace: true });
  };

  return <Register onRegisterSuccess={handleRegisterSuccess} />;
}
