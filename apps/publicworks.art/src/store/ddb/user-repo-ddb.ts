import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createId } from "../uuid";
import { UserEntityDdb } from "../model";
import { DddTable, isConditionFailedError } from "./ddb-schema";

export class UserRepoDdb extends DddTable {
  constructor(name: string, client: DynamoDBClient) {
    super(client, name);
  }

  async createIfNeeded(chainId: string, address: string) {
    try {
      return await this.models.User.create({
        id: createId(),
        address,
        chainId,
      });
    } catch (e) {
      if (isConditionFailedError(e)) {
        return this.getUser(chainId, address);
      }
      console.log("createIfNeeded unexpected error", e);
      throw e;
    }
  }

  //todo test
  getUser(
    chainId: string,
    address: string
  ): Promise<UserEntityDdb | undefined> {
    return this.models.User.get(
      { gsi1_pk: `Chain:${chainId}`, gsi1_sk: `useraddr:${address}` },
      { index: "gsi1" }
    );
  }
}
