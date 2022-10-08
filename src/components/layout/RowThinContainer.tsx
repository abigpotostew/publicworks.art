import { Col, Container, Row } from "react-bootstrap";
import { ReactNode } from "react";

export const RowThinContainer = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <Row className={className}>
        <Col />
        {/*  1*/}
        {/*</Col>*/}
        {/*xs={0} sm={0} md={2} lg={3} xl={4} xxl={4}*/}
        {/*<Col />*/}
        <Col
          className={"align-self-center"}
          xs={12}
          sm={12}
          md={10}
          lg={8}
          xl={7}
          xxl={6}
        >
          {/*xs={12} sm={12} md={8} lg={6} xl={3} xxl={3}*/}
          {children}
        </Col>
        <Col />
        {/*<Col xs={0} sm={0} md={2} lg={3} xl={4} xxl={4}>*/}
        {/*  2*/}
        {/*</Col>*/}
      </Row>
    </div>
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
