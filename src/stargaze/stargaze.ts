import chainInfo from "./chainInfo";
import { StargazeClient } from "@stargazezone/client";

import config from "src/wasm/config";
const minterCodeId = config.minterCodeId;
const sg721CodeId = config.sg721CodeId;
const marketContract = "wasm1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9x9cy0g";
const nameCollectionContract =
  process.env.NEXT_PUBLIC_NAME_COLLECTION_CONTRACT ?? "";
const stargazeClient = new StargazeClient({
  chainInfo,
  minterCodeId,
  sg721CodeId,
  marketContract,
  nameCollectionContract,
});

export default stargazeClient;
