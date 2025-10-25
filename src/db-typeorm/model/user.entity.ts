import { AuditedEntity } from "./audited-entity";
import { WorkEntity } from "./work.entity";

export class UserEntity extends AuditedEntity {
  id: string;

  address: string;

  name: string;

  ownedWorks: WorkEntity[];
}
