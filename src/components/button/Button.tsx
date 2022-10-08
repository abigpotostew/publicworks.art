// @flow
import { FC } from "react";
import { ButtonProps } from "react-bootstrap/Button";

type Props = ButtonProps;
export const Button: FC<Props> = (props: Props) => {
  return <Button variant={"info"} {...props}></Button>;
};
