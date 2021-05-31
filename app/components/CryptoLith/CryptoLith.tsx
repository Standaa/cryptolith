import React, { ReactElement } from "react";
import { PageLayout } from "../PageLayout/PageLayout";

import { useStyles } from "./CryptoLith.styles";

export function CryptoLith(): ReactElement {
  const classes = useStyles();

  return (
    <PageLayout title={"Cryptolith"}>
      <h1>LITH PAGE TEST</h1>
    </PageLayout>
  );
}
