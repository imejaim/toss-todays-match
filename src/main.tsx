import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <TDSMobileAITProvider> */}
      <App />
      {/* </TDSMobileAITProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
