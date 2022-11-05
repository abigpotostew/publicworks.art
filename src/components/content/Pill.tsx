import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";

interface PillProps {
  children: ReactNode;
}

export const Pill: FC<PillProps> = (props: PillProps) => {
  return <span className={styles.pillcontainer}>{props.children}</span>;
};
