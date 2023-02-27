import { FC } from "react";
import styles from "./StepProgressBar.module.css";

export interface Step {
  label: string;
  description: string;
  active?: boolean;
  completed?: boolean;
  onClick?: (() => void) | (() => Promise<void>);
}
export interface StepProgressBarProps {
  items: Step[];
}
export const StepProgressBar: FC<StepProgressBarProps> = (
  props: StepProgressBarProps
) => {
  return (
    <div className={styles.stepperWrapper}>
      {props.items.map((i: Step, idx: number) => {
        let classes = styles.stepperItem;
        if (i.completed) {
          classes += " " + styles.completed;
        }
        if (i.onClick) {
          classes += " " + styles.clickable;
        }
        return (
          <div key={idx} className={classes} onClick={i.onClick}>
            <div className={styles.stepCounter}>{i.label}</div>
            <div className={styles.stepperName}>{i.description}</div>
          </div>
        );
      })}
    </div>
  );
};
