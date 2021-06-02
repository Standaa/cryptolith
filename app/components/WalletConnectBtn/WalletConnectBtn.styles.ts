import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  walletConnectBtnContainer: {
    alignSelf: "end",
    height: "50px",
    marginLeft: "1rem",
  },
  btn: {
    borderRight: "solid white 1px",
    borderRadius: "0",
    height: "inherit",
    color: theme.palette.common.white,
  },
  chevronBtn: {
    border: 0,
    boxShadow: "none",
    minWidth: "25px",
    maxWidth: "25px",
    marginLeft: "1px",
    borderRadius: "0 3px 3px 0",
    height: "inherit",
    color: theme.palette.common.white,
  },
  providerBtnContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "initial",
  },
  providerText: {
    color: "light-gray",
    fontWeight: 100,
    fontSize: "10px",
  },
  walletConnMenu: {
    color: theme.palette.common.black,
  },
}));
