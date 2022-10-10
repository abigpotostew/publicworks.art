import { Err, Ok, Result } from "../util/result";
import { User } from "./user.types";
import { CreateProjectRequest, EditProjectRequest } from "./project.types";
import { dataSource } from "../typeorm/datasource";
import { TokenEntity, UserEntity, WorkEntity } from "../model";
import { IsNull, Not } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

export class ProjectRepo {
  async getProjectPreviewImage(id: string): Promise<TokenEntity | null> {
    const res = await dataSource()
      .getRepository(TokenEntity)
      .findOne({
        where: {
          work: {
            id,
          },
          image_url: Not(IsNull()),
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
  }: {
    limit: number;
    offset?: number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: string | null;
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
        where,
        take: limit + 1,
        skip: offset,
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
  async getProject(id: string): Promise<WorkEntity | null> {
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
    return dataSource().getRepository(WorkEntity).findOne({
      where: {
        slug,
      },
    });
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
      maxTokens: request.projectSize || 0,
      name: request.projectName,
      priceStars: 1,
      sg721: null,
      minter: null,
      description: request.projectDescription || "",
      slug: convertToSlug(request.projectName),
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

  async updateProject(
    user: User,
    request: Partial<EditProjectRequest>
  ): Promise<Result<WorkEntity>> {
    if (!request.id) {
      return Err(new Error("missing project_id"));
    }

    let toUpdate: Partial<WorkEntity> = new WorkEntity();
    toUpdate = {
      name: request.projectName,
      blurb: request.projectBlurb,
      maxTokens: request.projectSize,
      description: request.projectDescription,
      royaltyPercent: request.royaltyPercent,
      royaltyAddress: request.royaltyAddress,
      startDate: request.startDate ? new Date(request.startDate) : undefined,
      codeCid: request.codeCid,

      selector: request.selector,
      resolution: request.resolution,
      pixelRatio: request.pixelRatio,
      priceStars: request.priceStars,
      license: request.license,

      coverImageCid: request.coverImageCid,

      sg721: request.sg721,
      minter: request.minter,
    };

    const res = await dataSource().getRepository(WorkEntity).update(
      {
        id: request.id,
      },
      toUpdate
    );
    const work = await this.getProject(request.id);
    if (!work) {
      throw new Error("work not found");
    }
    return Ok(work);
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
