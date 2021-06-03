import React, { useEffect, ReactNode, ReactElement } from "react";

import {
  CssBaseline,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { theme } from "../../themes/defaultTheme";
import { useStyles } from "./PageLayout.styles";
import { WalletConnectBtn } from "../WalletConnectBtn";
import { WalletConnectedBtn } from "../WalletConnectedBtn";
import { useWallet } from "../Wallet/WalletProvider";
import { useHistory } from "react-router-dom";

interface Props {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: Props): ReactElement {
  const classes = useStyles();
  const history = useHistory();
  const { connected } = useWallet();

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
            <Typography
              className={classes.title}
              onClick={() => {
                history.push("/");
              }}
            >
              Cryptolith
            </Typography>
            {!connected && <WalletConnectBtn />}
            {connected && <WalletConnectedBtn />}
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.contentContainer}>{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
