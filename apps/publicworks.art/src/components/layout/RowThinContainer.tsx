import { ReactNode } from "react";
import { Col, Row } from "react-bootstrap";
import clsx from "clsx";

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
    <>
      <div
        className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      >
        <div className={clsx("mx-auto max-w-2xl", innerClassName)}>
          {children}
        </div>
      </div>
    </>
  );
};
export const RowLogoContainer = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
  colClassName?: string;
}) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className={clsx("mx-auto max-w-3xl", className)}>{children}</div>
      </div>
    </>
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
