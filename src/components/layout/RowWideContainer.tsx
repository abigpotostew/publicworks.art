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
      <Col xs={0} sm={0} md={0} lg={1} xl={1} xxl={1} />
      <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>
        {children}
      </Col>
      <Col xs={0} sm={0} md={0} lg={1} xl={1} xxl={1} />
    </Row>
  );
};
