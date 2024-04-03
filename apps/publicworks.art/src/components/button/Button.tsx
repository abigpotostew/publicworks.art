// @flow
import React, { FC, ForwardedRef } from "react";
import { Button, ButtonProps } from "@publicworks/ui";

type Props = ButtonProps;
export const ButtonPW: FC<Props> = (props: Props) => {
  return <Button {...props}></Button>;
};

export const ButtonPWFRef: FC<Props> = React.forwardRef(
  (props: Props, ref: ForwardedRef<any>) => {
    return <Button ref={ref} {...props}></Button>;
  }
);
