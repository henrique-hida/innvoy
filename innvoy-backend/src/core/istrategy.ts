import { DomainEntity } from './domain-entity';

export interface IStrategy {
  proccess(entity: DomainEntity): Promise<void>;
}
