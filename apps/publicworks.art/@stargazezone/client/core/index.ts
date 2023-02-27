import { ChainInfo } from "@keplr-wallet/types";

// Model classes
import Minters from "./minters";
import Wallet from "./wallet";
import Collections from "./collections";

// dynamically import these heavy lib-using functions
const getCosmWasmClientImport = import("./cosmwasm/getCosmWasmClient");
const getSigningCosmWasmClientImport = import(
  "./cosmwasm/getSigningCosmWasmClient"
);

// import types -- gets erased at runtime
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
import type {
  SigningCosmWasmClient,
  CosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import {
  MarketplaceClient,
  MarketplaceQueryClient,
} from "@stargazezone/contracts/marketplace";
import NFTS from "./nfts";
import {
  Sg721NameClient,
  Sg721NameQueryClient,
} from "../../contracts/names/Sg721Name.client";

export class StargazeClient {
  // Cosmwasm Clients
  private _cosmwasmClient: CosmWasmClient | null = null;
  public signingCosmwasmClient: SigningCosmWasmClient | null = null;
  public marketplaceClient: MarketplaceQueryClient | null = null;
  public signingMarketplaceClient: MarketplaceClient | null = null;
  public signingSg721NameClient: Sg721NameClient | null = null;

  // Config values
  public marketContract: string;
  public chainInfo: ChainInfo;
  public minterCodeId: number;
  public sg721CodeId: number;
  public nameCollectionContract: string;
  public sg721NameClient: Sg721NameQueryClient;

  // Class instances
  private _minters: Minters | null = null;
  private _wallet: Wallet | null = null;
  private _collections: Collections | null = null;
  private _nfts: NFTS | null = null;

  // Create a new stargaze client with a client config.
  constructor({
    chainInfo,
    minterCodeId,
    marketContract,
    sg721CodeId,
    nameCollectionContract,
  }: {
    chainInfo: ChainInfo;
    minterCodeId: number;
    marketContract: string;
    sg721CodeId: number;
    nameCollectionContract: string;
  }) {
    this.chainInfo = chainInfo;
    this.minterCodeId = minterCodeId;
    this.marketContract = marketContract;
    this.sg721CodeId = sg721CodeId;
    this.nameCollectionContract = nameCollectionContract;
  }

  public async connect() {
    if (this.cosmwasmClient) {
      return; // Already connected.
    }

    const getCosmWasmClient = (await getCosmWasmClientImport).default;
    // create cosmwasm client
    this._cosmwasmClient = await getCosmWasmClient(this.chainInfo.rpc);

    await this.createMarketplaceClient();
    await this.createSg721NameClient();
  }

  public get cosmwasmClient(): CosmWasmClient {
    return this._cosmwasmClient as CosmWasmClient;
  }

  public get collections(): Collections {
    if (!this.cosmwasmClient) {
      throw new Error(
        "Client not connected. Make sure to run connect() on your stargaze client instance."
      );
    }

    if (this._collections) {
      return this._collections;
    }

    this._collections = new Collections(this);

    return this._collections;
  }

  public get nfts(): NFTS {
    if (!this.cosmwasmClient) {
      throw new Error(
        "Client not connected. Make sure to run connect() on your stargaze client instance."
      );
    }

    if (this._nfts) {
      return this._nfts;
    }

    this._nfts = new NFTS(this);

    return this._nfts;
  }

  public get minters(): Minters {
    if (!this.cosmwasmClient) {
      throw new Error(
        "Client not connected. Make sure to run connect() on your stargaze client instance."
      );
    }

    if (this._minters) {
      return this._minters;
    }

    this._minters = new Minters(this);

    return this._minters;
  }

  private async createMarketplaceClient() {
    if (this._wallet?.address && this.signingCosmwasmClient) {
      this.signingMarketplaceClient = new MarketplaceClient(
        this.signingCosmwasmClient,
        this._wallet.address,
        this.marketContract
      );
    } else if (this.cosmwasmClient) {
      this.marketplaceClient = new MarketplaceQueryClient(
        this.cosmwasmClient,
        this.marketContract
      );
    }

    return this.signingMarketplaceClient ?? this.marketplaceClient;
  }

  public async connectSigningClient() {
    const getSigningCosmWasmClient = (await getSigningCosmWasmClientImport)
      .default;
    this.signingCosmwasmClient = await getSigningCosmWasmClient(this.chainInfo);
    return this.signingCosmwasmClient;
  }

  public async connectSigning() {
    try {
      await this.connectSigningClient();

      if (!this.cosmwasmClient) {
        throw new Error("Error loading cosmwasm client.");
      }

      if (!this.signingCosmwasmClient) {
        throw new Error("Couldn't connect signing cosmwasm client.");
      }

      const wallet = await this.wallet.getWallet();

      // Create signed marketplace client
      await this.createMarketplaceClient();

      return wallet;
    } catch (e) {
      console.log(e);
    }
  }

  public async disconnectSigning() {
    this.signingCosmwasmClient?.disconnect();
    this._wallet = null;
    await this.createMarketplaceClient();
  }

  public get wallet(): Wallet {
    if (!this.cosmwasmClient) {
      throw new Error(
        "Client not connected. Make sure to run connect() on your stargaze client instance."
      );
    }

    if (this._wallet) {
      return this._wallet;
    }

    // Create wallet
    this._wallet = new Wallet({
      cosmwasmClient: this.cosmwasmClient,
      chainId: this.chainInfo.chainId,
      chainInfo: this.chainInfo,
    });

    return this._wallet;
  }
  private async createSg721NameClient() {
    if (this._wallet?.address && this.signingCosmwasmClient) {
      this.signingSg721NameClient = new Sg721NameClient(
        this.signingCosmwasmClient,
        this._wallet.address,
        this.nameCollectionContract
      );
    } else if (this.cosmwasmClient) {
      this.sg721NameClient = new Sg721NameQueryClient(
        this.cosmwasmClient,
        this.nameCollectionContract
      );
    }

    return this.signingSg721NameClient ?? this.sg721NameClient;
  }
}
