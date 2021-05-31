import React, { useEffect, ReactNode, ReactElement } from "react";

import { CssBaseline, ThemeProvider, AppBar, Toolbar } from "@material-ui/core";

import { theme } from "../../themes/defaultTheme";
import { useStyles } from "./PageLayout.styles";
import { WalletConnectBtn } from "../WalletConnectBtn";

interface Props {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: Props): ReactElement {
  const classes = useStyles({});

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          elevation={0}
          position="fixed"
          data-testid="[Header]"
          className={classes.appBar}
        >
          <Toolbar className={`${classes.toolbar}`}>
            <h1 className={classes.title}>Cryptolith</h1>
            <WalletConnectBtn />
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.contentContainer}>{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
