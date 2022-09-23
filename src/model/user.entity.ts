import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuditedEntity } from "./audited-entity";

@Entity({ name: "users" })
export class UserEntity extends AuditedEntity {
  @PrimaryColumn()
  id: string;

  @Column("text", { name: "address" })
  address: string;

  @Column("text", { name: "name" })
  name: string;
}
