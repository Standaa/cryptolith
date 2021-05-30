import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";

const MOUNT_NODE = document.getElementById("app");

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary key="root-error-boundary">
      <App />
    </ErrorBoundary>
  </BrowserRouter>,
  MOUNT_NODE
);
