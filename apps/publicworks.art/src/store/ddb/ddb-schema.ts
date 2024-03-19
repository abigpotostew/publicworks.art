import { Entity, Table } from "dynamodb-onetable";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const MySchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
    gsi1: { hash: "gsi1_pk", sort: "gsi1_sk", project: "all" },
    gsi2: { hash: "gsi2_pk", sort: "gsi2_sk", project: "all" },
    gsi3: { hash: "gsi3_pk", sort: "gsi3_sk", project: "all" },
    gsi4: { hash: "gsi4_pk", sort: "gsi4_sk", project: "all" },
    lsi1: { sort: "lsi1", type: "local" }, //string
    lsi2: { sort: "lsi2", type: "local" }, //string
    lsi3: { sort: "lsi3", type: "local" }, //string
    lsi4: { sort: "lsi4", type: "local" }, //number
    lsi5: { sort: "lsi5", type: "local" },
  },
  models: {
    IdCounter: {
      pk: { type: String, value: "${_type}:${chainId}" },
      sk: { type: String, value: "${_type}:" },
      chainId: { type: String, required: true },
      count: { type: Number, default: 0 },
    },
    BlockHeight: {
      chainId: {
        type: String,
        required: true,
        hidden: false,
      },
      pk: {
        type: String,
        value: "Chain:${chainId}",
      },
      id: {
        type: String,
        required: true,
      },
      sk: { type: String, value: "${_type}:${id}" },
      height: { type: Number, required: true },

      created: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      updated: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
    },
    Work: {
      pk: { type: String, value: "Chain:${chainId}#${_type}:${id}" },
      sk: { type: String, value: "${_type}:" },
      chainId: {
        type: String,
        required: true,
        hidden: false,
      },
      id: {
        type: Number,
        required:
          true /*generate: 'ulid', validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i */,
      },
      name: { type: String, required: true },

      slug: { type: String, required: true, unique: true },
      startDate: { type: Date, required: true, timestamp: true },
      hidden: { type: Number, default: 0, required: true },
      ownerId: { type: String, required: true },
      ownerAddress: { type: String, required: true },
      coverImageCid: { type: String, required: false },
      creator: { type: String, required: true },
      codeCid: { type: String, required: false },
      sg721: { type: String, required: false },
      minter: { type: String, required: false },
      publishStatus: { type: Number, required: true },
      description: { type: String, required: true, default: "" },
      blurb: { type: String, required: true, default: "" },
      resolution: { type: String, required: true, default: "1080:1080" },
      selector: { type: String, required: true, default: "canvas" },
      license: { type: String, required: false },
      externalLink: { type: String, required: false },
      pixelRatio: { type: Number, required: true, default: 1 },
      maxTokens: { type: Number, required: true },
      priceStars: { type: Number, required: true, default: 50 },
      royaltyPercent: { type: Number, required: true, default: 5 },
      royaltyAddress: { type: String, required: false },
      sg721CodeId: { type: Number, required: false },
      minterCodeId: { type: Number, required: false },
      isDutchAuction: { type: Boolean, required: true, default: false },
      dutchAuctionEndDate: { type: Date, required: false },
      dutchAuctionEndPrice: { type: Number, required: false },
      dutchAuctionDeclinePeriodSeconds: { type: Number, required: false },
      dutchAuctionDecayRate: { type: Number, required: false },

      gsi1_pk: { type: String, value: "User:${ownerId}" },
      //this doesn't work
      // gsi1ChainId: { type: String, value: 'chain:${chainId}', map: 'gsi1_sk.chainId' },
      // gsi1StartDate: { type: String, value: 'startDate:${startDate}', map: 'gsi1_sk.startDate' },
      // gsi1Id: { type: String, value: '${_type}:${id}', map: 'gsi1_sk.id' },
      //todo use attribute packing https://www.sensedeep.com/blog/posts/2021/attribute-packing.html
      gsi1_sk: {
        type: String,
        value: "Chain:${chainId}#startDate:${startDate}#${_type}:${id:18:0}",
        hidden: false,
      },
      //todo move this to gsi
      // lsi1: { type: String, value: 'workslug:${slug}', required: true },
      gsi3_pk: { type: String, value: "Chain:${chainId}" },
      gsi3_sk: {
        type: String,
        value: "workslug:${slug}",
      },
      //todo move this to gsi
      // lsi2: { type: String, value: 'worksg721:${sg721}' },
      gsi4_pk: { type: String, value: "Chain:${chainId}" },
      gsi4_sk: {
        type: String,
        value: "worksg721:${sg721}",
      },

      //todo move this to gsi
      // lsi3: {
      //   type: String,
      //   value: 'hidden:${hidden}#startDate:${startDate}#${_type}:${id:18:0}',
      //   hidden: false,
      // },

      gsi2_pk: {
        type: String,
        value:
          "Chain:${chainId}#hidden:${hidden}#publishStatus:${publishStatus}",
        hidden: false,
      },
      gsi2_sk: {
        type: String,
        value: "startDate:${startDate}#${_type}:${id:18:0}",
      },

      created: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      updated: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      // status: {type: String, default: 'active'},
      // zip: {type: String},
    },
    WorkToken: {
      pk: {
        type: String,
        value: "Chain:${chainId}#sg721:${sg721}",
      },
      sk: { type: String, value: "${_type}:${tokenId:18:0}" },
      sg721: { type: String, required: true },
      workId: { type: Number, required: true },
      chainId: {
        type: String,
        required: true,
      },
      tokenId: { type: Number, required: true },
      hash: { type: String, required: true },
      status: { type: String, required: true },
      imageUrl: { type: String, required: false },
      metadataUrl: { type: String, required: false },
      blockHeight: { type: String, required: true },
      txHash: { type: String, required: true },
      txMemo: { type: String, required: false },
      hashInput: { type: String, required: true },

      // lsi1: { type: String, value: 'tstatus:${status:8:0}' },

      gsi1_pk: { type: String, value: "Chain:${chainId}#tstatus:${status}" },
      gsi1_sk: {
        type: String,
        value: "${_type}:#sg721:${sg721}#${tokenId:18:0}",
      },

      created: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      updated: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
    },
    User: {
      chainId: {
        type: String,
        required: true,
        hidden: false,
      },
      // pk: { type: String, value: 'Chain:${chainId}' },
      pk: { type: String, value: "${_type}:${id}" },
      sk: { type: String, value: "${_type}:" },
      // generated.
      id: { type: String, required: true },
      address: { type: String, required: true },
      name: { type: String, required: false },

      uniqueId: {
        type: String,
        required: true,
        value: "${chainId}:${address}",
        unique: true,
      },

      lsi1: { type: String, value: "useraddr:${address}" },
      gsi1_pk: { type: String, value: "Chain:${chainId}" },
      gsi1_sk: { type: String, value: "useraddr:${address}" },

      created: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      updated: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
    },
    WorkUploadFile: {
      chainId: {
        type: String,
        required: true,
        hidden: false,
      },

      pk: { type: String, value: "${_type}:${id}" },
      sk: { type: String, value: "${_type}:" },
      id: { type: String, required: true },
      workId: { type: Number, required: true },
      filename: { type: String, required: true },

      gs1pk: { type: String, value: "Chain:${chainId}" },
      gs1sk: { type: String, value: "Work:${workId:18:0}" },

      created: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
      updated: {
        type: Date,
        required: true,
        default: new Date(),
        timestamp: true,
        hidden: false,
      },
    },
  } as const,
  params: {
    isoDates: true,
    timestamps: true,
  },
};
export const schemaHelper = (table: Table<typeof MySchema>) => {
  type WorkType = Entity<typeof MySchema.models.Work>;
  type WorkTokenType = Entity<typeof MySchema.models.WorkToken>;
  type IdCounterType = Entity<typeof MySchema.models.IdCounter>;
  type BlockHeightType = Entity<typeof MySchema.models.BlockHeight>;
  type UserType = Entity<typeof MySchema.models.User>;
  type WorkUploadFileType = Entity<typeof MySchema.models.WorkUploadFile>;

  const Work = table.getModel<WorkType>("Work");
  const WorkToken = table.getModel<WorkTokenType>("WorkToken");
  const IdCounter = table.getModel<IdCounterType>("IdCounter");
  const BlockHeight = table.getModel<BlockHeightType>("BlockHeight");
  const User = table.getModel<UserType>("User");
  const WorkUploadFile = table.getModel<WorkUploadFileType>("WorkUploadFile");

  return {
    Work,
    WorkToken,
    IdCounter,
    BlockHeight,
    User,
    WorkUploadFile,
  };
};

export abstract class DddTable {
  public readonly table: Table;
  protected readonly models: ReturnType<typeof schemaHelper>;

  constructor(client: DynamoDBClient, name?: string) {
    this.table = new Table({
      client: client,
      name: name ?? process.env.DYNAMODB_TABLE_NAME ?? "publicworks",
      schema: MySchema,
      partial: true,
      logger: true,
    });
    this.models = schemaHelper(this.table);
  }
}
export interface OneTableError extends Error {
  code: string;
}

const uniqueError = "UniqueError";
const conditionalCheckError = "ConditionalCheckFailedException";
export const isConditionFailedError = (e: any): e is OneTableError => {
  return [uniqueError, conditionalCheckError].includes(
    (e as unknown as OneTableError)?.code
  );
};
