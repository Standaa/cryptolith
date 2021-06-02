import { Box, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useStyles } from "./BottomInfo.styles";

export function BottomInfo(): ReactElement {
  const classes = useStyles();

  return (
    <Box>
      <Typography>What the fuck is a Lith ?</Typography>
    </Box>
  );
}
