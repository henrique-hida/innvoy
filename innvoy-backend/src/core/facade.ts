import { Injectable } from '@nestjs/common';
import { IFacade } from './ifacade';
import { IDAO } from './idao';
import { IStrategy } from './istrategy';
import { DomainEntity } from './domain-entity';
import { Guest } from '../guest/domain/guest';
import { GuestDAO } from '../guest/guest.dao';
import { ValidateRequiredFieldsStrategy } from '../guest/strategies/validate-required-fields.strategy';
import { ValidateCPFStrategy } from '../guest/strategies/validate-cpf.strategy';
import { ValidateEmailStrategy } from '../guest/strategies/validate-email.strategy';

type Operation = 'create' | 'update';

@Injectable()
export class Facade implements IFacade {
  private strategies = new Map<string, Map<Operation, IStrategy[]>>();
  private daos = new Map<string, IDAO>();

  constructor(
    guestDAO: GuestDAO,
    validateRequired: ValidateRequiredFieldsStrategy,
    validateCPF: ValidateCPFStrategy,
    validateEmail: ValidateEmailStrategy,
  ) {
    this.daos.set(Guest.name, guestDAO);

    const guestStrategies = new Map<Operation, IStrategy[]>();
    guestStrategies.set('create', [
      validateRequired,
      validateCPF,
      validateEmail,
    ]);
    guestStrategies.set('update', [validateRequired, validateEmail]);
    this.strategies.set(Guest.name, guestStrategies);
  }

  async create(entity: DomainEntity): Promise<DomainEntity> {
    this.normalize(entity);
    await this.runStrategies(entity, 'create');
    return this.getDAO(entity).save(entity);
  }

  async update(entity: DomainEntity): Promise<DomainEntity> {
    this.normalize(entity);
    await this.runStrategies(entity, 'update');
    return this.getDAO(entity).update(entity);
  }

  async deactivate(entity: DomainEntity): Promise<void> {
    await this.getDAO(entity).deactivate(entity.id!);
  }

  async findAll(entity: DomainEntity): Promise<DomainEntity[]> {
    return this.getDAO(entity).findAll(entity);
  }

  private getDAO(entity: DomainEntity): IDAO {
    const type = entity.constructor.name;
    const dao = this.daos.get(type);
    if (!dao) {
      throw new Error(`No DAO registered for entity type: ${type}`);
    }
    return dao;
  }

  private async runStrategies(
    entity: DomainEntity,
    operation: Operation,
  ): Promise<void> {
    const strategies = this.getStrategies(entity, operation);
    for (const strategy of strategies) {
      await strategy.proccess(entity);
    }
  }

  private getStrategies(
    entity: DomainEntity,
    operation: Operation,
  ): IStrategy[] {
    return this.strategies.get(entity.constructor.name)?.get(operation) ?? [];
  }

  private normalize(entity: DomainEntity): void {
    if (entity instanceof Guest) {
      entity.cpf = entity.cpf.replace(/\D/g, '');
    }
  }
}
