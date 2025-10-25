// @flow
import { useNameInfo, useProfileInfo } from "../../hooks/sg-names";
import { isStarAddress, shortenAddress } from "../../wasm/address";
import SpinnerLoading from "../loading/Loader";
import styles from "./StarsAddressName.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, Placeholder } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  address: string;
  noShorten?: boolean;
  className?: string;
};
export const StarsAddressName = ({ address, noShorten, className }: Props) => {
  const nameInfo = useProfileInfo({ address: address });
  let name: string;
  const starsname = nameInfo.walletName ? nameInfo.walletName + ".stars" : null;
  if (starsname) {
    name = starsname;
  } else if (isStarAddress(address)) {
    name = !noShorten ? shortenAddress(address) : address;
  } else {
    name = address;
  }
  return (
    <span>
      <>
        <CopyToClipboard text={starsname || address}>
          <div className={"font-monospace d-flex gap-1 " + (className || "")}>
            <Button variant={"sm"}>
              {nameInfo.isLoading && (
                <Placeholder animation="glow">
                  <Placeholder className={"d-inline-block Width-5"} />
                </Placeholder>
              )}
              {!nameInfo.isLoading && <>{name}</>}{" "}
              <FontAwesomeIcon
                className={styles.hoverIcon}
                width={14}
                icon={"copy"}
              />
            </Button>
          </div>
        </CopyToClipboard>{" "}
        {/*<>{nameInfo.isLoading ? <SpinnerLoading /> : null}</>*/}
      </>
    </span>
  );
};
