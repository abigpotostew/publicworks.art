import { Sg721QueryClient } from "@stargazezone/contracts/sg721";
import { StargazeClient } from "..";
const getNFTImport = import("./getNFT");

export default class NFTS {
  private stargazeClient: StargazeClient;

  constructor(stargazeClient: StargazeClient) {
    this.stargazeClient = stargazeClient;
  }

  public async getOne({
    collectionAddress,
    tokenId,
  }: {
    collectionAddress: string;
    tokenId: number | string;
  }) {
    try {
      const getNFT = (await getNFTImport).default;

      const collection =
        await this.stargazeClient.collections.getOneByAddress(
          collectionAddress
        );
      const client = this.stargazeClient.cosmwasmClient;
      const marketContract = this.stargazeClient.marketContract;
      const sg721 = new Sg721QueryClient(client, collectionAddress);

      return getNFT({
        collection,
        client,
        tokenId,
        sg721,
        marketContract,
      });
    } catch (e) {
      throw new Error("Error fetching collection.");
    }
  }
}
