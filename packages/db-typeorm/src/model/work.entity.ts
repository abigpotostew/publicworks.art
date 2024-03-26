import { AuditedEntity } from "./audited-entity";
import { UserEntity } from "./user.entity";

export class WorkEntity extends AuditedEntity {
  id: number;

  codeCid: string;

  coverImageCid: string | null;

  externalLink: string | null;

  name: string;
  creator: string;
  slug: string;
  sg721: string | null;
  minter: string | null;

  description: string;

  additionalDescription: string | null;

  blurb: string;

  startDate: Date | null;

  resolution: string | null;

  selector: string | null;
  license: string | null;

  pixelRatio: number | null;
  maxTokens: number;
  priceStars: number | null;
  royaltyPercent: number | null;
  royaltyAddress: string | null;
  hidden: boolean;
  sg721CodeId: number | null;
  minterCodeId: number | null;

  isDutchAuction: boolean;
  dutchAuctionEndDate: Date | null;
  dutchAuctionEndPrice: number | null;

  dutchAuctionDeclinePeriodSeconds: number | null;

  dutchAuctionDecayRate: number | null;

  tokens: TokenEntity[] | null;
  owner: UserEntity;

  workUploadFiles: WorkUploadFile[] | null;
}

export class TokenEntity extends AuditedEntity {
  id: string;

  hash: string;

  token_id: string;

  status: number;

  hashInput: string;

  imageUrl: string | null;
  metadataUri: string | null;

  work_id: string;

  blockHeight: string;

  txHash: string;
  txMemo: string;

  work: WorkEntity;
}

export class WorkUploadFile extends AuditedEntity {
  id: string;

  filename: string;

  work: WorkEntity;
}
