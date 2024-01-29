import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
import { trpcNextPW } from "../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toStars } from "src/wasm/address";
import { Coin, useWallet } from "@stargazezone/client";
import useStargazeClient from "@stargazezone/client/react/client/useStargazeClient";
import { useToast } from "src/hooks/useToast";
import { createCoin } from "./useUpdateDutchAuction";

export interface ExecuteUpdatePriceMsg {
  update_price: {
    unit_price: Coin;
  };
}

export interface SetUpdatePriceMsg {
  unit_price: number;
}

async function setUpdatePrice(
  work: WorkSerializable,
  address: string,
  config: SetUpdatePriceMsg,
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

  const msg: ExecuteUpdatePriceMsg = {
    update_price: {
      unit_price: createCoin(config.unit_price),
    },
  };

  console.log("set price request", JSON.stringify(msg, null, 2));

  const result = await signer.execute(account, work.minter, msg, "auto");
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
  if (wasmEvent === undefined) {
    throw new Error("wasm didn't return");
  }

  return result;
}

export const useSetPrice = () => {
  const sgwallet = useWallet();
  const client = useStargazeClient();
  const toast = useToast();

  const mutation = useMutation(
    async (opts: {
      work: WorkSerializable;
      config: SetUpdatePriceMsg;
    }): Promise<ExecuteResult> => {
      ///
      if (!sgwallet.wallet) throw new Error("missing wallet");

      if (!opts.work) throw new Error("missing work");

      if (!client.client) {
        throw new Error("missing sg client");
      }
      const signingClient = await client.client.connectSigningClient();
      if (!signingClient) {
        throw new Error("Couldn't connect client");
      }
      try {
        return await setUpdatePrice(
          opts.work,
          sgwallet.wallet.address,
          opts.config,
          signingClient
        );
      } catch (e) {
        //
        toast.error(
          "Failed to configure price on chain: " + (e as any)?.message
        );
        throw e;
      }
    }
  );

  return mutation;
};
