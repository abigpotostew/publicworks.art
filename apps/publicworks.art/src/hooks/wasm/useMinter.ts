import { useQuery } from "@tanstack/react-query";
import getMinter from "../../../@stargazezone/client/core/minters/getMinter";
import useStargazeClient from "../../../@stargazezone/client/react/client/useStargazeClient";
import { Nullish } from "@publicworks/shared-utils/types";

export const useMinter = (minter: Nullish<string>) => {
  const client = useStargazeClient();
  return useQuery(
    ["get-minter-" + minter],
    async () => {
      if (!client.client?.cosmwasmClient || !minter) {
        return null;
      }
      const minterResponse = await getMinter(minter, client.client?.cosmwasmClient, {});
      return minterResponse;
    },
    { enabled: !!minter }
  );
};
