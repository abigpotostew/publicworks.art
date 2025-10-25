import { AuditedEntityDDb } from "./WorkEntity.ddb";

export interface BlockheightEntityDdb extends AuditedEntityDDb {
  id: string;
  height: number;
}
