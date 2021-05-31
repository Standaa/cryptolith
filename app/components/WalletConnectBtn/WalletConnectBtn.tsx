import React, { ReactElement } from "react";

import { Box, Menu, MenuItem, Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { useWallet } from "../Wallet/WalletProvider";
import { useStyles } from "./WalletConnectBtn.styles";

export function WalletConnectBtn(): ReactElement {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { providerName, setProviderName, wallet } = useWallet();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    const selectedWalletProvider = event.target?.innerText;
    setProviderName(selectedWalletProvider);
    setAnchorEl(null);
  };

  const connectWallet = async () => {
    wallet.on("connect", (publicKey: { toBase58: () => string }) =>
      console.log("Connected to " + publicKey.toBase58())
    );
    wallet.on("disconnect", () => console.log("Disconnected"));

    await wallet.connect();

    console.log("wallet.publicKey", wallet.publicKey);
  };

  return (
    <Box className={classes.walletConnectBtnContainer}>
      <Button
        className={classes.btn}
        variant="contained"
        color="primary"
        disableElevation
        onClick={connectWallet}
      >
        <Box className={classes.providerBtnContainer}>
          <Typography>Connect Wallet</Typography>
          <Typography className={classes.providerText}>
            {providerName}
          </Typography>
        </Box>
      </Button>

      <Button
        className={classes.chevronBtn}
        color="primary"
        aria-label="select wallet"
        onClick={handleClick}
      >
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Phantom</MenuItem>
        <MenuItem onClick={handleClose}>Sollet</MenuItem>
      </Menu>
    </Box>
  );
}
