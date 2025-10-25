import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  IndexerRepoDdb,
  IndexerRepoDdbAdaptor,
  RepositoryDbbAdaptor,
  RepositoryDdbReadonly,
} from "./ddb";
import { UserRepoDdbAdaptor } from "./ddb/adaptor/user-adaptor";
import { UserRepoDdb } from "./ddb/user-repo-ddb";
import { IndexerStoreI } from "./indexerStoreI";
import { ProjectRepositoryI } from "./projectRepositoryI";
import { UserRepoI } from "./user.types";

type Stores = {
  project: ProjectRepositoryI;
  user: UserRepoI;
  indexer: IndexerStoreI;
};

let storesInternal: Stores | null = null;
export const stores = (): Stores => {
  if (storesInternal) {
    return storesInternal;
  }
  const client = new DynamoDBClient();
  const tableName = process.env.DDB_TABLE_NAME;
  if (!tableName) {
    throw new Error("DDB_TABLE_NAME is not set");
  }
  const userStore = new UserRepoDdb(tableName, client);
  const user = new UserRepoDdbAdaptor(userStore);
  const storesNew: Stores = {
    project: new RepositoryDbbAdaptor(
      new RepositoryDdbReadonly(tableName, client),
      userStore
    ),
    user: user,
    indexer: new IndexerRepoDdbAdaptor(new IndexerRepoDdb(tableName, client)),
  };
  storesInternal = storesNew;
  return storesNew;
};
