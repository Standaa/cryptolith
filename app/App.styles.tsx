import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  btn: {
    marginLeft: "1rem",
    minHeight: "50px",
    borderRadius: "3px 0 0 3px",
  },
  chevronBtn: {
    border: 0,
    boxShadow: "none",
    minWidth: "25px",
    maxWidth: "10px",
    marginLeft: "1px",
    background: "#3f51b5",
    borderRadius: "0 3px 3px 0",
    minHeight: "50px",
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
