import { Grid, Link, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";

import { useStyles } from "./Home.styles";
import { PageLayout } from "../components/PageLayout/PageLayout";
import { BottomInfo } from "../components/BottomInfo";
import { LithInfo } from "../components/LithInfo";
import { LithInfoProps } from "../components/LithInfo/LithInfo";

import lith0 from "../assets/Lith0_300px.webm";
import lith1 from "../assets/Lith1_300px.webm";
import lith2 from "../assets/Lith2_300px.webm";
import lith3 from "../assets/Lith3_300px.webm";
import lith4 from "../assets/Lith4_300px.webm";
import lith5 from "../assets/Lith5_300px.webm";
import lith6 from "../assets/Lith6_300px.webm";
import lith7 from "../assets/Lith7_300px.webm";
import lith8 from "../assets/Lith8_300px.webm";

export function Home(): ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const liths: LithInfoProps[] = [
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith0,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith1,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith2,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith3,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith4,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith5,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith6,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith7,
    },
    {
      fundingLevel: 10,
      committedAmount: 20,
      height: 3,
      patrons: 1,
      geo: "Fréhel",
      src: lith8,
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
                  onClick={() => {
                    history.push(`/cryptolith/${index}`);
                  }}
                >
                  <video width="200" autoPlay loop>
                    <source src={lith.src} type="video/webm"></source>
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
