import { makeStyles } from "@material-ui/core";
import { SYSVAR_RECENT_BLOCKHASHES_PUBKEY } from "@solana/web3.js";

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    border: "solid white 1px",
    cursor: "pointer",
  },
  link: {
    color: "red",
  },
}));
