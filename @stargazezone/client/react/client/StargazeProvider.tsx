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
  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const connectSigning = useCallback(async () => {
    if (client) {
      await client?.connectSigning();
      forceUpdate();
    }
  }, [client, forceUpdate]);

  // Connect client
  useEffect(() => {
    // Unsigned Client
    async function connectClient() {
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
