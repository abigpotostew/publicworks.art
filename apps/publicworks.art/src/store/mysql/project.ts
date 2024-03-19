import { Ok, Result } from "../../util/result";
import { CreateProjectRequest, FullEditProjectRequest } from "../project.types";
import { dataSource } from "../../typeorm/datasource";
import {
  BlockheightEntity,
  TokenEntity,
  UserEntity,
  WorkEntity,
  WorkUploadFile,
} from "../model";
import { IsNull, Not } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import cuid from "cuid";
import { ProjectRepositoryI } from "../projectRepositoryI";
import { TokenStatuses } from "../types";
import { createId } from "../uuid";

export class ProjectRepo implements ProjectRepositoryI {
  async getProjectPreviewImage(id: string): Promise<TokenEntity | null> {
    const res = await dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          work: {
            id: parseInt(id),
          },
          imageUrl: Not(IsNull()),
        },
        order: {
          token_id: "asc", //todo find a better order using mint block height??
        },
      });
    return res;
  }

  async getProjects({
    limit,
    offset,
    publishedState = "PUBLISHED",
    includeHidden,
    order,
  }: {
    limit: number;
    offset?: string | number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
    includeHidden: boolean;
    order?: "desc" | "asc";
  }): Promise<{ items: WorkEntity[]; nextOffset: string | undefined }> {
    order = order || "desc";
    if (typeof offset === "string") {
      offset = parseInt(offset);
    }
    offset = offset || 0;
    const where: FindOptionsWhere<WorkEntity>[] | FindOptionsWhere<WorkEntity> =
      {};
    if (!includeHidden) {
      where.hidden = false;
    }
    if (publishedState === "PUBLISHED") {
      where.sg721 = Not(IsNull());
    } else if (publishedState === "UNPUBLISHED") {
      where.sg721 = IsNull();
    }
    const items = await dataSource()
      .getRepository(WorkEntity)
      .find({
        where,
        take: limit + 1,
        skip: offset,
        relations: ["owner"],
        order: {
          createdDate: order,
        },
      });
    let nextOffset: typeof offset | undefined = undefined;
    if (items.length > limit) {
      items.pop();
      nextOffset = offset + limit;
    }
    return {
      items,
      nextOffset: nextOffset?.toString(),
    };
  }

  async getProjectTokens2({
    workId,
    limit,
    offset,
    publishedState = "PUBLISHED",
  }: {
    workId: number;
    limit: number;
    offset?: string | number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
  }): Promise<{ items: TokenEntity[]; nextOffset: string | undefined }> {
    offset =
      typeof offset === "undefined" ? 0 : parseInt(offset.toString()) || 0;
    const where:
      | FindOptionsWhere<TokenEntity>[]
      | FindOptionsWhere<TokenEntity> = {
      work_id: workId.toString(),
    };

    if (publishedState === "PUBLISHED") {
      where.work = { sg721: Not(IsNull()) };
    } else if (publishedState === "UNPUBLISHED") {
      where.work = { sg721: IsNull() };
    }
    const items = await dataSource()
      .getRepository(TokenEntity)
      .find({
        where,
        take: limit + 1,
        skip: offset,
        relations: ["work", "work.owner"],
      });
    let nextOffset: typeof offset | undefined = undefined;
    if (items.length > limit) {
      items.pop();
      nextOffset = offset + limit;
    }
    return {
      items,
      nextOffset: nextOffset?.toString(),
    };
  }

  async getToken({
    workId,
    tokenId,
  }: {
    workId: number;
    tokenId: string;
  }): Promise<TokenEntity | null> {
    const item = await dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          work: { id: workId },
          token_id: tokenId,
        },
      });
    return item;
  }

  async getAccountProjects({
    address,
    limit,
    offset,
    publishedState = "PUBLISHED",
    direction = "DESC",
  }: {
    address: string;
    limit: number;
    offset?: string | number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
    direction: "ASC" | "DESC";
  }): Promise<{ items: WorkEntity[]; nextOffset: string | undefined }> {
    offset = parseInt(offset?.toString() ?? "0") || 0;
    const where: FindOptionsWhere<WorkEntity>[] | FindOptionsWhere<WorkEntity> =
      {};
    if (publishedState === "PUBLISHED") {
      where.sg721 = Not(IsNull());
    } else if (publishedState === "UNPUBLISHED") {
      where.sg721 = IsNull();
    }
    const items = await dataSource()
      .getRepository(WorkEntity)
      .find({
        where: { ...where, owner: { address: address } },
        take: limit + 1,
        skip: offset,
        order: {
          createdDate: direction,
        },
      });
    let nextOffset: typeof offset | undefined = undefined;
    if (items.length > limit) {
      items.pop();
      nextOffset = offset + limit;
    }
    return {
      items,
      nextOffset: nextOffset?.toString(),
    };
  }

  async getProjectBySlug(slug: string): Promise<WorkEntity | null> {
    return dataSource()
      .getRepository(WorkEntity)
      .findOne({
        where: {
          slug,
        },
        relations: ["owner"],
      });
  }

  async getTokenCount(slug: string): Promise<number> {
    return dataSource()
      .getRepository(TokenEntity)
      .createQueryBuilder("tokens")
      .leftJoin("tokens.work", "work")
      .where("work.slug = :slug", { slug })
      .getCount();
  }

  async lastMintedToken(slug: string): Promise<TokenEntity | null> {
    return dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          work: {
            slug,
          },
        },
        order: {
          createdDate: "DESC",
        },
      });
    // return dataSource()
    //   .getRepository(TokenEntity)
    //   .createQueryBuilder("tokens")
    //   .leftJoin("tokens.work", "work")
    //   .where("work.slug = :slug", { slug })
    //   .orderBy("tokens.createdDate", "DESC")
    //   .take(1);
  }

  async createProject(
    owner: UserEntity,
    request: CreateProjectRequest
  ): Promise<Result<WorkEntity>> {
    let work = new WorkEntity();
    work = {
      ...work,
      ...request,
      codeCid: "",
      creator: owner.address,
      maxTokens: request.maxTokens || 0,
      name: request.name,
      priceStars: 1,
      sg721: null,
      minter: null,
      description: request.description || "",
      blurb: request.blurb || "",
      slug: convertToSlug(request.name),
      pixelRatio: null,
      selector: null,
      resolution: null,
      license: null,
      startDate: request.startDate ? new Date(request.startDate) : null,
      owner,
    };
    work = await dataSource().getRepository(WorkEntity).save(work);
    return Ok(work);
  }

  async deleteWorkTokens(id: number): Promise<Result<number>> {
    const result = await dataSource().getRepository(TokenEntity).delete({
      work: {
        id,
      },
    });
    return Ok(result.affected ?? 0);
  }

  async updateProject(
    id: number,
    request: Partial<FullEditProjectRequest> &
      Pick<FullEditProjectRequest, "hidden" | "startDate">
  ): Promise<Result<WorkEntity>> {
    let toUpdate: Partial<WorkEntity> = new WorkEntity();
    toUpdate = {
      name: request.name,
      blurb: request.blurb,
      maxTokens: request.maxTokens,
      description: request.description,
      additionalDescription: request.additionalDescription,
      creator: request.creator,
      royaltyPercent: request.royaltyPercent,
      royaltyAddress: request.royaltyAddress,
      startDate: request.startDate ? new Date(request.startDate) : null,
      codeCid: request.codeCid,
      externalLink: request.externalLink,
      hidden: request.hidden,

      selector: request.selector,
      resolution: request.resolution,
      pixelRatio: request.pixelRatio,
      priceStars: request.priceStars,
      license: request.license,

      coverImageCid: request.coverImageCid,

      sg721: request.sg721,
      minter: request.minter,
      sg721CodeId: request.sg721CodeId,
      minterCodeId: request.minterCodeId,

      isDutchAuction: request.isDutchAuction,
      dutchAuctionEndDate: request.dutchAuctionEndDate
        ? new Date(request.dutchAuctionEndDate)
        : null,
      dutchAuctionEndPrice: request.dutchAuctionEndPrice,
      dutchAuctionDecayRate: request.dutchAuctionDecayRate,
      dutchAuctionDeclinePeriodSeconds:
        request.dutchAuctionDeclinePeriodSeconds,
    };

    const result = await dataSource().getRepository(WorkEntity).update(
      {
        id,
      },
      toUpdate
    );

    const work = await this.getProject(id);
    if (!work) {
      throw new Error("work not found");
    }
    return Ok(work);
  }

  async deleteWork({ id }: { id: number }): Promise<boolean> {
    const result = await dataSource().getRepository(WorkEntity).delete({
      id,
    });
    return !!result.affected;
  }

  async saveUploadId(work: WorkEntity, filename: string) {
    //WorkUploadFile
    const item = new WorkUploadFile();
    item.id = createId();
    item.work = work;
    item.filename = filename;
    return await dataSource().getRepository(WorkUploadFile).save(item);
  }

  async getLastFileUpload(work: WorkEntity) {
    return dataSource()
      .getRepository(WorkUploadFile)
      .findOne({
        where: {
          work: {
            id: work.id,
          },
        },
        order: {
          createdDate: "desc",
        },
      });
  }

  async getFileUploadById(id: string, work: WorkEntity) {
    return dataSource()
      .getRepository(WorkUploadFile)
      .findOne({
        where: {
          id,
          work: {
            id: work.id,
          },
        },
      });
  }

  async listTokens({
    work_id,
    take,
    skip,
  }: {
    work_id: string;
    take: number;
    skip: number;
  }): Promise<{ tokens: TokenEntity[]; count: number }> {
    const [tokens, count] = await dataSource()
      .getRepository(TokenEntity)
      .findAndCount({
        where: {
          work_id,
        },
        order: {
          token_id: "ASC",
        },
        take,
        skip,
      });
    return { tokens, count };
  }

  async createWorkToken(token: TokenEntity, sg721: string): Promise<boolean> {
    //todo
    return true;
  }

  getAllTokensWithStatus(
    status: TokenStatuses,
    limit?: number
  ): Promise<TokenEntity[]> {
    return Promise.resolve([]);
  }

  getFinalizingTokens(): Promise<TokenEntity[]> {
    return Promise.resolve([]);
  }

  async getLastSweptHeight() {
    const pollHeight = await dataSource()
      .getRepository(BlockheightEntity)
      .findOne({
        where: {
          name: "last_swept_height",
        },
      });
    return pollHeight
      ? { height: BigInt(pollHeight.height), updatedAt: pollHeight.updatedDate }
      : { height: BigInt(0), updatedAt: new Date(0) };
  }

  async getProjectAndTokenById(
    projectId: string,
    tokenId: string
  ): Promise<{ project: WorkEntity; token: TokenEntity } | null> {
    const res = await dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          token_id: tokenId,
          work: {
            id: parseInt(projectId),
          },
        },
        relations: ["work"],
        select: {
          id: true,
          createdDate: true,
          hash: true,
          token_id: true,
          status: true,
          imageUrl: true,
          metadataUri: true,
          blockHeight: true,
          txHash: true,
          txMemo: true,
          hashInput: true,
          work: {
            id: true,
            name: true,
            codeCid: true,
            creator: true,
            description: true,
            resolution: true,
            selector: true,
            pixelRatio: true,
            license: true,
            royaltyAddress: true,
            sg721CodeId: true,
            minterCodeId: true,
            sg721: true,
            minter: true,
            slug: true,
            blurb: true,
            externalLink: true,
            maxTokens: true,
            priceStars: true,
          },
        },
      });
    if (!res) {
      return null;
    }
    return { project: res.work, token: res };
  }

  async getProjectForId(id: string): Promise<WorkEntity | null> {
    const work = await dataSource()
      .getRepository(WorkEntity)
      .findOne({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          name: true,
          creator: true,
          description: true,
          resolution: true,
          selector: true,
          pixelRatio: true,
          license: true,
          royaltyAddress: true,
          sg721CodeId: true,
          minterCodeId: true,
          sg721: true,
          minter: true,
        },
      });
    return work;
  }

  async getProjectForSg721(sg721: string): Promise<WorkEntity | null> {
    const work = await dataSource()
      .getRepository(WorkEntity)
      .findOne({
        where: {
          sg721,
        },
        select: {
          id: true,
          name: true,
          creator: true,
          description: true,
          resolution: true,
          selector: true,
          pixelRatio: true,
          license: true,
          royaltyAddress: true,
          sg721CodeId: true,
          minterCodeId: true,
          sg721: true,
          minter: true,
        },
      });
    return work;
  }

  getProjectTokens(projectId: string, limit?: number): Promise<TokenEntity[]> {
    return Promise.resolve([]);
  }

  async getProjectTokensWithStatus(
    projectId: string,
    status: TokenStatuses,
    limit?: number
  ): Promise<TokenEntity[]> {
    const out = await dataSource()
      .getRepository(TokenEntity)
      .find({
        where: {
          status: status,
          work: {
            id: parseInt(projectId),
            sg721: Not(IsNull()),
          },
        },
        take: limit || 100,
        order: {
          createdDate: "ASC",
        },
        relations: ["work"],
        select: {
          id: true,
          createdDate: true,
          hash: true,
          token_id: true,
          status: true,
          imageUrl: true,
          metadataUri: true,
          blockHeight: true,
          txHash: true,
          txMemo: true,
          hashInput: true,
          work: {
            id: true,
            name: true,
            creator: true,
            description: true,
            resolution: true,
            selector: true,
            pixelRatio: true,
            license: true,
            royaltyAddress: true,
            sg721CodeId: true,
            minterCodeId: true,
            sg721: true,
            minter: true,
          },
        },
      });
    return out;
  }

  async setCurrentPollHeightHeight(height: bigint): Promise<void> {
    return;
  }

  async setLastSweptHeight(height: bigint) {
    const pollHeight = await dataSource()
      .getRepository(BlockheightEntity)
      .findOne({
        where: {
          name: "last_swept_height",
        },
      });
    if (!pollHeight) {
      await dataSource().getRepository(BlockheightEntity).insert({
        name: "last_swept_height",
        height: height.toString(),
        id: createId(),
      });
    } else {
      //update
      await dataSource().getRepository(BlockheightEntity).save({
        id: pollHeight.id,
        height: height.toString(),
        updatedDate: new Date(),
      });
    }
  }

  async setTokenFinalMetadata(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    metadata_uri: string
  ) {
    return this.updatePartial(work, token, { metadataUri: metadata_uri });
  }

  async setTokenImage(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    image_url: string
  ) {
    return this.updatePartial(work, token, { imageUrl: image_url });
  }

  async setTokenStatus(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    status: TokenStatuses
  ) {
    return this.updatePartial(work, token, { status });
  }

  async updatePartial(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    updates: Partial<TokenEntity>
  ) {
    const res = await dataSource().getRepository(TokenEntity).update(
      {
        id: token.id,
      },
      updates
    );
    if (!res.affected || res.affected === 0) {
      throw new Error("token not found");
    }
  }

  getProject(id: string | number): Promise<WorkEntity | null> {
    //todo this should join the work owner as well
    return this.getProjectForId(id.toString());
  }
}

export function convertToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}
