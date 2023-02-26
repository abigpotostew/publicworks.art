// @flow
import React, { FC } from "react";
import { ButtonProps } from "react-bootstrap/Button";
import { Button } from "react-bootstrap";

type Props = ButtonProps;
export const ButtonPW: FC<Props> = (props: Props) => {
  return <Button variant={props.variant || "primary"} {...props}></Button>;
};

// export const ButtonPWFRef: FC<Props> = React.forwardRef((props: Props) => {
//   return <Button variant={props.variant || "primary"} {...props}></Button>;
// });
