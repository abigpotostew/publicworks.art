import useSWR from "swr";
import config from "../wasm/config";

export const useCollectionSize = (minter:string)=>{

  // num minted
  //
  /*
  {
  "data": {"count":34}
}
   */
  const { data, error } = useSWR(
    `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/eyJjb25maWciOnt9fQ==`,
  );
  
  return {collectionSize: ((data?.data?.num_tokens) as (number | null)) || 0, loading:!data, error}
}

