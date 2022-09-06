import useSWR from "swr";
import config from "../wasm/config";



export const useNumMinted = (sg721:string)=>{
  
  const { data, error } = useSWR(
    `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/eyJudW1fdG9rZW5zIjp7fX0=`,
    { refreshInterval: 10000, fallback: {"data": {"count":0}} },
  );
  
  return {numMinted: ((data?.data?.count) as (number | null)) || 0, loading:!data, error}
}

