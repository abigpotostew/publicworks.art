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

export const FlexBoxCenterStretch = ({
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
      <div style={style} className={`${styles.flexWrapCenterStretch}`}>
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
    <div className={(className || "") + " d-inline-flex"} style={{ ...style }}>
      {children}
    </div>
  );
};
