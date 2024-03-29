import React, { FC } from "react";
import clsx from "clsx";

interface RowWideContainerParams {
  children?: React.ReactNode;
  className?: string;
}

export const RowWideContainer: FC<RowWideContainerParams> = ({
  className,
  children,
}) => {
  return (
    <>
      <div
        className={clsx("mx-auto max-w-8xl px-4 sm:px-6 lg:px-8", className)}
      >
        <div className={clsx("mx-auto max-w-8xl")}>{children}</div>
      </div>
    </>
    // <Row className={className}>
    //   <Col />
    //   <Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={12}>
    //     {children}
    //   </Col>
    //   <Col />
    // </Row>
  );
};
