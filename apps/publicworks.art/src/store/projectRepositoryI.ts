import { TokenEntity, UserEntity, WorkEntity, WorkUploadFile } from "./model";
import { TokenStatuses } from "./types";
import { IndexerStoreI } from "./indexerStoreI";
import { Ok, Result } from "src/util/result";
import { CreateProjectRequest, FullEditProjectRequest } from "./project.types";
import cuid from "cuid";
import { dataSource } from "../typeorm/datasource";
import { convertToSlug } from "./mysql";

export interface ProjectRepositoryI extends IndexerStoreI {
  getAllTokensWithStatus(
    status: TokenStatuses,
    limit?: number
  ): Promise<TokenEntity[]>;

  getProjectTokensWithStatus(
    projectId: string,
    status: TokenStatuses,
    limit?: number
  ): Promise<TokenEntity[]>;

  /**
   * @deprecated
   * @param projectId
   * @param limit
   */
  getProjectTokens(projectId: string, limit?: number): Promise<TokenEntity[]>;

  getProjectForSg721(sg721: string): Promise<WorkEntity | null>;

  getProjectForId(id: string): Promise<WorkEntity | null>;
  getProject(id: string | number): Promise<WorkEntity | null>;

  getProjectAndTokenById(
    projectId: string,
    tokenId: string
  ): Promise<{ project: WorkEntity; token: TokenEntity } | null>;

  setTokenStatus(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    status: TokenStatuses
  ): Promise<void>;

  updatePartial(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    updates: Partial<TokenEntity>
  ): Promise<void>;

  setTokenImage(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    image_url: string
  ): Promise<any>;

  setTokenFinalMetadata(
    work: Pick<WorkEntity, "id">,
    token: TokenEntity,
    metadata_uri: string
  ): Promise<any>;

  getFinalizingTokens(): Promise<TokenEntity[]>;

  getProjectPreviewImage(id: string): Promise<TokenEntity | null>;

  getProjects({
    limit,
    offset,
    publishedState,
    includeHidden,
    order,
  }: {
    limit: number;
    offset?: string | number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState?: string | null;
    includeHidden: boolean;
    order?: "desc" | "asc";
  }): Promise<{ items: WorkEntity[]; nextOffset: string | undefined }>;

  getProjectTokens2({
    workId,
    limit,
    offset,
    publishedState,
  }: {
    workId: number;
    limit: number;
    offset?: string | number | undefined;
    // "PUBLISHED" | "UNPUBLISHED" | "ALL"
    publishedState: "PUBLISHED" | "UNPUBLISHED" | "ALL" | null;
  }): Promise<{
    items: TokenEntity[];
    nextOffset: string | undefined;
  }>;

  getToken({
    workId,
    tokenId,
  }: {
    workId: number;
    tokenId: string;
  }): Promise<TokenEntity | null>;
  getAccountProjects({
    address,
    limit,
    offset,
    publishedState,
    direction,
  }: {
    address: string;
    limit: number;
    offset?: string | number | undefined;
    publishedState?: string | null;
    direction: "ASC" | "DESC";
  }): Promise<{ items: WorkEntity[]; nextOffset: string | undefined }>;

  getTokenCount(slug: string): Promise<number>;

  lastMintedToken(slug: string): Promise<TokenEntity | null>;

  getProjectBySlug(slug: string): Promise<WorkEntity | null>;

  getFileUploadById(
    uploadId: string,
    work: WorkEntity
  ): Promise<WorkUploadFile | null>;

  updateProject(
    id: number,
    request: Partial<FullEditProjectRequest> &
      Required<Pick<FullEditProjectRequest, "hidden" | "startDate">>
  ): Promise<Result<WorkEntity>>;
  deleteWork({ id }: { id: number }): Promise<boolean>;

  saveUploadId(work: WorkEntity, filename: string): Promise<WorkUploadFile>;

  createProject(
    owner: UserEntity,
    request: CreateProjectRequest
  ): Promise<Result<WorkEntity>>;
}
