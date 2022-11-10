import { Col, Container, Row } from "react-bootstrap";
import { ReactNode } from "react";

export const RowMediumContainer = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <Row className={className}>
      <Col />
      <Col
        className={"align-self-center"}
        xs={12}
        sm={12}
        md={10}
        lg={10}
        xl={9}
        xxl={8}
      >
        {children}
      </Col>
      <Col />
    </Row>
  );
};
