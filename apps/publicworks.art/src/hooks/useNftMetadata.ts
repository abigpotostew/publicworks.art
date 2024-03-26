import config from "../wasm/config";
import { useEffect, useMemo, useState } from "react";
import { fetchTokenUriInfo, normalizeMetadataUri } from "../wasm/metadata";
import { useQuery } from "@tanstack/react-query";

export interface Attribute {
  value: string | number | boolean | null;
  trait_type: string;
}

export interface NftMetadata {
  tokenId: string | undefined;
  animation_url: string | undefined;
  description: string;
  image: string;
  imageCdn: string;
  attributes: Attribute[] | undefined;
  traits: Attribute[] | undefined;
  name: string | undefined;
  creator: string | undefined;
  resolution: string | undefined;
}

export const useNftMetadata = ({
  sg721,
  tokenId,
  refresh,
}: {
  sg721: string | undefined | null;
  tokenId: string | undefined | null;
  refresh?: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorFetch, setErrorFetch] = useState<any | null>(null);
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);

  const msgBase64 = useMemo(
    () =>
      Buffer.from(JSON.stringify({ nft_info: { token_id: tokenId } })).toString(
        "base64"
      ),
    [tokenId]
  );

  const query = useQuery(
    [
      sg721
        ? `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`
        : null,
    ],
    async () => {
      if (!sg721 || !tokenId) {
        return null;
      }
      const res = await fetch(
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`
      );
      if (!res.ok) {
        throw new Error(
          "failed to get nft metadata" +
            res.status +
            ", " +
            (await res.text().toString())
        );
      }
      const data = await res.json();
      try {
        const url = data.data.token_uri;
        if (typeof url !== "string") {
          return null;
        }
        const res = await fetchTokenUriInfo(normalizeMetadataUri(url));
        return res;
      } catch (e) {
        console.log("metadata error", e);
        setErrorFetch(e);
      }
    },
    {
      enabled: !!sg721,
      refetchOnMount: !!refresh,
      refetchOnWindowFocus: !!refresh,
      refetchOnReconnect: !!refresh,
    }
  );

  // useEffect(() => {
  //   if (error) {
  //     setErrorFetch(errorFetch);
  //     return;
  //   }
  //
  //   if (!data || error) return;
  //   const url = data.data.token_uri;
  //   console.log("metadata url", url);
  //   (async () => {
  //     try {
  //       const res = await fetchTokenUriInfo(normalizeMetadataUri(url));
  //       setMetadata(res);
  //     } catch (e) {
  //       console.log("metadata error", e);
  //       setErrorFetch(e);
  //     }
  //     setLoading(false);
  //   })();
  // }, [data, error, errorFetch]);

  return query;
};
