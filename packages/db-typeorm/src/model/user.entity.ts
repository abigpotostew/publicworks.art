import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AuditedEntity } from "./audited-entity";
import { WorkEntity } from "./work.entity";

@Entity({ name: "users" })
export class UserEntity extends AuditedEntity {
  @PrimaryColumn()
  id: string;

  @Column("text", { name: "address" })
  address: string;

  @Column("text", { name: "name" })
  name: string;

  @OneToMany(() => WorkEntity, (r) => r.owner)
  ownedWorks: WorkEntity[];
}
