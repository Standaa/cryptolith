import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { useStyles } from "./App.styles";
import { NotFound } from "./components/NotFound";
import { Home } from "./pages/Home";
import { CryptoLith } from "./components/CryptoLith";

export function App(): ReactElement {
  const classes = useStyles();

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/cryptolith/:id" component={CryptoLith} />
      <Route
        path="*"
        component={(): ReactElement => (
          <NotFound
            title="Page not found"
            body={
              <Typography variant="body1">
                We have made a note of this rare event.
              </Typography>
            }
          />
        )}
      />
    </Switch>
  );
}
