import { Grid, Link, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useStyles } from "./Home.styles";
import { PageLayout } from "../components/PageLayout/PageLayout";

export function Home(): ReactElement {
  const classes = useStyles();
  return (
    <PageLayout title={"Cryptolith"}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href="/cryptolith/01">
              <h5>Lith 0</h5>
            </Link>
            <video controls width="100">
              <source src="../assets/lith0.webm" type="video/webm"></source>
            </video>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 1</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 2</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 3</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 4</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 5</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 6</h5>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Link href={`/cryptolith/01`}>
              <h5>Lith 7</h5>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
