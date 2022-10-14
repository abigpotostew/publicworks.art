import config from "src/wasm/config";
import { StargazeClient } from "@stargazezone/client";
import { Window } from "@keplr-wallet/types/build/window";
import { getToken } from "src/util/auth-token";

export async function signMessageAndLoginIfNeeded(sg: StargazeClient) {
  const token = getToken();
  if (!token) {
    const otp = Math.floor(Math.random() * 100_000).toString();
    return signMessageAndLogin(otp, sg);
  }
  return true;
}

export async function signMessageAndLogin(token: string, sg: StargazeClient) {
  const messageToSign = "Magic, please!" + " " + token;
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

  const windowKeplr = <Window>window;
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

  // this returns the public key in this other format tendermint/PubKeySecp256k1 which I can't figure out how to convert to binary
  // const account = await sg.signingCosmwasmClient.getAccount(sg.wallet.address);

  try {
    const { signed, signature } = await offlineSigner.signAmino(
      sg.wallet.address,
      signDoc
    );
    const travellerSessionToken = token;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        otp: travellerSessionToken,
        signed: signed,
        signature: signature.signature,
        account,
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
