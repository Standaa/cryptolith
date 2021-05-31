import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  walletConnectBtnContainer: {
    alignSelf: "end",
    height: "50px",
    marginLeft: "1rem",
  },
  btn: {
    borderRadius: "3px 0 0 3px",
    height: "inherit",
    // maxWidth: "14vw",
  },
  chevronBtn: {
    border: 0,
    boxShadow: "none",
    minWidth: "25px",
    maxWidth: "25px",
    marginLeft: "1px",
    background: "#3f51b5",
    borderRadius: "0 3px 3px 0",
    height: "inherit",
    color: "white",
    "&:hover": {
      background: "#303F9F",
    },
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
  select: {
    display: "none",
  },
}));
