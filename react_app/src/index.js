import React from "react";
import ReactDOM from "react-dom/client";
import "./reset.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobalContextProvider } from "./context/GlobalContext";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { CashbackProvider } from "./context/CashbackContext";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalContextProvider>
      <CashbackProvider>
        <App />
      </CashbackProvider>
    </GlobalContextProvider>
  </React.StrictMode>
);

reportWebVitals();
