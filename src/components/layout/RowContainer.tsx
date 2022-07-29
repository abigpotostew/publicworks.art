import { Col, Row } from "react-bootstrap";
import { ReactElement } from "react";

export const RowContainer = ({ children }: { children: ReactElement }) => {
  return (
    <Row>

      <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
      <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
        {children}
      </Col>
      <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
    </Row>
  )
}