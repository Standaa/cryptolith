import { Box, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useStyles } from "./LithInfo.styles";

export interface LithInfoProps {
  lithNumber?: number;
  fundingLevel: number;
  committedAmount: number;
  height: number;
  patrons: number;
  geo: string;
  src?: any;
}

export function LithInfo(props: LithInfoProps): ReactElement {
  const classes = useStyles();

  const { lithNumber, fundingLevel, committedAmount, height, patrons, geo } =
    props || null;

  return (
    <Box className={classes.lithInfoContainer}>
      <Box>
        <Typography className={classes.lithInfoTitle}>
          Lith {lithNumber}
        </Typography>
      </Box>

      <Box className={classes.lithInfoRow}>
        <Typography>Funding Level</Typography>
        <Typography>{fundingLevel} %</Typography>
      </Box>

      <Box className={classes.lithInfoRow}>
        <Typography>Amount Committed</Typography>
        <Typography>{committedAmount} SOL</Typography>
      </Box>

      <Box className={classes.lithInfoRow}>
        <Typography>Height</Typography>
        <Typography>{height}m</Typography>
      </Box>

      <Box className={classes.lithInfoRow}>
        <Typography>Patrons</Typography>
        <Typography>{patrons}</Typography>
      </Box>

      <Box className={classes.lithInfoRow}>
        <Typography>Geo</Typography>
        <Typography>{geo}</Typography>
      </Box>
    </Box>
  );
}
