import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import "./Styles/reset.css";
import "./Styles/variables.css";
import "./Styles/global.css";
import "./Styles/layout.css";
import "./Styles/button.css";
import "./Styles/card.css";
import "./Styles/welcome.css";
import "./Styles/login.css";
import "./Styles/home.css";
import "./Styles/profile.css";
import "./Styles/detail.css";

import CardDisplay from "./components/cards/CardDisplay";
import ListItem from "./components/cards/ListItem";
import Navigation from "./components/layout/Navigation";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import LoginPrompt from "./pages/loginPronpt";
import Home from "./pages/home";
import Detail from "./pages/detail";
import Profile from "./pages/profile";
import { mockSpots } from "./Data/questions";
import { useAuth } from "./context/AuthContext";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split("/")[1] || "home";

  return (
    <>
      <div className="app-content-area">
        <Outlet />
      </div>
      <Navigation currentTab={currentTab} onTabChange={(tab) => navigate(`/${tab}`)} />
    </>
  );
}

function ProtectedRoute({ children }) {
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

function WelcomeRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <Welcome onStartExplore={() => navigate("/home")} onNavigateToLogin={() => navigate("/login")} onNavigateToRegister={() => navigate("/register")} />;
}

function LoginRoute() {
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

function RegisterRoute() {
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

function HomeRoute() {
  const navigate = useNavigate();

  return (
    <Home
      onDiagnoseComplete={(answers) => {
        navigate("/recommend", { state: { answers } });
      }}
    />
  );
}

function RecommendRoute() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="recommend-title">おススメスポット</h2>
      <div className="spot-list">
        {mockSpots.map((spot) => (
          <CardDisplay
            key={spot.id}
            spot={spot}
            onCardClick={() => {
              navigate(`/detail/${spot.id}`, {
                state: { spot, from: "/recommend" },
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SavedRoute() {
  const navigate = useNavigate();

  return (
    <div className="saved-list-container">
      {mockSpots.map((spot) => (
        <ListItem
          key={spot.id}
          spot={spot}
          onClick={() => {
            navigate(`/detail/${spot.id}`, {
              state: { spot, from: "/saved" },
            });
          }}
        />
      ))}
    </div>
  );
}

function DetailRoute() {
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

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-body">
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<WelcomeRoute />} />
          <Route path="/welcome" element={<WelcomeRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />

          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomeRoute />} />
            <Route path="/recommend" element={<RecommendRoute />} />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/detail/:spotId" element={<DetailRoute />} />
          <Route path="/spots/:spotId" element={<DetailRoute />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
