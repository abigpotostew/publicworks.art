import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";

interface PillProps {
  children: ReactNode;
  color: string;
}

export const Pill: FC<PillProps> = ({
  children,
  color = "green",
}: PillProps) => {
  let colorClass: string;
  if (color === "red") {
    colorClass = styles.pillRed;
  } else if (color == "orange") {
    colorClass = styles.pillOrange;
  } else if (color == "purple") {
    colorClass = styles.pillPurple;
  } else if (color == "teal") {
    colorClass = styles.pillTeal;
  } else {
    colorClass = styles.pillGreen;
  }
  return (
    <div className={`${styles.pillcontainer} ${colorClass} text-nowrap`}>
      {children}
    </div>
  );
};
