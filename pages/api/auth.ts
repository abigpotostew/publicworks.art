// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs/crypto";
import { serializeSignDoc } from "../../src/wasm/keplr/query";
import { fromBase64 } from "@cosmjs/encoding";
import * as jwt from 'jsonwebtoken'
import Cookies from "cookies";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if(req.method!=='POST'){
    res.status(404).json({ message: "not found" })
    return 
  }
  
  const {signed, signature, account, otp} = req.body
  const publicKey = account.pubkey
  const valid = await isValidSignature(signed,signature,publicKey)
  if(!valid){
    res.status(401).json({ message: "unauthorized" })
    return;
  }
  
  const correct = isCorrectOtp(otp, signed)
  if(!correct){
    res.status(403).json({ message: "forbidden" })
    return;
  }
const secret = process.env.JWT_SECRET;
  if(!secret){
    throw new Error('missing secret')
  }
  const token = jwt.sign(
    { account: account.address },
    secret,
    {
      expiresIn: "24h",
    }
  );
const cookies = new Cookies(req, res)
  cookies.set('PWToken', token, {maxAge:86_400_000, sameSite:'strict'})
  
  res.status(200).json({ token })
}


const isValidSignature = async (signed:any, signature:any, publicKey:any) => {
  let valid = false;
  try {
    let binaryHashSigned = sha256(serializeSignDoc(signed));
    let binaryPublicKey = new Uint8Array(Object.values(publicKey));

    valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature)),
      binaryHashSigned,
      binaryPublicKey,
    );
  } catch (e) {
    console.error('Issue trying to verify the signature', e);
  } finally {
    return valid;
  }
}

// Returns boolean whether the user signed the right thing
const isCorrectOtp = async (expectedOtp:string, signed:any) => {
  let isCorrect = false;
  try {
    // What they signed
    const signedSaganism = signed.msgs[0].value;
    // What they should have signed
    const assignedSaganism = 'Magic, please!' +' '+ expectedOtp;
    isCorrect = signedSaganism === assignedSaganism;
  } catch (e) {
    console.error('Issue determining if the user signed the right thing', e);
  } finally {
    return isCorrect;
  }
}