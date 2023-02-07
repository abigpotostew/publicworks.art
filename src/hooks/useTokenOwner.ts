import useSWR from "swr";
import config from "../wasm/config";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export const useTokenOwner = ({
  sg721,
  tokenId,
}: {
  sg721?: string | null;
  tokenId?: string | null;
}) => {
  // num minted
  //
  /*
  {
  "data": {"count":34}
}
   */

  const msgBase64 = useMemo(
    () =>
      Buffer.from(JSON.stringify({ owner_of: { token_id: tokenId } })).toString(
        "base64"
      ),
    [tokenId]
  );

  // const { data, error } = useSWR(
  //   !sg721 || !tokenId
  //     ? null
  //     : `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`,
  //   { refreshInterval: 1000 * 60 * 3 }
  // );

  const { data, error } = useQuery(
    [
      `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`,
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
          "failed to get collection size" +
            res.status +
            ", " +
            (await res.text().toString())
        );
      }
      return res.json();
    },
    { refetchInterval: 1000 * 60 * 3 }
  );

  return {
    owner: (data?.data?.owner as string | null) || "N/A",
    loading: !data,
    error,
  };
};
