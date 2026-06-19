import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../pages/loginPronpt";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <LoginPrompt
        onNavigateToLogin={() => {
          navigate("/login", {
            state: { from: location },
          });
        }}
      />
    );
  }

  return children;
}
