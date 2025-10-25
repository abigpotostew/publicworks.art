// @flow
import React, { FC, ForwardedRef, ElementType } from "react";
import { ButtonProps } from "react-bootstrap/Button";
import { Button } from "react-bootstrap";

type Props = ButtonProps & { as?: ElementType };
export const ButtonPW: FC<Props> = (props: Props) => {
  return <Button variant={props.variant || "primary"} {...props}></Button>;
};

export const ButtonPWFRef: FC<Props> = React.forwardRef(
  (props: Props, ref: ForwardedRef<any>) => {
    return (
      <Button
        ref={ref}
        variant={props.variant || "primary"}
        {...props}
      ></Button>
    );
  }
);
