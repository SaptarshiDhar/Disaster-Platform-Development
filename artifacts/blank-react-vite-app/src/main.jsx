import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "leaflet/dist/leaflet.css";
import "./index.css";
// Shared module styles cover the login screen too, so they must load eagerly
// rather than arriving with the lazy command-centre bundle.
import "./styles/command-modules.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);