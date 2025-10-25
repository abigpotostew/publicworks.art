import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BlockheightEntity } from "../../db-typeorm/model/blockheight.entity";
import { DddTable } from "./ddb-schema";

export class IndexerRepoDdb extends DddTable {
  constructor(name: string, client: DynamoDBClient) {
    super(client, name);
  }

  async getLastSweptHeight(chainId: string): Promise<BlockheightEntity> {
    const blockHeight = await this.models.BlockHeight.get({
      chainId: chainId,
      id: "last_swept_height",
    });
    if (!blockHeight) {
      return {
        height: "0",
        id: "0",
        name: "last_swept_height",
        createdDate: new Date(0),
        updatedDate: new Date(0),
      };
    }
    const height = new BlockheightEntity();
    height.id = blockHeight.id;
    height.height = blockHeight.height.toString();
    height.name = blockHeight.id;
    height.createdDate = blockHeight.created;
    height.updatedDate = blockHeight.updated;
    return height;
  }
}
