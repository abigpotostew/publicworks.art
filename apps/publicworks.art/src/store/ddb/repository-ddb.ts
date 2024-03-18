import { Err, Ok, Result } from "../../util/result";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
import {
  BlockheightEntityDdb,
  UserEntityDdb,
  WorkEntityDdb,
  WorkTokenEntityDdb,
  WorkUploadFileEntityDdb,
} from "../model/ddb";
import { TokenStatuses } from "../types";
import { createId } from "../uuid";

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
      coverImageCid: { type: String, required: false },
      creator: { type: String, required: true },
      codeCid: { type: String, required: false },
      sg721: { type: String, required: false },
      minter: { type: String, required: false },
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

      gsi2_pk: { type: String, value: "Chain:${chainId}#hidden:${hidden}" },
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

      gsi1_pk: { type: String, value: "Chain:${chainId}" },
      gsi1_sk: { type: String, value: "tstatus:${status:8:0}" },

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

      lsi1: { type: String, value: "useraddr:${address}" },
      gs1pk: { type: String, value: "Chain:${chainId}" },
      gs1sk: { type: String, value: "useraddr:${address}" },

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

const schemaHelper = (table: Table<typeof MySchema>) => {
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

export enum EntityDdbError {
  NotFound,
  AlreadyExists,
  Unknown,
}
export abstract class DddTable {
  public readonly table: Table;
  protected readonly models: ReturnType<typeof schemaHelper>;
  constructor(client: DynamoDBClient, name?: string) {
    this.table = new Table({
      client: client,
      name: name ?? process.env.DYNAMODB_TABLE_NAME ?? "publicworks",
      schema: MySchema,
      partial: true,
      // logger: true,
    });
    this.models = schemaHelper(this.table);
  }
}

export class RepositoryDdb extends DddTable {
  constructor(name: string, client: DynamoDBClient) {
    super(client, name);
  }

  createTable() {
    // this will default to pay per request billing
    return this.table.createTable({});
  }

  async createWork(
    work: Omit<
      WorkEntityDdb,
      | "id"
      | "created"
      | "updated"
      | "resolution"
      | "selector"
      | "pixelRatio"
      | "priceStars"
      | "royaltyPercent"
      | "startDate"
    > & {
      startDate?: Date;
      resolution?: string;
      selector?: string;
      pixelRatio?: number;
      priceStars?: number;
      royaltyPercent?: number;
    }
  ): Promise<Result<WorkEntityDdb, EntityDdbError>> {
    const Work = this.models.Work;
    try {
      //increment the id using atomic counter
      try {
        //create it if it doesn't exist
        await this.models.IdCounter.create({ chainId: work.chainId, count: 0 });
      } catch (e) {
        //ignore
      }
      const counter = await this.models.IdCounter.update(
        { chainId: work.chainId },
        {
          add: {
            count: 1,
          },
          return: "UPDATED_NEW",
        }
      );
      if (!counter.count) {
        throw new Error("counter.count is undefined");
      }
      const id = counter.count;
      const out = await Work.create({
        ...work,
        id: id,
        startDate: work.startDate ?? new Date(0),
      });

      return Ok(out);
    } catch (e) {
      console.log("error creating work", e);
      if (
        typeof e === "object" &&
        !!e &&
        "code" in e &&
        e.code === "ConditionalCheckFailedException"
      ) {
        return Err(EntityDdbError.AlreadyExists);
      }
      throw e;
    }
  }

  async createWorkToken(
    workToken: Omit<WorkTokenEntityDdb, "created" | "updated">
  ): Promise<Result<WorkTokenEntityDdb, EntityDdbError>> {
    try {
      const out = await this.models.WorkToken.create(workToken, {
        consistent: true,
      });
      return Ok<WorkTokenEntityDdb, EntityDdbError>(out);
    } catch (e) {
      if (
        typeof e === "object" &&
        !!e &&
        "code" in e &&
        e.code === "ConditionalCheckFailedException"
      ) {
        return Err(EntityDdbError.AlreadyExists);
      }
      throw e;
    }
  }

  async createWorkTokenMigration(
    workToken: WorkTokenEntityDdb
  ): Promise<WorkTokenEntityDdb> {
    return this.models.WorkToken.create(workToken, { timestamps: false });
  }

  getAllTokensWithStatus(
    chainId: string,
    status: TokenStatuses,
    limit?: number
  ): Promise<WorkTokenEntityDdb[]> {
    return this.models.WorkToken.find(
      {
        chainId,
        status: status.toString(),
      },
      { limit, index: "gsi1" }
    );
  }

  getFinalizingTokens(chainId: string): Promise<WorkTokenEntityDdb[]> {
    return this.getAllTokensWithStatus(chainId, TokenStatuses.FINALIZING);
  }

  async getLastSweptHeight(
    chainId: string
  ): Promise<BlockheightEntityDdb | undefined> {
    const height = await this.models.BlockHeight.get({
      chainId: chainId,
      id: "last_swept_height",
    });
    return height;
  }

  async setLastSweptHeight(chainId: string, height: number): Promise<void> {
    // await this.models.BlockHeight.upsert({});
    await this.models.BlockHeight.upsert({
      chainId: chainId,
      id: "last_swept_height",
      height: height,
    });
    return;
  }

  async setCurrentPollHeightHeight(
    chainId: string,
    height: number
  ): Promise<void> {
    // await this.models.BlockHeight.upsert({});
    await this.models.BlockHeight.upsert({
      chainId: chainId,
      id: "poll_height",
      height: height,
    });
    return;
  }

  async getToken(
    chainId: string,
    workId: number,
    tokenId: number
  ): Promise<WorkTokenEntityDdb | undefined> {
    const work = await this.getProjectForId(chainId, workId);
    if (!work || !work.sg721) {
      return undefined;
    }
    return this.getTokenById({ chainId, sg721: work.sg721, tokenId });
  }

  async getTokenById({
    chainId,
    sg721,
    tokenId,
  }: {
    chainId: string;
    sg721: string;
    tokenId: number;
  }): Promise<WorkTokenEntityDdb | undefined> {
    return this.models.WorkToken.get({ chainId, sg721: sg721, tokenId });
  }

  async getProjectAndTokenById(
    chainId: string,
    projectId: number,
    tokenId: number
  ): Promise<{
    project: WorkEntityDdb;
    token: WorkTokenEntityDdb;
  } | null> {
    const project = await this.getProjectForId(chainId, projectId);
    if (!project?.sg721) {
      return null;
    }
    const token = await this.getTokenById({
      chainId,
      sg721: project.sg721,
      tokenId,
    });
    if (!project || !token) {
      return null;
    }
    return { project, token };
  }

  getProjectForId(
    chainId: string,
    id: number
  ): Promise<WorkEntityDdb | undefined> {
    return this.models.Work.get({ chainId, id });
  }

  getProjectBySlug(
    chainId: string,
    slug: string
  ): Promise<WorkEntityDdb | undefined> {
    return this.models.Work.get({ chainId, slug }, { index: "gsi3" });
  }

  getProjectForSg721(
    chainId: string,
    sg721: string
  ): Promise<WorkEntityDdb | undefined> {
    return this.models.Work.get({ chainId, sg721 }, { index: "gsi4" });
  }

  findProjectsForOwner(
    chainId: string,
    ownerId: string
  ): Promise<WorkEntityDdb[]> {
    return this.models.Work.find(
      {
        ownerId,
        chainId,
      },
      { index: "gsi1" }
    );
  }

  private deserializeNext(next: string | undefined): object | undefined {
    let nextObj: object | undefined;
    if (next) {
      try {
        nextObj = JSON.parse(Buffer.from(next, "base64").toString("utf-8"));
      } catch (e) {
        console.log("error parsing next", e);
        throw new Error("error parsing next");
      }
    }
    return nextObj;
  }
  private serializeNext(nextObj: object | undefined): string | undefined {
    let nextStr: string | undefined;
    if (nextObj) {
      nextStr = Buffer.from(JSON.stringify(nextObj)).toString("base64");
    }
    return nextStr;
  }
  async findPublishedWorks({
    chainId,
    hidden,
    limit,
    next,
    order,
  }: {
    chainId: string;
    hidden?: boolean;
    limit?: number;
    next?: string;
    order?: "asc" | "desc";
  }): Promise<{ data: WorkEntityDdb[]; next: string | undefined }> {
    //todo check out the gsi2_pk value see why > is not working

    //this index might not work, because hidden == 1 which is greater than hidden == 0
    // so it will include hidden works
    const globalPublished = await this.models.Work.find(
      {
        chainId,
        hidden: hidden ? 1 : 0,
        gsi2_sk: {
          ">": `startDate:${new Date(0).toISOString()}`,
        },
      },
      {
        reverse: order === "desc",
        index: "gsi2",
        next: this.deserializeNext(next),
        limit: limit ?? 10,
      }
    );

    return {
      data: globalPublished,
      next: this.serializeNext(globalPublished.next),
    };
  }

  async getProjectTokens(
    chainId: string,
    sg721: string,
    {
      limit,
      direction = "asc",
      next,
    }: { limit?: number; direction?: Direction; next?: string } = {}
  ): Promise<{ items: WorkTokenEntityDdb[]; next: string | undefined }> {
    const out = await this.models.WorkToken.find(
      {
        chainId,
        sg721,
      },
      { limit, reverse: direction === "desc", next: this.deserializeNext(next) }
    );
    return {
      items: out,
      next: this.serializeNext(out.next),
    };
  }

  async getProjectTokensWithImageUrl(
    chainId: string,
    sg721: string,
    {
      limit,
      direction = "asc",
      next,
    }: { limit?: number; direction?: Direction; next?: string } = {}
  ): Promise<{ items: WorkTokenEntityDdb[]; next: string | undefined }> {
    const out = await this.models.WorkToken.find(
      {
        chainId,
        sg721,
      },
      {
        limit,
        reverse: direction === "desc",
        next: this.deserializeNext(next),
        where: `attribute_exists(imageUrl)`,
      }
    );
    return {
      items: out,
      next: this.serializeNext(out.next),
    };
  }

  //todo
  // getProjectTokensWithStatus(
  //   chainId: string,
  //   projectId: number,
  //   status: TokenStatuses,
  //   limit?: number,
  // ): Promise<WorkTokenEntityDdb[]> {
  //   return this.models.WorkToken.find(
  //     { chainId, workId: projectId, status: status.toString() },
  //     { index: 'gsi1', limit },
  //   );
  // }

  setTokenFinalMetadata(
    token: Pick<WorkTokenEntityDdb, "chainId" | "workId" | "tokenId">,
    metadata_uri: string
  ): Promise<any> {
    return this.updatePartial(token, { metadataUrl: metadata_uri });
  }

  setTokenImage(
    token: Pick<WorkTokenEntityDdb, "chainId" | "workId" | "tokenId">,
    image_url: string
  ): Promise<WorkTokenEntityDdb> {
    return this.updatePartial(token, { imageUrl: image_url });
  }

  setTokenStatus(
    token: Pick<WorkTokenEntityDdb, "chainId" | "workId" | "tokenId">,
    status: TokenStatuses
  ): Promise<WorkTokenEntityDdb> {
    return this.updatePartial(token, { status: status.toString() });
  }

  async updateWorkPartial(
    work: Pick<WorkEntityDdb, "chainId" | "id">,
    updates: Partial<
      Omit<
        WorkEntityDdb,
        "chainId" | "id" | "created" | "updated" | "slug" | "ownerId"
      >
    >
  ): Promise<WorkEntityDdb> {
    return this.models.Work.update(
      { chainId: work.chainId, id: work.id, ...updates },
      {
        partial: true,
      }
    );
  }
  updatePartial(
    token: Pick<WorkTokenEntityDdb, "chainId" | "workId" | "tokenId">,
    updates: Partial<
      Omit<
        WorkTokenEntityDdb,
        "workId" | "tokenId" | "chainId" | "updated" | "created"
      >
    >
  ): Promise<WorkTokenEntityDdb> {
    return this.models.WorkToken.update(
      {
        chainId: token.chainId,
        tokenId: token.tokenId,
        workId: token.workId,
        ...updates,
      },
      {
        partial: true,
      }
    );
  }

  async createUser(user: Omit<UserEntityDdb, "created" | "updated">) {
    return this.models.User.create(user);
  }

  async createUserWithId(user: UserEntityDdb) {
    return this.models.User.create(user, { timestamps: false });
  }

  setIdCounter(chainId: string, maxId: number) {
    return this.models.IdCounter.upsert({ chainId, count: maxId });
  }

  async createWorkUploadFileMigration(
    workUpload: WorkUploadFileEntityDdb
  ): Promise<WorkUploadFileEntityDdb> {
    return this.models.WorkUploadFile.create(workUpload, { timestamps: false });
  }

  async getFileUploadById(
    uploadId: string
  ): Promise<WorkUploadFileEntityDdb | undefined> {
    return this.models.WorkUploadFile.get({ id: uploadId });
  }

  deleteWork(chainId: string, id: number) {
    return this.models.Work.remove({ chainId, id });
  }

  saveUploadId(
    chainId: string,
    workId: number,
    filename: string
  ): Promise<WorkUploadFileEntityDdb> {
    const id = createId();
    return this.models.WorkUploadFile.create({ chainId, id, filename, workId });
  }
}

export type Direction = "asc" | "desc";

export type WorkEntityDdbCreate = Omit<
  WorkEntityDdb,
  "startDate" | "resolution" | "selector"
>;
