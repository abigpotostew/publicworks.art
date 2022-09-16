import useSWR from "swr";
import config from "../wasm/config";
import { useMemo } from "react";

export const useTokenOwner = ({ sg721, tokenId }: { sg721: string; tokenId: string })=>{

  // num minted
  //
  /*
  {
  "data": {"count":34}
}
   */

  const msgBase64 = useMemo(() => Buffer.from(JSON.stringify({ owner_of: { token_id: tokenId } })).toString('base64'), [tokenId])
  
  const { data, error } = useSWR(
    `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/${msgBase64}`,
    {refreshInterval:1000*60*3}
  );
  
  return {owner: ((data?.data?.owner) as (string | null)) ||'N/A', loading:!data, error}
}

