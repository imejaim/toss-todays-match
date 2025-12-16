import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
