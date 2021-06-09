import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  fade,
  Grid,
  Paper,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import { useStyles } from "./Home.styles";
import { PageLayout } from "../components/PageLayout/PageLayout";
import { BottomInfo } from "../components/BottomInfo";
import { LithInfo } from "../components/LithInfo";
import { LithInfoProps } from "../components/LithInfo/LithInfo";
import { useWallet } from "../components/Wallet/WalletProvider";

import lith0 from "../assets/Lith0_500px.mp4";
import lith1 from "../assets/Lith1_500px.mp4";
import lith2 from "../assets/Lith2_500px.mp4";
import lith3 from "../assets/Lith3_500px.mp4";
import lith4 from "../assets/Lith4_500px.mp4";
import lith5 from "../assets/Lith5_500px.mp4";
import lith6 from "../assets/Lith6_500px.mp4";
import lith7 from "../assets/Lith7_500px.mp4";
import lith8 from "../assets/Lith8_500px.mp4";
import { theme } from "../themes/defaultTheme";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN, web3 } from "@project-serum/anchor";
import { config } from "../config";
import { getAssociatedAddress } from "../utils";

export function Home(): ReactElement {
  const classes = useStyles();
  const { wallet, connection, cryptolithProgram } = useWallet();
  const [open, setOpen] = useState(false);
  const [contributeAmount, setContributeAmount] = useState(10);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const liths: LithInfoProps[] = [
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3,
      patrons: 0,
      geo: "Fréhel",
      src: lith0,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 2.7,
      patrons: 0,
      geo: "Fréhel",
      src: lith1,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3.4,
      patrons: 0,
      geo: "Fréhel",
      src: lith2,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3.2,
      patrons: 0,
      geo: "Fréhel",
      src: lith3,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 2.8,
      patrons: 0,
      geo: "Fréhel",
      src: lith4,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 2.8,
      patrons: 0,
      geo: "Fréhel",
      src: lith5,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3.1,
      patrons: 0,
      geo: "Fréhel",
      src: lith6,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3.2,
      patrons: 0,
      geo: "Fréhel",
      src: lith7,
    },
    {
      fundingLevel: 0,
      committedAmount: 0,
      height: 3.5,
      patrons: 0,
      geo: "Fréhel",
      src: lith8,
    },
  ];

  const handleSubmit = async () => {
    try {
      const lithState = await cryptolithProgram.state.fetch();
      console.log(lithState);
      const lithMint: web3.PublicKey = lithState.lithMint;

      console.log("mintAddress", lithMint.toBase58());

      const userAssociatedLithAddress = await getAssociatedAddress(connection, lithMint, wallet);

      console.log("userAssociatedLithAddress", userAssociatedLithAddress.address.toBase58());

      const lithAccount: web3.PublicKey = lithState.lithAccount;
      console.log("lithAccount", lithAccount.toBase58());

      console.log("Lith Program state", await cryptolithProgram.state.fetch());

      const lithChildMint = new web3.PublicKey(config.lithChildMint);

      const userAssociatedLithChildAddress = await getAssociatedAddress(connection, lithChildMint, wallet);
      console.log("userAssociatedLithChildAddress", userAssociatedLithChildAddress.address.toBase58());

      const success = await cryptolithProgram.state.rpc.contributeCryptolith(
        new BN(contributeAmount),
        new web3.PublicKey(config.lithChildMint),
        {
          accounts: {
            fromLith: lithAccount,
            toLith: userAssociatedLithAddress,
            lithAuthority: new web3.PublicKey(config.lithAuthority),
            fromLithChild: new web3.PublicKey(config.lithChildAccount),
            toLithChild: userAssociatedLithChildAddress,
            lithChildAuthority: new web3.PublicKey(config.lithChildMint),
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        },
      );

      console.log(success);

      // const ix = await cryptolithProgram.state.instruction.contributeCryptolith(
      //   new BN(10),
      //   lithChildMint.publicKey,
      //   {
      //     accounts: {
      //       fromLith: lithAccount,
      //       toLith: userLithAddress,
      //       lithAuthority: lithMint.publicKey,
      //       fromLithChild: lithChildAccount,
      //       toLithChild: userLithChildAddress,
      //       lithChildAuthority: lithChildMint.publicKey,
      //       tokenProgram: TOKEN_PROGRAM_ID,
      //     },
      //     signer: [provider.wallet.publicKey],
      //   },
      // );

      // let tx = new web3.Transaction().add(ix);

      // let { blockhash } = await provider.connection.getRecentBlockhash();
      // tx.recentBlockhash = blockhash;
      // tx.feePayer = provider.wallet.publicKey;
      // await provider.wallet.signTransaction(tx);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const amountStr = event?.target?.value;
    let amountNum;
    if (amountStr) {
      try {
        amountNum = parseInt(amountStr);
        setContributeAmount(amountNum);
      } catch (e) {
        console.log("Not a num");
      }
    }
  };

  return (
    <PageLayout title={"Cryptolith"}>
      <Dialog
        BackdropProps={{
          style: {
            background: fade(theme.palette.secondary.main, 0.8),
          },
        }}
        PaperProps={{
          style: {
            backgroundColor: "black",
            boxShadow: "none",
            border: "solid 1px white",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="contribute-dialog"
      >
        <DialogTitle id="contribute-dialog-title">Contribute</DialogTitle>
        <DialogContent>
          <DialogContentText color="primary">
            Contribute to this Lith and claim your share of the Cryptolithic age.
          </DialogContentText>

          <Box className={classes.formContainer}>
            <p>Amount</p>
            <input
              className={classes.amountInput}
              type="text"
              value={contributeAmount}
              onChange={handleChange}
            />
            <Button
              className={classes.contributeBtn}
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
            >
              Contribute
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="secondary">
            Fund
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container className={classes.root} spacing={2}>
        {liths &&
          liths.map((lith, index) => {
            return (
              <Grid key={`sthg+${index}`} className={classes.gridItem} item xs={3}>
                <Paper className={classes.paper}>
                  <video width="200" autoPlay loop playsInline style={{ width: 300, height: 300 }}>
                    <source src={lith.src} type="video/mp4"></source>
                  </video>
                  <LithInfo
                    lithNumber={index}
                    fundingLevel={lith.fundingLevel}
                    committedAmount={lith.committedAmount}
                    height={lith.height}
                    patrons={lith.patrons}
                    geo={lith.geo}
                  />
                  <Button
                    className={classes.contributeBtn}
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Contribute
                  </Button>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
      <BottomInfo />
    </PageLayout>
  );
}
