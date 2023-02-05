// @flow
import * as React from "react";
import styles from "./Hr.module.scss";

type Props = {
  className?: string;
};
export const Hr = (props: Props) => {
  return <hr className={styles.hrClass + " " + (props.className || "")}></hr>;
};
