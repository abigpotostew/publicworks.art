// @flow
import * as React from "react";
import { PropsWithChildren } from "react";
import { clsx } from "clsx";

type Props = {
  className?: string;
};
export const Card = (props: PropsWithChildren<Props>) => {
  return (
    <div className={clsx("rounded-md", props.className)}>{props.children}</div>
  );
};

Card.Img = (props: PropsWithChildren<Props>) => {
  return (
    <div className={clsx("rounded-md", props.className)}>{props.children}</div>
  );
};
Card.ImgOverlay = (props: PropsWithChildren<Props>) => {
  return (
    <div className={clsx("rounded-md", props.className)}>{props.children}</div>
  );
};
Card.Footer = (props: PropsWithChildren<Props>) => {
  return (
    <div className={clsx("rounded-md", props.className)}>{props.children}</div>
  );
};
