import React, { ReactElement, useState } from "react";

import { Box, Menu, MenuItem, Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { useWallet } from "../Wallet/WalletProvider";
import { useStyles } from "./WalletConnectedBtn.styles";

export function WalletConnectedBtn(): ReactElement {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { wallet, setConnected } = useWallet();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    // Disconnect
    setAnchorEl(null);
  };

  const copyAddress = () => {
    console.log("copy");
  };

  const disconnectWallet = () => {
    setConnected(false);
    console.log("Disconnect Wallet");
  };

  const walletPublicKey = wallet.publicKey.toBase58();

  return (
    <Box className={classes.container}>
      <Button
        className={classes.btn}
        color="primary"
        disableElevation
        aria-label="Wallet options"
        onClick={handleClick}
      >
        <Box className={classes.providerBtnContainer}>
          <Typography className={classes.walletAddress}>
            {walletPublicKey}
          </Typography>
          <ArrowDropDownIcon />
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem className={classes.walletConnMenu} onClick={copyAddress}>
          Copy Address
        </MenuItem>
        <MenuItem className={classes.walletConnMenu} onClick={disconnectWallet}>
          Disconnect
        </MenuItem>
      </Menu>
    </Box>
  );
}
