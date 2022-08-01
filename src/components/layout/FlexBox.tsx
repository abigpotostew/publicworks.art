import { Col, Container, Row } from "react-bootstrap";
import { CSSProperties, ReactElement, ReactNode } from "react";
import styles from '../../../styles/Home.module.css'

export const FlexBox = ({ children,className, style }: { className?:string;children: ReactNode;style?: CSSProperties | undefined; }) => {
  return (
    <Container fluid className={className}>

      <div style={style} className={`${styles.flexWrapCenter}`}>
        {children}
      </div>
    </Container>
  )
}