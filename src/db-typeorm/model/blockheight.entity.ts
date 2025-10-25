import { AuditedEntity } from "./audited-entity";

export class BlockheightEntity extends AuditedEntity {
  id: string;
  height: string;
  name: string;
}
