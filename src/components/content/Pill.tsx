import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";
import { Colors, PillGeneric } from "./PillGeneric";

interface PillProps {
  children: ReactNode;
  color?: Colors;
}

export const Pill: FC<PillProps> = ({
  children,
  color = "green",
}: PillProps) => {
  return (
    <PillGeneric
      className={`${styles.textlarge} ${styles.pillcontainer}`}
      color={color}
    >
      {children}
    </PillGeneric>
  );
};
