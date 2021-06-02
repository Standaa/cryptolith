import { Grid, Link, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useStyles } from "./Home.styles";
import { PageLayout } from "../components/PageLayout/PageLayout";

import lithvid from "../assets/lith0.webm";
import { BottomInfo } from "../components/BottomInfo";
import { LithInfo } from "../components/LithInfo";
import { LithInfoProps } from "../components/LithInfo/LithInfo";

export function Home(): ReactElement {
  const classes = useStyles();

  const showLith = (lithNumber: number) => {
    console.log("Nav to Lith", lithNumber);
    // `/cryptolith/01`
  };

  const liths: LithInfoProps[] = [
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
    },
  ];

  return (
    <PageLayout title={"Cryptolith"}>
      <Grid container className={classes.root} spacing={2}>
        {liths &&
          liths.map((lith, index) => {
            return (
              <Grid key={`sthg+${index}`} item xs={4}>
                <Paper
                  className={classes.paper}
                  onClick={() => showLith(index)}
                >
                  <video width="100" autoPlay loop>
                    <source src={lithvid} type="video/webm"></source>
                  </video>
                  <LithInfo
                    lithNumber={index}
                    fundingLevel={lith.fundingLevel}
                    committedAmount={lith.committedAmount}
                    height={lith.height}
                    patrons={lith.patrons}
                    geo={lith.geo}
                  />
                </Paper>
              </Grid>
            );
          })}
      </Grid>
      <BottomInfo />
    </PageLayout>
  );
}
