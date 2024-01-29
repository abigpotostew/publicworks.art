import { ReactNode, useCallback, useEffect, useState } from "react";
import { StargazeClient } from "../../core";
import StargazeClientContext from "./StargazeContext";
import WalletProvider from "../wallet/WalletProvider";

export default function StargazeProvider({
  client,
  children,
}: {
  client: StargazeClient;
  children: ReactNode;
}) {
  // console.log("StargazeProvider, client,pizza", client);
  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const connectSigning = useCallback(async () => {
    // console.log("StargazeProvider, connectSigning, pizza", client);
    if (client) {
      await client?.connectSigning();
      forceUpdate();
    }
  }, [client, forceUpdate]);

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
      // console.log("StargazeProvider, connectClient, pizza", client);
      await client?.connect();
      forceUpdate();
    }

    connectClient();
  }, [client, forceUpdate]);

  return (
    <StargazeClientContext.Provider
      value={{
        client,
        connectSigning,
      }}
    >
      <WalletProvider>{children}</WalletProvider>
    </StargazeClientContext.Provider>
  );
}
