import config, { Config } from "../config";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import { keplrClient } from "./keplr-client";
import { OfflineAminoSigner } from "@cosmjs/amino";
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs/crypto";
import { fromBase64, fromHex } from "@cosmjs/encoding";
import { toUtf8 } from "@cosmjs/encoding";

export class QueryContract {
  private readonly config: Config;
  private readonly client: CosmWasmClient;
  private keplrClient: SigningCosmWasmClient | undefined;
  private keplerOfflineClient: OfflineAminoSigner |OfflineDirectSigner| undefined;

  constructor(config: Config, client: CosmWasmClient) {
    this.config = config;
    this.client = client;
  }

  public static async init(config: Config) {
    const client = await CosmWasmClient.connect(config.rpcEndpoint);
    return new QueryContract(config, client);
  }

  async getBalance(address: string) {
    return this.client.getBalance(address, 'ustars');
  }

  // async getTokenInfo(tokenId: string) {
  //   return this.client.queryContractSmart(this.config.sg721, { nft_info: { token_id: tokenId } })
  // }

  // async getAllOwnedTokens(address: string) {
  //   let allTokens: string[] = [];
  //
  //   const limit = 30;
  //   let start_after = '0';
  //   while (1) {
  //     // let start_after = (i * limit).toString()
  //     const page = await this.client.queryContractSmart(this.config.sg721, {
  //       tokens: {
  //         owner: address,
  //         start_after,
  //         limit
  //       }
  //     });
  //     if (!page || !page.tokens || page.tokens.length === 0) {
  //       break;
  //     }
  //     start_after = page.tokens[page.tokens.length - 1];
  //     allTokens.push(...page.tokens as string[]);
  //   }
  //
  //   // const ints = allTokens.map(t => parseInt(t))
  //   // const sortedInts = ints.sort((a, b) => a - b)
  //   const all = allTokens.map(t => parseInt(t)).sort((a, b) => a - b).map(t => t.toString());
  //   return all
  // }
  //
  // // probably don't need this, it returns tokens in lexographic order
  // async getAllTokens({ limit = 30, start_after = '0' }: { limit?: number, start_after?: string }) {
  //   const props = { limit, start_after };
  //   const ownedTokens = await this.client.queryContractSmart(this.config.sg721, { all_tokens: props });
  //   return ownedTokens.tokens as string[];
  // }
  //
  // async getNumberTokensTotal() {
  //   const num_tokens = await this.client.queryContractSmart(this.config.sg721, { num_tokens: {} });
  //   return num_tokens.count as number;
  // }

  async getAccounts() {
    if (this.keplerOfflineClient) {
      const accounts = this.keplerOfflineClient.getAccounts();
      return accounts
    } else {
      throw new Error('Kepler Offline Client not initialized')
    }
  }

  async connectKeplr() {
    if (this.keplrClient) {
      return;
    }
    const { signer, offlineSigner } = await keplrClient(config);
    this.keplrClient = signer;
    this.keplerOfflineClient = offlineSigner;
  }

  async signMessage (token:string) {
    const messageToSign = 'Magic, please!' +' '+ token;
    const signDoc = {
      msgs: [{
        type: 'publicworks-login',
        value: messageToSign
      }],
      fee: {
        amount: [],
        // Note: this needs to be 0 gas to comply with ADR36, but Keplr current throws an error. See: https://github.com/cosmos/cosmos-sdk/blob/master/docs/architecture/adr-036-arbitrary-signature.md#decision
        gas: "1"
      },
      chain_id: this.config.chainId,
      memo: "You are powerful and capable, friend.",
      account_number: "0",
      sequence: "0",
    };
    
    if(!this.keplrClient){
      throw new Error("not connected to keplr")
    }

    if(!this.keplerOfflineClient || !('signAmino' in this.keplerOfflineClient)){
      throw new Error('missing sign amino')
    }
    
    const accounts = await this.getAccounts()
    try {
      const {signed, signature} = await this.keplerOfflineClient.signAmino(accounts[0].address, signDoc);
      const travellerSessionToken = token;

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          otp: travellerSessionToken,
          signed: signed,
          signature: signature.signature,
          account: accounts[0]
        })
      };
      
      const response = await fetch(`/api/login`, requestOptions);

      if (response.status !== 200) {
        console.error('response is', response.status)
        throw new Error('bad response from auth')
      }
      // Successful
      const responseJson = await response.json()
      
      
      
    } catch (e) {
      if ((e as any)?.message === 'Request rejected') {
        console.log({message: 'Rejected signing 🙅'});
      } else {
        console.log({message: `Unknown error 😬: ${(e as any).message}`});
      }
    }
  }
}

export interface AminoMsg {
  readonly type: string;
  readonly value: any;
}

export interface StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string;
}
export interface Coin {
  readonly denom: string;
  readonly amount: string;
}

export function serializeSignDoc(signDoc: StdSignDoc): Uint8Array {
  return toUtf8(sortedJsonStringify(signDoc));
}export interface StdSignDoc {
  readonly chain_id: string;
  readonly account_number: string;
  readonly sequence: string;
  readonly fee: StdFee;
  readonly msgs: readonly AminoMsg[];
  readonly memo: string;
}

function sortedObject(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortedObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
  sortedKeys.forEach((key) => {
    result[key] = sortedObject(obj[key]);
  });
  return result;
}

/** Returns a JSON string with objects sorted by key */
export function sortedJsonStringify(obj: any): string {
  return JSON.stringify(sortedObject(obj));
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
