// @flow
import { FC } from "react";
import { ButtonProps } from "react-bootstrap/Button";
import { Button } from "react-bootstrap";

type Props = ButtonProps;
export const ButtonPW: FC<Props> = (props: Props) => {
  return <Button variant={"primary"} {...props}></Button>;
};
