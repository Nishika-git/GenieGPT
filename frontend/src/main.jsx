import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Auth0Provider } from '@auth0/auth0-react';
ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-nishika28.us.auth0.com"
    clientId="94WhBs2BKEfGEe7TwlkNrUlmdeej0qxX"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
  <AuthProvider>
    <App />
  </AuthProvider>
  </Auth0Provider>
);
