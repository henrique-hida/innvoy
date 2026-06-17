import { DomainEntity } from './domain-entity';

export interface IFacade {
  create(entity: DomainEntity): Promise<DomainEntity>;
  update(entity: DomainEntity): Promise<DomainEntity>;
  deactivate(entity: DomainEntity): Promise<void>;
  findAll(entity: DomainEntity): Promise<DomainEntity[]>;
}
