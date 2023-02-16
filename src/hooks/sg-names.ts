import { useQuery, useQuery as useReactQuery } from "@tanstack/react-query";
import config from "../wasm/config";
import chainInfo from "../stargaze/chainInfo";
import { NftInfoResponseForMetadata } from "../../@stargazezone/contracts/names/Sg721Name.types";

const base64Encode = (obj: any) => {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
};
export function useWalletName(address: string) {
  const key = ["walletName", address];
  const fetcher = async () => {
    if (!address) {
      console.log("no address");
      return "";
    }
    try {
      const encoded = base64Encode({ name: { address } });
      console.log(
        "fetching wallet name",
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      );
      const response = await fetch(
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      );
      if (!response.ok) {
        return "";
      }
      const { data } = await response.json();
      return data && typeof data === "string" ? data : "";
    } catch (e) {
      console.error("failed to fetch wallet name", e);
      return "";
    }
  };
  return useReactQuery(key, fetcher, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useNameInfo(name: string) {
  const key = ["nftNameInfo", name];
  const fetcher = async () => {
    console.log("fetching name info", name);
    if (!name) {
      return null;
    }
    const encoded = base64Encode({ nft_info: { token_id: name } });
    try {
      const response = await fetch(
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      );
      if (!response.ok) {
        return "";
      }
      return (await response.json())?.data as NftInfoResponseForMetadata | "";
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  return useReactQuery(key, fetcher);
}

// export function useNameOwner(name: string) {
//   const key = ["nameOwner", name];
//   const fetcher = async () => {
//     const encoded = base64Encode({ owner_of: { token_id: name } });
//     const response = await fetch(
//       `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
//     ).then((response) => response.json());
//     return response.data as OwnerOfResponse;
//   };
//
//   return useReactQuery(key, fetcher);
// }

export function useProfileInfo({ address }: { address?: string }) {
  const { data: nameOfWallet, isLoading } = useWalletName(address ?? "");
  const nameInfo = useNameInfo(nameOfWallet ?? "");

  const textRecords =
    typeof nameInfo.data === "object"
      ? nameInfo.data?.extension?.records
      : undefined;

  return {
    // profileMedia: profileToken?.token?.media,
    walletName: nameOfWallet,
    // nameOwner: nameOwner?.owner,
    textRecords,
    isLoading,
  };
}
