import useSWR from "swr";
import config from "../wasm/config";
import { useEffect, useMemo, useState } from "react";
import { fetchTokenUriInfo, normalizeMetadataUri } from "../wasm/metadata";

export interface NftMetadata {
  tokenId: string | undefined;
  animation_url: string | undefined;
  description: string;
  image: string;
  attributes: any[] | undefined;
  traits: any[] | undefined;
  name: string | undefined;
  creator: string | undefined;
  resolution: string | undefined;
}

export const useNftMetadata = ({
  sg721,
  tokenId,
}: {
  sg721: string | undefined | null;
  tokenId: string;
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

  const { data, error } = useSWR(
    sg721
      ? `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`
      : null
  );

  useEffect(() => {
    if (error) {
      setErrorFetch(errorFetch);
      return;
    }

    if (!data || error) return;
    const url = data.data.token_uri;

    (async () => {
      try {
        const res = await fetchTokenUriInfo(normalizeMetadataUri(url));
        setMetadata(res);
      } catch (e) {
        console.log("metadata error", e);
        setErrorFetch(e);
      }
      setLoading(false);
    })();
  }, [data, error]);

  return { metadata, loading, error: errorFetch };
};
