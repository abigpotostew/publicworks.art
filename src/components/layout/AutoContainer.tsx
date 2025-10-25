import React, { CSSProperties, FC, ReactNode } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface Props {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  bswidth?: number;
  containerClassName?: string | undefined;
  colClassName?: string | undefined;
}

export const AutoContainer: FC<Props> = (props: Props) => {
  const bwid = props.bswidth || 2;
  const classes = [props.containerClassName || "", props.className || ""].join(
    " "
  );
  return (
    <Container style={props.style} fluid className={classes}>
      <Row>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
        <Col className={props.colClassName}>{props.children}</Col>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
      </Row>
    </Container>
  );
};
