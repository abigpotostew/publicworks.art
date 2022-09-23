import { keplrClient } from "../wasm/keplr/keplr-client";
import config from "../wasm/config";
import { toStars } from "../util/stargaze/utils";
import { WorkSerializable } from "../dbtypes/works/workSerializable";
import { useCallback, useEffect } from "react";
import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
import { Decimal } from "@stargazezone/types/contracts/minter/instantiate_msg";
import { Coin } from "@stargazezone/types/contracts/minter/shared-types";
import { coins } from "cosmwasm";
import useAsync from "./useAsync";

function formatRoyaltyInfo(
  royaltyPaymentAddress: null | string,
  royaltyShare: string
) {
  if (royaltyPaymentAddress === null) {
    return null;
  } else {
    if (royaltyShare === undefined || royaltyShare == "") {
      throw new Error("royaltyPaymentAddress present, but no royaltyShare");
    }
    return { payment_address: royaltyPaymentAddress, share: royaltyShare };
  }
}
function isValidIpfsUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === "ipfs:";
}
const NEW_COLLECTION_FEE = coins("1000000000", "ustars");
export interface InstantiateMsg {
  base_token_uri: string;
  num_tokens: number;
  per_address_limit: number;
  sg721_code_id: number;
  sg721_instantiate_msg: InstantiateMsg1;
  start_time: Timestamp;
  unit_price: Coin;
  whitelist?: string | null;
  [k: string]: unknown;
}
export interface InstantiateMsg1 {
  collection_info: CollectionInfoFor_RoyaltyInfoResponse;
  minter: string;
  name: string;
  symbol: string;
  code_uri: string;
  finalizer: string;
  [k: string]: unknown;
}
export interface CollectionInfoFor_RoyaltyInfoResponse {
  creator: string;
  description: string;
  external_link?: string | null;
  image: string;
  royalty_info?: RoyaltyInfoResponse | null;
  [k: string]: unknown;
}
export interface RoyaltyInfoResponse {
  payment_address: string;
  share: Decimal;
  [k: string]: unknown;
}
function clean(obj: any) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}
let client:
  | {
      signer: SigningCosmWasmClient;
      offlineSigner: OfflineSigner | OfflineDirectSigner;
    }
  | undefined = undefined;
async function instantiate(work: WorkSerializable) {
  if (!work.id) {
    throw new Error("work id invalid");
  }
  if (!client) {
    client = await keplrClient(config);
  }
  const { offlineSigner, signer } = client;
  const [{ address }] = await offlineSigner.getAccounts();
  const account = toStars(address);
  // const whitelistContract = config.whitelistContract
  //   ? toStars(config.whitelistContract)
  //   : null;
  const royaltyPaymentAddress = work.royaltyAddress
    ? toStars(work.royaltyAddress)
    : null;
  if (
    work.royaltyPercent === null ||
    work.royaltyPercent === undefined ||
    !Number.isFinite(work.royaltyPercent)
  ) {
    throw new Error("royalty percent invalid");
  }
  const royaltyInfo = formatRoyaltyInfo(
    royaltyPaymentAddress,
    (work.royaltyPercent / 100).toString()
  );

  //if (!isValidIpfsUrl(config.baseTokenUri)) {
  //  throw new Error('Invalid base token URI');
  //}

  //todo work image
  // if (!isValidIpfsUrl(work.) && !isValidHttpUrl(work.image)) {
  //   throw new Error("Image link is not valid. Must be IPFS or http(s)");
  // }

  if (work.maxTokens > 10_000) {
    throw new Error("Too many tokens");
  }

  // if (!work.perAddressLimit || work.perAddressLimit === 0) {
  //   throw new Error("perAddressLimit must be defined and greater than 0");
  // }

  // const client = await getClient();

  // time expressed in nanoseconds (1 millionth of a millisecond)
  if (!work.startDate) {
    throw new Error("incorrect start date");
  }
  const startTime: Timestamp = (
    new Date(work.startDate).getTime() * 1_000_000
  ).toString();
  // const startTime: Timestamp = (
  //   (Date.now() + 10 * 1000) *
  //   1_000_000
  // ).toString();

  if (!work.priceStars) {
    throw new Error("price invalid");
  }
  const tempMsg: InstantiateMsg = {
    base_token_uri: `https://testnetmetadata.publicworks.art/${work.id}`,
    num_tokens: work.maxTokens,
    sg721_code_id: config.sg721CodeId,
    sg721_instantiate_msg: {
      name: work.name,
      symbol: "TODO",
      minter: account,
      finalizer: config.finalizer,
      code_uri: "ipfs://" + work.codeCid,
      collection_info: {
        creator: account,
        description: work.description,
        image: "ipfs://QmU9rB3dEHjYF3YtXHTJLxCDW1R1MLh1NWpooxbYg5gV34", //TODO
        external_link: "https://example.com", //todo
        royalty_info: royaltyInfo,
      },
    },
    per_address_limit: 50, //todo
    whitelist: undefined,
    start_time: startTime,
    unit_price: {
      amount: (work.priceStars * 1000000).toString(),
      denom: "ustars",
    },
  };

  if (
    tempMsg.sg721_instantiate_msg.collection_info?.royalty_info
      ?.payment_address === undefined &&
    tempMsg.sg721_instantiate_msg.collection_info?.royalty_info?.share ===
      undefined
  ) {
    tempMsg.sg721_instantiate_msg.collection_info.royalty_info = null;
  }
  const msg = clean(tempMsg);

  // Get confirmation before preceding
  console.log(
    "Please confirm the settings for your minter and collection. THERE IS NO WAY TO UPDATE THIS ONCE IT IS ON CHAIN."
  );
  console.log(JSON.stringify(msg, null, 2));
  console.log(
    "Cost of minter instantiation: " +
      NEW_COLLECTION_FEE[0].amount +
      " " +
      NEW_COLLECTION_FEE[0].denom
  );
  console.log("funds", NEW_COLLECTION_FEE);

  const result = await signer.instantiate(
    account,
    config.minterCodeId,
    msg,
    work.name,
    "auto",
    { funds: NEW_COLLECTION_FEE, admin: account }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
  if (wasmEvent === undefined) {
    throw new Error("wasm didn't return");
  }
  console.info("Add these contract addresses to config.js:");
  console.info("minter contract address: ", wasmEvent.attributes[0]["value"]);
  console.info("sg721 contract address: ", wasmEvent.attributes[5]["value"]);
  return {
    sg721: wasmEvent.attributes[5]["value"],
    minter: wasmEvent.attributes[0]["value"],
  };
}

export const useInstantiate = () => {
  const instantiateCb = useCallback(async (work: WorkSerializable) => {
    return await instantiate(work);
  }, []);
  return { instantiate: instantiateCb };
};
