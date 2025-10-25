export interface AuditedEntityDDb {
  created: Date;
  updated: Date;
}
export interface WorkEntityDdb extends AuditedEntityDDb {
  id: number;
  chainId: string;
  name: string;
  slug: string;
  codeCid?: string | undefined;
  coverImageCid?: string | undefined;
  creator: string;
  hidden: number;
  sg721?: string | undefined;
  minter?: string | undefined;
  description: string;
  descriptionAdditional?: string | undefined;
  blurb: string;
  startDate: Date;
  resolution: string;
  selector: string;
  license?: string | undefined;
  externalLink?: string | undefined;
  pixelRatio: number;
  maxTokens: number;
  priceStars: number;
  royaltyPercent: number;
  royaltyAddress?: string | undefined;
  sg721CodeId?: number | undefined;
  minterCodeId?: number | undefined;
  isDutchAuction: boolean;
  dutchAuctionEndDate?: Date | undefined;
  dutchAuctionEndPrice?: number | undefined;
  dutchAuctionDeclinePeriodSeconds?: number | undefined;
  dutchAuctionDecayRate?: number | undefined;
  ownerId: string;
  ownerAddress: string;
}
