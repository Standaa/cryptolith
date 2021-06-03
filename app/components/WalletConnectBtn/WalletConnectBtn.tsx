import React, { ReactElement } from "react";

import { Box, Menu, MenuItem, Typography, Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { useWallet } from "../Wallet/WalletProvider";
import { useStyles } from "./WalletConnectBtn.styles";

export function WalletConnectBtn(): ReactElement {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { providerName, setProviderName, wallet, setConnected } = useWallet();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelection = (event: any) => {
    const selectedWalletProvider = event.target?.innerText;
    if (selectedWalletProvider) setProviderName(selectedWalletProvider);
    setAnchorEl(null);
  };

  const connectWallet = async () => {
    await wallet.connect();
    setConnected(true);
  };

  return (
    <Box className={classes.walletConnectBtnContainer}>
      <Button
        className={classes.btn}
        disableElevation
        aria-label="connect wallet"
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
        disableElevation
        aria-label="select wallet"
        onClick={handleClick}
      >
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleSelection}
      >
        <MenuItem className={classes.walletConnMenu} onClick={handleSelection}>
          Phantom
        </MenuItem>
        <MenuItem className={classes.walletConnMenu} onClick={handleSelection}>
          Sollet
        </MenuItem>
      </Menu>
    </Box>
  );
}
