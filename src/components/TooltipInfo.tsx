import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BsInfoCircle } from "react-icons/bs";
import { FC, ReactNode, useRef } from "react";

interface TooltipInfoProps {
  children: ReactNode;
}

export const TooltipInfo: FC<TooltipInfoProps> = (
  propsParent: TooltipInfoProps
) => {
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {propsParent.children}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 400 }}
      overlay={renderTooltip}
    >
      <span>
        <BsInfoCircle />
      </span>
    </OverlayTrigger>
  );
};
