import { AccountData, StdSignature, StdSignDoc } from "cosmwasm";

export interface SignatureVerify {
  otp: string;
}
export interface SignAminoVerification extends SignatureVerify {
  signature: StdSignature;
  signed: StdSignDoc;
  account: AccountData;
  otp: string;
}

export interface SignArbitraryVerification extends SignatureVerify {
  signature: StdSignature;
  address: string;
  otp: string;
}
