// @flow
import * as React from "react";

type Props = {
  className?: string;
};
export const GrowingDot = ({ className }: Props) => {
  return (
    <div
      //todo make this green always.
      // move the yellow one down to the rpice change counter
      className={"spinner-grow " + (className || "")}
      role="status"
      style={{ width: "1.25rem", height: "1.25rem" }}
    >
      <span className="sr-only"></span>
    </div>
  );
};
