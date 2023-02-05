import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { AuditedEntity } from "./audited-entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "works" })
export class WorkEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text", { name: "code_cid" })
  codeCid: string;

  @Column("text", { name: "cover_image_cid", nullable: true })
  coverImageCid: string | null;

  @Column("text", { name: "external_link", nullable: true })
  externalLink: string | null;

  @Column("text", { name: "name" })
  name: string;
  @Column("text", { name: "creator" })
  creator: string;
  @Column("varchar", { name: "slug", unique: true, length: 64 })
  slug: string;
  @Column("varchar", { name: "sg721", length: 64, nullable: true })
  sg721: string | null;
  @Column("varchar", { name: "minter", length: 64, nullable: true })
  minter: string | null;

  @Column("text", { name: "description", default: "" })
  description: string;

  @Column("text", { name: "description_additional" })
  additionalDescription: string | null;

  @Column("text", { name: "blurb", default: "" })
  blurb: string;

  @Column("datetime", { name: "start_date", nullable: true })
  startDate: Date | null;

  @Column("varchar", { name: "resolution", nullable: true, length: 64 })
  resolution: string | null;

  @Column("text", { name: "selector", nullable: true })
  selector: string | null;
  @Column("text", { name: "license", nullable: true })
  license: string | null;

  @Column("float", { name: "pixel_ratio", nullable: true })
  pixelRatio: number | null;
  @Column("int", { name: "max_tokens", default: 0 })
  maxTokens: number;
  @Column("double", { name: "price_stars", nullable: true })
  priceStars: number | null;
  @Column("double", { name: "royalty_percent", nullable: true })
  royaltyPercent: number | null;
  @Column("text", { name: "royalty_address", nullable: true })
  royaltyAddress: string | null;
  @Column("boolean", { name: "hidden" })
  hidden: boolean;

  @OneToMany(() => TokenEntity, (r) => r.work)
  tokens: Relation<TokenEntity>[] | null;
  @ManyToOne(() => UserEntity, (r) => r.ownedWorks)
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @OneToMany(() => WorkUploadFile, (r) => r.work)
  workUploadFiles: Relation<WorkUploadFile>[] | null;
}

@Entity({ name: "work_tokens" })
export class TokenEntity extends AuditedEntity {
  @PrimaryColumn() //cuid
  id: string;

  @Column("varchar", { name: "hash", length: 64, nullable: false })
  hash: string;

  @Column("varchar", { name: "token_id", length: 64 })
  token_id: string;

  @Column("int", { name: "status" })
  status: number;

  @Column("text", { name: "image_url", nullable: true })
  imageUrl: string | null;
  @Column("text", { name: "metadata_uri", nullable: true })
  metadataUri: string | null;

  @ManyToOne(() => WorkEntity, (r) => r.tokens)
  @JoinColumn({ name: "work_id" })
  work: WorkEntity;
}

@Entity({ name: "work_upload_files" })
export class WorkUploadFile extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("varchar", { name: "filename", length: 256 })
  filename: string;

  @ManyToOne(() => WorkEntity, (r) => r.workUploadFiles)
  @JoinColumn({ name: "work_id" })
  work: WorkEntity;
}
