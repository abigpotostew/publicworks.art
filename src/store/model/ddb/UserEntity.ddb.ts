import { AuditedEntityDDb } from "./WorkEntity.ddb";

export interface UserEntityDdb extends AuditedEntityDDb {
  chainId: string;
  id: string;
  address: string;
}
