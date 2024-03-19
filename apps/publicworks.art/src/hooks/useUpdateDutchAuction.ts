import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
import { useMutation } from "@tanstack/react-query";
import { toStars } from "src/wasm/address";
import { Coin, useWallet } from "@stargazezone/client";
import useStargazeClient from "@stargazezone/client/react/client/useStargazeClient";
import { useToast } from "src/hooks/useToast";

export const createCoin = (amount: number): Coin => {
  return {
    amount: (amount * 1_000_000).toString(),
    denom: "ustars",
  };
};
export const createCoinFromNative = (amount: string): Coin => {
  return {
    amount: amount,
    denom: "ustars",
  };
};
export const fromCoin = (coin: Coin): number => {
  return parseInt(coin.amount) / 1_000_000;
};
export const createTimestamp = (unixMilliseconds: number): Timestamp => {
  return (unixMilliseconds * 1_000_000).toString();
};
export const fromTimestamp = (timestamp: Timestamp): Date => {
  return new Date(Number(BigInt(timestamp) / BigInt(1_000_000)));
};

export interface UpdateDutchAuctionMsg {
  update_dutch_auction: {
    dutch_auction_config: {
      end_time: Timestamp;
      resting_unit_price: Coin;
      decline_period_seconds: number;
      decline_decay: number;
    };
    unit_price: Coin;
    start_time: Timestamp;
  };
}

export interface SetUpdateDutchAuctionMsg {
  startTimeMs: number;
  unit_price: number;
  endTimeMs: number;
  restingUnitPrice: number;
  declinePeriodSeconds: number;
  declineDecay: number; // out of 1
}

async function setDutchAuction(
  work: WorkSerializable,
  address: string,
  config: SetUpdateDutchAuctionMsg,
  client: SigningCosmWasmClient
) {
  if (!work.id) {
    throw new Error("work id invalid");
  }
  if (!work.minter) {
    throw new Error("work minter invalid");
  }
  const signer = client;
  // const [{ address }] = await client.getAccounts();
  const account = toStars(address);

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

  if (config.declineDecay < 0 || config.declineDecay > 1) {
    throw new Error("declineDecay must be between 0 and 1");
  }

  const msg: UpdateDutchAuctionMsg = {
    update_dutch_auction: {
      dutch_auction_config: {
        end_time: createTimestamp(config.endTimeMs),
        resting_unit_price: createCoin(config.restingUnitPrice),
        decline_period_seconds: config.declinePeriodSeconds,
        decline_decay: Math.round(config.declineDecay * 1_000_000),
      },
      unit_price: createCoin(config.unit_price),
      start_time: createTimestamp(config.startTimeMs),
    },
  };

  console.log(JSON.stringify(msg, null, 2));

  const result = await signer.execute(account, work.minter, msg, "auto");
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
  if (wasmEvent === undefined) {
    throw new Error("wasm didn't return");
  }

  return;
}

export const useSetDutchAuction = () => {
  const sgwallet = useWallet();
  const client = useStargazeClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: async (opts: {
      work: WorkSerializable;
      config: SetUpdateDutchAuctionMsg;
    }): Promise<boolean> => {
      ///
      if (!sgwallet.wallet) return false;

      if (!opts.work) return false;

      if (!client.client) {
        throw new Error("missing sg client");
      }

      const signingClient = await client.client.connectSigningClient();
      if (!signingClient) {
        throw new Error("Couldn't connect client");
      }
      try {
        await setDutchAuction(
          opts.work,
          sgwallet.wallet.address,
          opts.config,
          signingClient
        );
      } catch (e) {
        //
        toast.error(
          "Failed to configure dutch auction on chain: " + (e as any)?.message
        );
        return false;
      }
      // await mutationContracts.mutateAsync({
      //   sg721: res.sg721,
      //   minter: res.minter,
      //   id: work.id,
      // });
      return true;
    },
  });

  return mutation;
};
