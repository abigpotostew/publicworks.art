import { IndexerRepoDdb } from "../indexer-ddb.store";
import chainInfo from "../../../stargaze/chainInfo";
import { IndexerStoreI } from "../../indexerStoreI";

export class IndexerRepoDdbAdaptor implements IndexerStoreI {
  constructor(private repository: IndexerRepoDdb) {}

  async getLastSweptHeight() {
    const data = await this.repository.getLastSweptHeight(chainInfo().chainId);
    return {
      height: BigInt(data.height),
      updatedAt: new Date(data.updatedDate),
    };
  }

  setCurrentPollHeightHeight(height: bigint): Promise<void> {
    return Promise.resolve(undefined);
  }

  async setLastSweptHeight(height: bigint): Promise<void> {
    return undefined;
  }
}
