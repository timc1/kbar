import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Could not find a #root element to mount into.");
}

createRoot(container).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
