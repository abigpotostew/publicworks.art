import type { WalletInfo } from './types';
import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainInfo } from '@keplr-wallet/types';
const getKeplrWalletImport = import('./getKeplrWallet');
export default class Wallet {
  cosmwasmClient: CosmWasmClient;
  chainId: string;
  chainInfo: ChainInfo;

  private _walletInfo: WalletInfo | null = null;

  constructor({
    cosmwasmClient,
    chainId,
    chainInfo,
  }: {
    cosmwasmClient: CosmWasmClient;
    chainId: string;
    chainInfo: ChainInfo;
  }) {
    this.cosmwasmClient = cosmwasmClient;
    this.chainId = chainId;
    this.chainInfo = chainInfo;
  }

  public async getBalance() {
    if (this._walletInfo && this.address) {
      try {
        let result = await this.cosmwasmClient.getBalance(
          this.address,
          'ustars'
        );
        this._walletInfo.balance = result;
        return result;
      } catch (e) {
        console.log('error getting balance', e);
      }
    }
    return this._walletInfo?.balance;
  }

  public async getWallet(forceRefresh: boolean = false) {
    if (!this._walletInfo || forceRefresh) {
      const getKeplrWallet = (await getKeplrWalletImport).default;
      const wallet = await getKeplrWallet(this.chainId, this.chainInfo);
      this._walletInfo = wallet;

      await this.getBalance();
    }

    return this._walletInfo;
  }

  public get wallet(): WalletInfo | null {
    return this._walletInfo;
  }

  public get address(): string {
    return this._walletInfo?.address ?? '';
  }

  public get name() {
    return this._walletInfo?.name;
  }

  public get balance() {
    return this._walletInfo?.balance;
  }

  public set address(address: string) {
    this._walletInfo = {
      ...this._walletInfo,
      address,
    };
  }
}
