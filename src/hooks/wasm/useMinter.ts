import { useQuery } from "@tanstack/react-query";
import getMinter from "../../../@stargazezone/client/core/minters/getMinter";
import useStargazeClient from "../../../@stargazezone/client/react/client/useStargazeClient";
import { Nullish } from "../../shared-utils/types";

export const useMinter = (minter: Nullish<string>) => {
  const client = useStargazeClient();
  // console.log("minterResponse pizza useMinter", minter);
  return useQuery({
    queryKey: ["get-minter-", minter, client],
    queryFn: async () => {
      // console.log("minterResponse pizza prefetching");
      if (!client.client?.cosmwasmClient || !minter) {
        // console.log(
        //   "minterResponse pizza returning because client or minter are null",
        //   client.client?.cosmwasmClient,
        //   minter
        // );
        return null;
      }

      const minterResponse = await getMinter(
        minter,
        client.client?.cosmwasmClient,
        { includeWhitelist: false, includePercentMinted: false }
      );
      // console.log("minterResponse pizza after", minterResponse);
      return minterResponse;
    },
    enabled: !!minter,
  });
};
