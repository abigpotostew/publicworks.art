import { Container } from "react-bootstrap";
import { CSSProperties, ReactNode } from "react";
import styles from "../../../styles/Home.module.scss";

export const FlexBoxCenter = ({
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

export const FlexBox = ({
  children,
  className,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?: CSSProperties | undefined;
}) => {
  return (
    <div className={className} style={{ ...style, display: "flex" }}>
      {children}
    </div>
  );
};
