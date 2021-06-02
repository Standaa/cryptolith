import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  lithInfoContainer: {
    color: theme.palette.primary.main,
  },
  lithInfoTitle: {
    textAlign: "initial",
    fontStyle: "bolder",
    fontSize: "1.5rem",
  },
  lithInfoRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));
