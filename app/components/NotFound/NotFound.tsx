import React, { ReactElement, ReactNode } from "react";

interface Props {
  title: string;
  body: string | ReactNode;
}

export function NotFound({ title, body }: Props): ReactElement {
  return (
    <>
      <h1>{title}</h1>
      <h1>{body}</h1>
    </>
  );
}
