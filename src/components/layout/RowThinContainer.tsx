import { Col, Container, Row } from "react-bootstrap";
import { ReactNode } from "react";

export const RowThinContainer = ({
  children,
  className,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <Row className={className}>
        <Col />
        <Col
          className={"align-self-center " + innerClassName || ""}
          xs={12}
          sm={12}
          md={10}
          lg={8}
          xl={7}
          xxl={6}
        >
          {children}
        </Col>
        <Col />
      </Row>
    </div>
  );
};
export const RowLogoContainer = ({
  children,
  className,
  colClassName,
}: {
  className?: string;
  children: ReactNode;
  colClassName?: string;
}) => {
  return (
    <Container fluid className={className}>
      <Row>
        <Col />
        <Col
          className={" " + colClassName || ""}
          xs={12}
          sm={12}
          md={12}
          lg={10}
          xl={9}
          xxl={6}
        >
          {children}
        </Col>
        <Col />
      </Row>
    </Container>
  );
};

export const RowThinContainerFlex = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <Row className={className}>
      <Col />
      <Col lg={4} className={"gx-8 align-self-center"}>
        {children}
      </Col>
      <Col />
    </Row>
  );
};
