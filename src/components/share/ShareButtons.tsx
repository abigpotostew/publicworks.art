// @flow
import * as React from "react";
import { TwitterIcon, TwitterShareButton } from "react-share";

type Props = {
  url?: string;
  title: string;
};
export const ShareButtons = (props: Props) => {
  const url = props.url || window.location.href;
  return (
    <div className={"d-flex justify-content-evenly gap-3 align-items-center"}>
      <TwitterShareButton title={props.title} url={url}>
        <TwitterIcon />
      </TwitterShareButton>
    </div>
  );
};
