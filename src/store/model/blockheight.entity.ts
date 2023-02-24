import { Column, Entity, PrimaryColumn } from "typeorm";
import { AuditedEntity } from "./audited-entity";

@Entity({ name: "blockheights" })
export class BlockheightEntity extends AuditedEntity {
  @PrimaryColumn()
  id: string;
  @Column("bigint", { name: "height", default: "0" })
  height: string;
  @Column("varchar", { name: "name", unique: true, length: 64 })
  name: string;
}
