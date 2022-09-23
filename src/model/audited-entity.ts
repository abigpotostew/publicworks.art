import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditedEntity {
  @CreateDateColumn({ default: () => "now()", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ default: () => "now()", name: "updated_date" })
  updatedDate: Date;
}
