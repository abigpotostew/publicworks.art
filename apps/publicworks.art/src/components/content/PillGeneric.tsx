import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";

interface PillProps {
  children: ReactNode;
  color?: Colors;
  className?: string;
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

export type Colors = keyof typeof colorsToStyles;

export const PillGeneric: FC<PillProps> = ({
  children,
  className,
  color = "green",
}: PillProps) => {
  const colorClass = colorsToStyles[color];

  return (
    <div className={`${className} ${colorClass} text-nowrap`}>{children}</div>
  );
};
