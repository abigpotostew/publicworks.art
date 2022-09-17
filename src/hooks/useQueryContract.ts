import { QueryContract } from "../wasm/keplr/query";
import { useEffect, useState } from "react";
import config from "../wasm/config";

export const useQueryContract = () => {
  const [queryClient, setQueryClient] = useState<QueryContract | undefined>(
    undefined
  );
  useEffect(() => {
    (async () => {
      const queryClient = await QueryContract.init(config);
      setQueryClient(queryClient);
    })();
  }, []);
  return { queryClient };
};
