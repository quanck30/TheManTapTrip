import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";
import { PlacesProvider } from "./context/PlacesContext.jsx";
import { Toaster } from "@/components/ui/sonner";

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GoogleClientID}>
          <QuestionProvider>
            <PlacesProvider>
              <App />
              <Toaster richColors position="top-center" />
            </PlacesProvider>
          </QuestionProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
