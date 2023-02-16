// @flow
import * as React from "react";
import { ReactNode } from "react";

type Props = {
  name: string;
  children: ReactNode;
};
export const FieldControl = ({ children, name }: Props) => {
  return (
    <div className="control-group">
      <label className="control-label">{name}</label>
      <div className="controls readonly">{children}</div>
    </div>
  );
};
