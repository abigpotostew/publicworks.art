import { Col, Row } from "react-bootstrap";
import React, { FC } from "react";

interface RowWideContainerParams {
  children?: React.ReactNode;
  className?: string;
}

export const RowWideContainer: FC<RowWideContainerParams> = ({
  className,
  children,
}) => {
  return (
    <Row className={className}>
      <Col />
      <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={12}>
        {children}
      </Col>
      <Col />
    </Row>
  );
};
