import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
