import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TestPage } from "./pages/test.jsx";
import App from "./App.jsx";

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GoogleClientID}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
);
