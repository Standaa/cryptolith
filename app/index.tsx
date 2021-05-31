import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import { App } from "./App";
import { theme } from "./themes/defaultTheme";
import { ErrorBoundary } from "./ErrorBoundary";
import WalletProvider from "./components/Wallet/WalletProvider";
import { MuiThemeProvider } from "@material-ui/core";

const MOUNT_NODE = document.getElementById("app");

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <ErrorBoundary key="root-error-boundary">
        <WalletProvider>
          <App />
        </WalletProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </MuiThemeProvider>,
  MOUNT_NODE
);
