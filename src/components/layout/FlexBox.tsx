import { Container } from "react-bootstrap";
import { CSSProperties, ReactNode } from "react";
import styles from "../../../styles/Home.module.css";

export const FlexBox = ({
  children,
  className,
  style,
  fluid = true,
}: {
  className?: string;
  children: ReactNode;
  style?: CSSProperties | undefined;
  fluid?: boolean;
}) => {
  return (
    <Container fluid={!!fluid} className={className}>
      <div style={style} className={`${styles.flexWrapCenter}`}>
        {children}
      </div>
    </Container>
  );
};
