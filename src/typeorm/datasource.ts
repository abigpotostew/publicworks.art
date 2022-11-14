import { DataSource } from "typeorm";
import {
  BlockheightEntity,
  WorkEntity,
  TokenEntity,
  UserEntity,
  WorkUploadFile,
} from "../model";

let MysqlDataSource: DataSource | undefined = undefined;
export const dataSource = () => {
  if (!MysqlDataSource) {
    throw new Error("typeorm not initialized");
  }
  return MysqlDataSource;
};

let initializingPromise: Promise<void> | undefined = undefined;
export const initializeIfNeeded = () => {
  if (MysqlDataSource) {
    return Promise.resolve();
  }
  if (initializingPromise) {
    return initializingPromise;
  }
  initializingPromise = initializeDatasource();
  return initializingPromise;
};

export const initializeDatasource = () => {
  if (MysqlDataSource) {
    throw new Error("typeorm already initialized");
  }

  const entities = "src/model/index{.ts, .js}";
  console.log("ENTITIES: ", entities);

  const ds = new DataSource({
    type: "mysql",
    port: 3306,
    url: process.env.DATABASE_URL,
    ssl: {
      ca: process.env.SSL_CERT,
    },
    entities: [
      WorkEntity,
      UserEntity,
      TokenEntity,
      WorkUploadFile,
      BlockheightEntity,
    ],
    logging: process.env.TYPEORM_LOGGING ? "all" : undefined,
    debug: process.env.TYPEORM_DEBUG === "true",
    acquireTimeout: 3 * 60 * 60 * 1000,
    connectTimeout: 3 * 60 * 60 * 1000,
    migrations: [],
    // maxQueryExecutionTime: 1000,
  });
  return ds.initialize().then(() => {
    MysqlDataSource = ds;
    console.log("Data Source has been initialized!");
  });
};
