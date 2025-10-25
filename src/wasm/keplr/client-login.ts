import config from "src/wasm/config";
import { StargazeClient } from "@stargazezone/client";
import { Window } from "@keplr-wallet/types/build/window";
import { getToken } from "src/util/auth-token";
import chainInfo from "src/stargaze/chainInfo";
import { buildMessage } from "src/wasm/keplr/sign-arbitrary";
import {
  SignAminoVerification,
  SignArbitraryVerification,
  SignatureVerify,
} from "src/wasm/keplr/strategies";

export async function signMessageAndLoginIfNeeded(sg: StargazeClient) {
  const token = getToken();
  let needsTokenRefresh = false;
  if (token) {
    try {
      const jwtString = token;
      const parts = jwtString.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT");
      } else {
        const body = JSON.parse(atob(parts[1]));
        const exp = body.exp;
        const epxiration = new Date(exp * 1000);
        if (epxiration < new Date(Date.now() + 1000 * 5 * 60)) {
          needsTokenRefresh = true;
        }
      }
    } catch (e) {
      needsTokenRefresh = true;
    }
  }
  if (!token || needsTokenRefresh) {
    const otp = Math.floor(Math.random() * 100_000).toString();
    const signedResult = signMessageAndLogin(otp, sg);
    return signedResult;
  }
  return null;
}

export interface SigningStrategy<Res extends SignatureVerify> {
  (otp: string, sg: StargazeClient, keplrWindow: Window): Promise<Res>;
}

export async function signMessageAndLogin(
  token: string,
  sg: StargazeClient,
  strategy: "SIGNAMINO" | "SIGNARBITRARY" = "SIGNARBITRARY"
) {
  try {
    const otp = token;

    let msg: SignatureVerify;
    const windowKeplr = <Window>window;
    if (strategy === "SIGNAMINO") {
      msg = await signLoginMessageWithAmino(otp, sg, windowKeplr);
    } else if (strategy === "SIGNARBITRARY") {
      msg = await signLoginMessageWithArbitrary(otp, sg, windowKeplr);
    } else {
      throw new Error("Unsupported signing strategy");
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...msg,
        strategy,
      }),
    };

    const response = await fetch(`/api/login`, requestOptions);

    if (response.status !== 200) {
      console.error("response is", response.status);
      throw new Error("bad response from auth");
    }
    // Successful
    const responseJson = await response.json();
    return true;
  } catch (e) {
    if ((e as any)?.message === "Request rejected") {
      console.log({ message: "Rejected signing 🙅" });
    } else {
      console.log({ message: `Unknown error 😬: ${(e as any).message}` });
    }
    return false;
  }
}

const signLoginMessageWithAmino: SigningStrategy<
  SignAminoVerification
> = async (otp: string, sg: StargazeClient, keplrWindow: Window) => {
  const messageToSign = "Magic, please!" + " " + otp;
  const signDoc = {
    msgs: [
      {
        type: "publicworks-login",
        value: messageToSign,
      },
    ],
    fee: {
      amount: [],
      // Note: this needs to be 0 gas to comply with ADR36, but Keplr current throws an error. See: https://github.com/cosmos/cosmos-sdk/blob/master/docs/architecture/adr-036-arbitrary-signature.md#decision
      gas: "1",
    },
    chain_id: config.chainId,
    memo: "Welcome to publicworks.art",
    account_number: "0",
    sequence: "0",
  };

  if (!sg?.signingCosmwasmClient || !sg.wallet.address) {
    throw new Error("not connected to keplr");
  }

  const windowKeplr = keplrWindow;
  if (!windowKeplr.getOfflineSignerAuto) {
    // Setup signer

    throw new Error("no offline signer");
  }
  const offlineSigner = await windowKeplr.getOfflineSignerAuto(config.chainId);
  if (!("signAmino" in offlineSigner)) {
    throw new Error("missing sign amino");
  }
  const acounts = await offlineSigner.getAccounts();
  const account = acounts.find((a) => a.address === sg.wallet.address);
  if (!account) {
    throw new Error("could not find account");
  }

  const { signed, signature } = await offlineSigner.signAmino(
    sg.wallet.address,
    signDoc
  );
  return { signed, signature, account, otp };
};

const signLoginMessageWithArbitrary: SigningStrategy<
  SignArbitraryVerification
> = async (otp: string, sg: StargazeClient, keplrWindow: Window) => {
  const keplr = keplrWindow.keplr;
  if (!keplr) {
    throw new Error("Keplr not installed");
  }
  const key = await keplr.getKey(chainInfo().chainId);
  const userAddress = key.bech32Address;

  const signature = await keplr.signArbitrary(
    chainInfo().chainId,
    userAddress,
    JSON.stringify(buildMessage(otp))
  );

  return {
    signature,
    address: userAddress,
    otp,
  };
};
