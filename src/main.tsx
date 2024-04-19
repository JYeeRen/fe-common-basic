import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import { init } from "./locale";
import { authProvider } from "@services/auth.service";
import "./index.css";

init();
authProvider.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
