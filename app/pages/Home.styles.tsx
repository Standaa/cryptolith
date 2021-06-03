import { fade, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
  },
  gridItem: {
    minWidth: `${375 - theme.spacing(2)}px`,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    border: "solid white 1px",
    cursor: "pointer",
    minWidth: `${375 - 2 * theme.spacing(2)}px`,
    minHeight: "410px",
  },
  link: {
    color: "red",
  },
  contributeBtn: {
    marginTop: "1rem",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  amountInput: {
    height: "40px",
    border: "solid 1px #D3D3D3",
    background: "black",
    color: theme.palette.primary.main,
    borderRadius: "5px",
    "&:focus": {
      outline: "1px solid white",
      boxShadow: "none",
    },
  },
}));
