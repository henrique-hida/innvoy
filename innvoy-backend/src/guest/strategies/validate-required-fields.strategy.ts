import { BadRequestException, Injectable } from '@nestjs/common';
import { Address } from '../domain/address';
import { Guest } from '../domain/guest';

@Injectable()
export class ValidateRequiredFieldsStrategy {
  validate(guest: Guest): Promise<void> {
    try {
      this.checkPersonalData(guest);
      this.checkAddressData(guest.address);
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }

  private checkPersonalData(guest: Guest): void {
    this.assertFilled(guest.fullName, 'fullName');
    this.assertFilled(guest.cpf, 'cpf');
    this.assertPresent(guest.dateOfBirth, 'dateOfBirth');
    this.assertFilled(guest.phone, 'phone');
    this.assertFilled(guest.email, 'email');
  }

  private checkAddressData(address: Address): void {
    this.assertFilled(address.street, 'address.street');
    this.assertFilled(address.number, 'address.number');
    this.assertFilled(address.zipCode, 'address.zipCode');
    this.assertFilled(address.neighborhood, 'address.neighborhood');
    this.assertFilled(address.complement, 'address.complement');
    this.assertFilled(address.city.name, 'address.city.name');
    this.assertFilled(address.city.state.name, 'address.city.state.name');
    this.assertFilled(
      address.city.state.abbreviation,
      'address.city.state.abbreviation',
    );
  }

  private assertFilled(value: string, field: string): void {
    if (!value || value.trim() === '') {
      throw new BadRequestException(`Field '${field}' is required`);
    }
  }

  private assertPresent(value: unknown, field: string): void {
    if (value === null || value === undefined) {
      throw new BadRequestException(`Field '${field}' is required`);
    }
  }
}
