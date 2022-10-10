import { StargazeClient } from '..';
import type { GetCollectionOptions } from './types';

const getAllCollectionsImport = import('./getAllCollections');
const getCollectionImport = import('./getCollection');

const defaultOptions: GetCollectionOptions = {
  includeNameAndSymbol: true,
  includeMarketplaceInfo: false,
};

export default class Collections {
  private stargazeClient: StargazeClient;

  constructor(stargazeClient: StargazeClient) {
    this.stargazeClient = stargazeClient;
  }

  public async getAll(
    {
      exclude,
      collectionOptions,
    }: {
      exclude?: string[];
      collectionOptions: GetCollectionOptions;
    } = {
      exclude: [],
      collectionOptions: defaultOptions,
    }
  ) {
    const getAllCollections = (await getAllCollectionsImport).default;
    return getAllCollections(
      {
        codeId: this.stargazeClient.sg721CodeId,
        client: this.stargazeClient.cosmwasmClient,
        marketContract: this.stargazeClient.marketContract,
        marketplaceClient: this.stargazeClient.marketplaceClient,
      },
      collectionOptions,
      exclude
    );
  }

  public async getOneByAddress(
    address: string,
    options: GetCollectionOptions = defaultOptions
  ) {
    try {
      const getCollection = (await getCollectionImport).default;
      return getCollection(
        {
          address,
          client: this.stargazeClient.cosmwasmClient,
          marketContract: this.stargazeClient.marketContract,
          marketplaceClient: this.stargazeClient.marketplaceClient,
        },
        options
      );
    } catch {
      throw new Error('Error fetching collection.');
    }
  }

  public async getAllWithAsks(options?: { exclude?: string[] }) {
    // Init options
    const exclude = options?.exclude ?? [];

    const collections = await this.getAll({
      exclude,
      collectionOptions: {
        includeNameAndSymbol: true,
        includeMarketplaceInfo: true,
      },
    });

    // Filter for asks
    return collections?.filter(
      (collection) =>
        collection.marketplaceInfo?.count &&
        collection.marketplaceInfo?.count > 0
    );
  }
}
