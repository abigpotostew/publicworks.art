import { AuditedEntityDDb } from "./WorkEntity.ddb";

export interface WorkUploadFileEntityDdb extends AuditedEntityDDb {
  chainId: string;
  workId: number;
  id: string;
  filename: string;
}
