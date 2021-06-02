import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  appBar: {
    background: theme.palette.secondary.main,
  },
  toolbar: {
    maxWidth: 1800,
    width: "100%",
    margin: "0 auto",
    color: theme.palette.primary.main,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bolder",
    textTransform: "uppercase",
    flexGrow: 1,
    textAlign: "center",
    marginLeft: "16vw",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  content: {
    padding: theme.spacing(2),
    width: "100%",
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: 65,
  },
  contentContainer: {
    maxWidth: 1800,
    margin: "0 auto",
  },
  background: {
    position: "absolute",
  },
}));
