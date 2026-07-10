import { Navigate, Route, Routes } from "react-router-dom";

import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import WelcomeRoute from "./routes/WelcomeRoute";
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
