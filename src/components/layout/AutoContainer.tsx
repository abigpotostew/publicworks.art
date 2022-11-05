import React, { FC, ReactNode } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";

interface Props {
  children: ReactNode;
  bswidth?: number;
  containerClassName?: string | undefined;
  colClassName?: string | undefined;
}

export const AutoContainer: FC<Props> = (props: Props) => {
  const bwid = props.bswidth || 2;
  return (
    <Container fluid className={props.containerClassName}>
      <Row>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
        <Col className={props.colClassName}>{props.children}</Col>
        <Col xs={bwid} sm={bwid} md={bwid} lg={bwid} xl={bwid} xxl={bwid} />
      </Row>
    </Container>
  );
};
