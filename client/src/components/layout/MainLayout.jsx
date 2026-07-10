import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
export default function MainLayout() {
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
