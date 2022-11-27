import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";

interface PillProps {
  children: ReactNode;
  color?: Colors;
}

const colorsToStyles = {
  red: styles.pillRed,
  orange: styles.pillOrange,
  purple: styles.pillPurple,
  teal: styles.pillTeal,
  yellow: styles.pillYellow,
  pink: styles.pillPink,
  blue: styles.pillBlue,
  green: styles.pillGreen,
};

type Colors = keyof typeof colorsToStyles;

export const Pill: FC<PillProps> = ({
  children,
  color = "green",
}: PillProps) => {
  const colorClass = colorsToStyles[color];

  // if (color === "red") {
  //   colorClass = styles.pillRed;
  // } else if (color == "orange") {
  //   colorClass = styles.pillOrange;
  // } else if (color == "purple") {
  //   colorClass = styles.pillPurple;
  // } else if (color == "teal") {
  //   colorClass = styles.pillTeal;
  // } else if (color == "yellow") {
  //   colorClass = styles.pillYellow;
  // } else if (color == "pink") {
  //   colorClass = styles.pillPink;
  // } else if (color == "blue") {
  //   colorClass = styles.pillBlue;
  // } else {
  //   colorClass = styles.pillGreen;
  // }
  return (
    <div className={`${styles.pillcontainer} ${colorClass} text-nowrap`}>
      {children}
    </div>
  );
};
