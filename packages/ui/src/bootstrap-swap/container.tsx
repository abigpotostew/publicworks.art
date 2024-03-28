import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface ContainerI {
  fluid?: boolean;
  className?: string | undefined;
}
export const Container: FC<PropsWithChildren<ContainerI>> = ({
  children,
  fluid,
  className,
}) => {
  return (
    <div
      className={clsx(
        "mx-auto",
        "p-2",
        fluid && "w-full",
        !fluid && [
          "sm:max-w-screen-sm",
          "md:max-w-screen-md",
          "lg:max-w-screen-lg",
          "xl:max-w-screen-xl",
          "2xl:max-w-screen-2xl",
        ],
        className
      )}
    >
      {children}
    </div>
  );
};
