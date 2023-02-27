import { FC, ReactNode } from "react";
import styles from "./Pill.module.scss";
import { Colors, PillGeneric } from "./PillGeneric";

interface PillProps {
  children: ReactNode;
  color?: Colors;
  className?: string;
}

export const PillSmall: FC<PillProps> = ({
  children,
  color = "green",
  className = "",
}: PillProps) => {
  return (
    <PillGeneric
      className={`${className} ${styles.textsmall} ${styles.pillcontainer_small}`}
      color={color}
    >
      {children}
    </PillGeneric>
  );
};
