import { Col, Row } from "react-bootstrap";
import { ReactElement, ReactNode } from "react";

export const RowThinContainer = ({ children,className }: { className?:string;children: ReactNode }) => {
  return (
    <Row className={
      className
    }>

      <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
      <Col xs={12} sm={12} md={10} lg={8} xl={6} xxl={6}>
        {children}
      </Col>
      <Col xs={0} sm={0} md={1} lg={2} xl={3} xxl={3}/>
    </Row>
  )
}