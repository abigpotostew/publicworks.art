import { UseToastTypes } from "src/hooks/useToast.types";
import { StargazeClient } from "@stargazezone/client";
import { signMessageAndLoginIfNeeded } from "src/wasm/keplr/client-login";

export const onMutateLogin = (
  client: StargazeClient | null | undefined,
  toast: UseToastTypes
) => {
  return async () => {
    if (!client?.signingCosmwasmClient) {
      toast.error("Connect to keplr!");
      throw new Error("skip mutation");
      // return false;
    }
    const ok = await signMessageAndLoginIfNeeded(client);

    if (ok === false) {
      toast.error("Unauthorized");
      throw new Error("skip mutation");
    } else if (ok) {
      toast.success("Logged in!");
    } else {
      console.log("already logged in");
    }
  };
};
