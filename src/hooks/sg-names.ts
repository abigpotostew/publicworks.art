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
    const encoded = base64Encode({ name: { address } });
    const { data } = await fetch(
      `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
    ).then((response) => response.json());
    return data && typeof data === "string" ? data : undefined;
  };
  return useReactQuery(key, fetcher);
}

export function useNameInfo(name: string) {
  const key = ["nftNameInfo", name];
  const fetcher = async () => {
    const encoded = base64Encode({ nft_info: { token_id: name } });
    const response = await fetch(
      `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
    ).then((response) => response.json());
    return response.data as NftInfoResponseForMetadata;
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

export function useProfileInfo({
  address,
  name,
}: {
  address?: string;
  name?: string;
}) {
  const { data: nameOfWallet } = useWalletName(address ?? "");
  const { data, isLoading } = useNameInfo(name ?? nameOfWallet ?? "");
  // const { data: nameOwner } = useNameOwner(name ?? nameOfWallet ?? "");

  // const owner = address ?? data?.token_uri ?? "";
  // const collectionAddr = data?.extension.image_nft?.collection ?? "";
  // const tokenId = data?.extension.image_nft?.token_id ?? "";

  // const { data: profileToken } = useQuery(TokenMediaDocument, {
  //   variables: {
  //     collectionAddr,
  //     tokenId,
  //     size: ImageSize.Xs,
  //   },
  //   skip: !owner,
  // });

  return {
    // profileMedia: profileToken?.token?.media,
    walletName: nameOfWallet,
    // nameOwner: nameOwner?.owner,
    textRecords: data?.extension.records,
    isLoading,
  };
}
