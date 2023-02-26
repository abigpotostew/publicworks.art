// @flow
import * as React from "react";
import { ReactNode } from "react";
import styles from "./FieldControl.module.scss";
type Props = {
  name: string;
  children: ReactNode;
};
export const FieldControl = ({ children, name }: Props) => {
  return (
    <div className={`control-group`}>
      <label className={`control-label ${styles.label} mb-1`}>{name}</label>
      <ul>
        <div className="controls readonly">
          <>{children}</>
        </div>
      </ul>
    </div>
  );
};
