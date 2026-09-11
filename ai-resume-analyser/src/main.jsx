import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="229145103899-dqim5r60ismspq38f6lrgtfcut0650jp.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
); 