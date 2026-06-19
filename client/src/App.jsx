import { Navigate, Route, Routes } from "react-router-dom";

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

import Profile from "./pages/profile";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./routes/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import WelcomeRoute from "./routes/WelcomRoute";
import LoginRoute from "./routes/LoginRoute";
import RegisterRoute from "./routes/RegisterRoute";
import HomeRoute from "./routes/HomeRoute";
import RecommendRoute from "./routes/RecommendRoute";
import SavedRoute from "./routes/SavedRoute";
import DetailRoute from "./routes/DetailRoute";

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
