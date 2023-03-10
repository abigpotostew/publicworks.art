// @flow
import * as React from "react";
import { useMinterPrice } from "../../hooks/useMinterPrice";

type Props = {
  minter?: string | null;
};
export const MintToken = ({ minter }: Props) => {
  const minterPrice = useMinterPrice({ minter });
  const minter;
  return <div></div>;
};
