// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Secp256k1,
  Secp256k1Signature,
  sha256,
  Secp256k1Keypair,
} from "@cosmjs/crypto";
import { serializeSignDoc } from "../../src/wasm/keplr/query";
import { fromBase64 } from "@cosmjs/encoding";
import { issueToCookie } from "../../src/auth/jwt";
import { stores } from "../../src/store/stores";
import { initializeIfNeeded } from "../../src/typeorm/datasource";
import {
  SignAminoVerification,
  SignArbitraryVerification,
} from "src/wasm/keplr/strategies";
import { buildMessage } from "src/wasm/keplr/sign-arbitrary";
import { decodeSignature } from "@cosmjs/amino";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import chainInfo from "src/stargaze/chainInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initializeIfNeeded();
  if (req.method !== "POST") {
    res.status(404).json({ message: "not found" });
    return;
  }

  let { strategy } = req.body;
  strategy = strategy || "SIGNAMINO";

  let resolveAddress: string;
  let verified = false;
  if (strategy === "SIGNAMINO") {
    const { signed, signature, account, otp } =
      req.body as SignAminoVerification;
    const publicKey = account.pubkey;
    const valid = await isValidSignature(signed, signature, publicKey);
    if (!valid) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    verified = await isCorrectOtp(otp, signed);
    resolveAddress = account.address;
  } else if (strategy === "SIGNARBITRARY") {
    //
    const { signature, address, otp } = req.body as SignArbitraryVerification;
    const { pubkey: decodedPubKey, signature: decodedSignature } =
      decodeSignature(signature);
    const data = JSON.stringify(buildMessage(otp));
    // https://github.com/wgwz/simple-express-keplr-passport/pull/2
    verified = verifyADR36Amino(
      chainInfo.bech32Config.bech32PrefixAccAddr,
      address,
      data,
      decodedPubKey,
      decodedSignature
    );
    resolveAddress = address;
  } else {
    console.log("Unsupported signing strategy: ", strategy);
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  if (!verified) {
    res.status(403).json({ message: "forbidden" });
    return;
  }

  try {
    await stores().user.createIfNeeded(resolveAddress);
  } catch (e) {
    console.error(e);
    throw e;
  }

  issueToCookie(resolveAddress, req, res);
  res.status(200).json({ message: "ok" });
}

const isValidSignature = async (
  signed: any,
  signature: any,
  publicKey: any
) => {
  let valid = false;
  try {
    const binaryHashSigned = sha256(serializeSignDoc(signed));

    const binaryPublicKey = new Uint8Array(Object.values(publicKey));

    valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature)),
      binaryHashSigned,
      binaryPublicKey
    );
  } catch (e) {
    console.error("Issue trying to verify the signature", e);
  }
  return valid;
};

// Returns boolean whether the user signed the right thing
const isCorrectOtp = async (expectedOtp: string, signed: any) => {
  let isCorrect = false;
  try {
    // What they signed
    const signedSaganism = signed.msgs[0].value;
    // What they should have signed
    const assignedSaganism = "Magic, please!" + " " + expectedOtp;
    isCorrect = signedSaganism === assignedSaganism;
  } catch (e) {
    console.error("Issue determining if the user signed the right thing", e);
  }
  return isCorrect;
};
