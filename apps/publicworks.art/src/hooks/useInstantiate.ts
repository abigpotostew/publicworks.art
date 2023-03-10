import config from "../wasm/config";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
import { Decimal } from "@stargazezone/types/contracts/minter/instantiate_msg";
import { Coin } from "@stargazezone/types/contracts/minter/shared-types";
import { coins } from "cosmwasm";
import { trpcNextPW } from "../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toStars } from "src/wasm/address";
import { useWallet } from "@stargazezone/client";
import useStargazeClient from "@stargazezone/client/react/client/useStargazeClient";
import { useToast } from "src/hooks/useToast";
import { createCoin, createTimestamp } from "./useUpdateDutchAuction";

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
  dutch_auction_config: DutchAuctionConfig | null;

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

const client:
  | {
      signer: SigningCosmWasmClient;
      offlineSigner: OfflineSigner | OfflineDirectSigner;
    }
  | undefined = undefined;

async function instantiateNew(
  work: WorkSerializable,
  address: string,
  client: SigningCosmWasmClient
) {
  if (!work.id) {
    throw new Error("work id invalid");
  }
  const signer = client;
  // const [{ address }] = await client.getAccounts();
  const account = toStars(address);

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
  if (!work.coverImageCid) {
    throw new Error("missing cover image");
  }
  let dutchAuctionConfig: DutchAuctionConfig | null = null;
  if (
    work.isDutchAuction &&
    work.dutchAuctionEndDate &&
    work.dutchAuctionEndPrice &&
    work.dutchAuctionDeclinePeriodSeconds !== null &&
    work.dutchAuctionDeclinePeriodSeconds !== undefined &&
    work.dutchAuctionDecayRate !== null &&
    work.dutchAuctionDecayRate !== undefined
  ) {
    dutchAuctionConfig = {
      end_time: createTimestamp(new Date(work.dutchAuctionEndDate).getTime()),
      resting_unit_price: createCoin(work.dutchAuctionEndPrice),
      decline_period_seconds: work.dutchAuctionDeclinePeriodSeconds,
      decline_decay: Math.round(work.dutchAuctionDecayRate * 1_000_000),
    };
  }
  const subdomain = config.testnet ? "testnetmetadata" : "metadata";
  const tempMsg: InstantiateMsg = {
    base_token_uri: `https://${subdomain}.publicworks.art/${work.id}`,
    num_tokens: work.maxTokens,
    sg721_code_id: config.sg721CodeId,
    sg721_instantiate_msg: {
      name: work.name,
      symbol: "PW" + work.id,
      minter: account,
      finalizer: config.finalizer,
      code_uri: "ipfs://" + work.codeCid,
      collection_info: {
        creator: account,
        description: work.blurb,
        image: "ipfs://" + work.coverImageCid,
        external_link: work.externalLink,
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
    dutch_auction_config: dutchAuctionConfig,
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
  const utils = trpcNextPW.useContext();
  const sgwallet = useWallet();
  const client = useStargazeClient();
  const toast = useToast();
  const mutationContracts = trpcNextPW.works.editWorkContracts.useMutation({
    onSuccess() {
      utils.works.getWorkById.invalidate();
    },
  });

  const instantiateMutation = useMutation(async (work: WorkSerializable) => {
    ///
    if (!sgwallet.wallet) return false;

    if (!work) return false;

    if (!client.client) {
      throw new Error("missing sg client");
    }
    const signingClient = await client.client.connectSigningClient();
    if (!signingClient) {
      throw new Error("Couldn't connect client");
    }
    let res: { sg721: string; minter: string } | undefined = undefined;
    try {
      res = await instantiateNew(work, sgwallet.wallet.address, signingClient);
    } catch (e) {
      //
      toast.error("Failed to instantiate on chain: " + (e as any)?.message);
      return;
    }
    if (!res) {
      return;
    }
    await mutationContracts.mutateAsync({
      sg721: res.sg721,
      minter: res.minter,
      id: work.id,
    });
    return true;
  });

  return { instantiateMutation };
};
