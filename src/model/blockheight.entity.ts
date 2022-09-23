import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blockheights' })
export class BlockheightEntity {
  @PrimaryColumn()
  id: string;
  @Column('bigint', { name: 'height', default: '0' })
  height: string;
  @Column('varchar', { name: 'name', unique: true, length:64 })
  name: string;
}
