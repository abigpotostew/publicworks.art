import { Ok, Result } from "../util/result";
import { CreateProjectRequest, FullEditProjectRequest } from "./project.types";
import { dataSource } from "../typeorm/datasource";
import { TokenEntity, UserEntity, WorkEntity, WorkUploadFile } from "./model";
import { IsNull, Not } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import cuid from "cuid";

export class ProjectRepo {
  async getProjectPreviewImage(id: number): Promise<TokenEntity | null> {
    const res = await dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          work: {
            id,
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
    offset?: number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
    includeHidden: boolean;
    order?: "desc" | "asc";
  }): Promise<{ items: WorkEntity[]; nextOffset: number | undefined }> {
    order = order || "desc";
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
      nextOffset,
    };
  }

  async getTokens({
    limit,
    offset,
    publishedState = "PUBLISHED",
    includeHidden,
  }: {
    limit: number;
    offset?: number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
    includeHidden: boolean;
  }): Promise<{ items: TokenEntity[]; nextOffset: number | undefined }> {
    offset = offset || 0;
    const where:
      | FindOptionsWhere<TokenEntity>[]
      | FindOptionsWhere<TokenEntity> = {};

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
      nextOffset,
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
    offset?: number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
    direction: "ASC" | "DESC";
  }): Promise<{ items: WorkEntity[]; nextOffset: number | undefined }> {
    offset = offset || 0;
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
      nextOffset,
    };
  }

  async getProject(id: number): Promise<WorkEntity | null> {
    return dataSource()
      .getRepository(WorkEntity)
      .findOne({
        where: {
          id: id,
        },
        relations: ["owner"],
      });
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
    request: Partial<FullEditProjectRequest>
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
      startDate: request.startDate ? new Date(request.startDate) : undefined,
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
        : undefined,
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
    item.id = cuid();
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
