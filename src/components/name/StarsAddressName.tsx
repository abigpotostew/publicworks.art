// @flow
import * as React from "react";
import { useNameInfo, useProfileInfo } from "../../hooks/sg-names";
import { isStarAddress, shortenAddress } from "../../wasm/address";
import SpinnerLoading from "../loading/Loader";

type Props = {
  address: string;
  noShorten?: boolean;
};
export const StarsAddressName = ({ address, noShorten }: Props) => {
  const nameInfo = useProfileInfo({ address: address });
  let name: string;
  if (nameInfo.walletName) {
    name = nameInfo.walletName + ".stars";
  } else if (isStarAddress(address)) {
    name = !noShorten ? shortenAddress(address) : address;
  } else {
    name = address;
  }
  return (
    <span>
      <>
        {name} <>{nameInfo.isLoading ? <SpinnerLoading /> : null}</>
      </>
    </span>
  );
};
