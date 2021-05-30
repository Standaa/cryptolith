import React, { ReactElement } from "react";

import {
  Box,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { Program, Provider, web3 } from "@project-serum/anchor";
import Wallet from "@project-serum/sol-wallet-adapter";
import { useStyles } from "./App.styles";

// import idl from "../target/idl/test";

export function App(): ReactElement {
  const classes = useStyles();
  const NETWORK_URL_KEY = "http://localhost:8899";
  let WALLET_URL_KEY = "https://phantom.app/";
  const PROGRAM_ID_KEY = "BTUP4TioquQzGDE9wD5qiTzPKQjDaaJNxHSdV3rD6JyM";

  const connection = new web3.Connection(NETWORK_URL_KEY);
  const programId = new web3.PublicKey(PROGRAM_ID_KEY);

  const opts: web3.ConfirmOptions = {
    preflightCommitment: "singleGossip",
    commitment: "confirmed",
  };

  const seed = "testSeed";
  let userWallet: any;
  let derivedAccount: web3.PublicKey;
  let provider: Provider;
  let cryptolithProgram: Program;

  const [providerWallet, setProviderWallet] = React.useState<String>("Phantom");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    const selectedWalletProvider = event.target?.innerText;
    setProviderWallet(selectedWalletProvider);
    setAnchorEl(null);
    console.log(providerWallet);
  };

  const connectWallet = async () => {
    if (providerWallet === "Phantom") {
      const isPhantomInstalled = window.solana && window.solana.isPhantom;
      if (isPhantomInstalled) {
        userWallet = window.solana;
      } else {
        WALLET_URL_KEY = "https://phantom.app/";
        userWallet = new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY);
      }
    } else if (providerWallet === "Sollet") {
      WALLET_URL_KEY = "https://www.sollet.io";
      userWallet = new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY);
    }

    userWallet.on("connect", (publicKey: { toBase58: () => string }) =>
      console.log("Connected to " + publicKey.toBase58())
    );
    userWallet.on("disconnect", () => console.log("Disconnected"));
    await userWallet.connect();

    provider = new Provider(connection, userWallet, opts);
    // poolProgram = new Program(idl, programId, provider);

    console.log("wallet.publicKey", userWallet.publicKey);
    derivedAccount = await web3.PublicKey.createWithSeed(
      provider.wallet.publicKey,
      seed,
      cryptolithProgram.programId
    );
  };

  const processDeposit = async () => {
    try {
      console.log("User wallet address", userWallet.publicKey.toBase58());
      console.log("User derived address", derivedAccount.toBase58());

      await cryptolithProgram.rpc.initializeUserPoolAccount({
        accounts: {
          userPoolAccount: derivedAccount,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        instructions: [
          await web3.SystemProgram.createAccountWithSeed({
            basePubkey: userWallet.publicKey,
            fromPubkey: userWallet.publicKey,
            lamports: 1e7,
            newAccountPubkey: derivedAccount,
            programId: cryptolithProgram.programId,
            seed: seed,
            space: 8 + 128,
          }),
        ],
      });

      const userAccountAfterInit =
        await cryptolithProgram.account.userPoolAccount(derivedAccount);
      console.log(
        "Derived Account after init & creation:",
        userAccountAfterInit
      );

      console.log("Success");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* <Button
        className={classes.btn}
        variant="contained"
        color="primary"
        disableElevation
        onClick={testConnection}
      >
        Test Connection
      </Button> */}
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
            {providerWallet}
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

      {/* <Typography>{walletProvider}</Typography> */}

      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disableElevation
        onClick={processDeposit}
      >
        Send SOL and mint Token
      </Button> */}
    </>
  );
}
