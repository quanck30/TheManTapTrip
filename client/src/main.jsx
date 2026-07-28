import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { APIProvider } from "@vis.gl/react-google-maps";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { QuestionProvider } from "./context/QuestionProvider.jsx";
import { PlacesProvider } from "./context/PlacesProvider.jsx";
import { Toaster } from "@/components/ui/sonner";

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GoogleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY || import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <APIProvider apiKey={GoogleMapsApiKey}>
          <GoogleOAuthProvider clientId={GoogleClientID}>
            <QuestionProvider>
              <PlacesProvider>
                <App />
                <Toaster richColors position="top-center" />
              </PlacesProvider>
            </QuestionProvider>
          </GoogleOAuthProvider>
        </APIProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
