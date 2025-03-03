import ReactDOM from "react-dom/client";
import { authProvider } from "@services/auth.service";
import App from './App';
import { init } from "./locale";
import "./index.css";

init();
authProvider.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <App />
);
