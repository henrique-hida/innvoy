import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class DomainEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  active!: boolean;
}
