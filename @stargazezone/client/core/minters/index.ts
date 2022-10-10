const getMintersByListImport = import('./getMintersByList');
const getAllMintersImport = import('./getAllMinters');
const getMinterImport = import('./getMinter');
const getNumTokensLeftImport = import('./getNumTokensLeft');

import type { GetMintersOptions } from './types';
import { StargazeClient } from '..';

export default class Minters {
  private stargazeClient: StargazeClient;

  constructor(stargazeClient: StargazeClient) {
    this.stargazeClient = stargazeClient;
  }

  public async getOneByAddress(
    contract: string,
    options: GetMintersOptions = {}
  ) {
    const getMinter = (await getMinterImport).default;
    return getMinter(contract, this.stargazeClient.cosmwasmClient, options);
  }

  public async getByList(contracts: string[], options: GetMintersOptions = {}) {
    const getMintersByList = (await getMintersByListImport).default;
    return getMintersByList(
      contracts,
      this.stargazeClient.cosmwasmClient,
      options
    );
  }

  public async getAll(options: GetMintersOptions = {}) {
    const getAllMinters = (await getAllMintersImport).default;
    return getAllMinters(
      this.stargazeClient.minterCodeId,
      this.stargazeClient.cosmwasmClient,
      options
    );
  }

  public async mint() {
    // Mint one, requires signed client.
  }

  public async checkOnWhitelist(
    walletAddress?: string,
    whitelistContract?: string
  ) {
    if (!whitelistContract || !walletAddress) return false;
    const client = this.stargazeClient.cosmwasmClient;
    const { has_member } = await client.queryContractSmart(whitelistContract, {
      has_member: { member: walletAddress },
    });
    return has_member;
  }

  public async isWhitelistActive(whitelistContract?: string) {
    if (!whitelistContract) return false;
    const client = this.stargazeClient.cosmwasmClient;
    const { is_active } = await client.queryContractSmart(whitelistContract, {
      is_active: {},
    });
    return is_active;
  }

  public async getNumTokensLeft(minterContract: string): Promise<number> {
    const getNumTokens = (await getNumTokensLeftImport).default;
    return getNumTokens(minterContract, this.stargazeClient.cosmwasmClient);
  }
}
