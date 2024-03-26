import { AuditedEntityDDb } from "./WorkEntity.ddb";

export interface WorkTokenEntityDdb extends AuditedEntityDDb {
  chainId: string;
  sg721: string;
  workId: number;
  tokenId: number;
  hash: string;
  status: string;
  imageUrl?: string | undefined;
  metadataUrl?: string | undefined;
  blockHeight: string;
  txHash: string;
  txMemo?: string | undefined;
  hashInput: string;
}
