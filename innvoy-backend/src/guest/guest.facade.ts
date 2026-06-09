import { Injectable } from '@nestjs/common';
import { GuestDAO } from './guest.dao';
import { Guest } from './domain/guest';
import { ValidateCPFStrategy } from './strategies/validate-cpf.strategy';
import { ValidateEmailStrategy } from './strategies/validate-email.strategy';
import { ValidateRequiredFieldsStrategy } from './strategies/validate-required-fields.strategy';
import { IFacade } from '../core/ifacade';

@Injectable()
export class GuestFacade implements IFacade {
  constructor(
    private readonly validateRequired: ValidateRequiredFieldsStrategy,
    private readonly validateCPF: ValidateCPFStrategy,
    private readonly validateEmail: ValidateEmailStrategy,
    private readonly dao: GuestDAO,
  ) {}

  async create(guest: Guest): Promise<Guest> {
    guest.cpf = guest.cpf.replace(/\D/g, '');
    await this.validateRequired.proccess(guest);
    await this.validateCPF.proccess(guest);
    await this.validateEmail.proccess(guest);
    return this.dao.save(guest);
  }

  async update(guest: Guest): Promise<Guest> {
    guest.cpf = guest.cpf.replace(/\D/g, '');
    await this.validateRequired.proccess(guest);
    await this.validateEmail.proccess(guest);
    return this.dao.update(guest);
  }

  async deactivate(id: number): Promise<void> {
    await this.dao.deactivate(id);
  }

  async findAll(filters: Partial<Guest>): Promise<Guest[]> {
    return this.dao.findAll(filters);
  }
}
