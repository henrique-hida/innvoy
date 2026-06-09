import { DomainEntity } from './domain-entity';

export interface IDAO {
  save(entity: DomainEntity): Promise<DomainEntity>;

  update(entity: DomainEntity): Promise<DomainEntity>;

  deactivate(id: number): Promise<void>;

  findAll(filters: Partial<DomainEntity>): Promise<DomainEntity[]>;
}
