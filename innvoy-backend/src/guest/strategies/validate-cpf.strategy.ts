import { BadRequestException, Injectable } from '@nestjs/common';
import { GuestDAO } from '../guest.dao';
import { Guest } from '../domain/guest';
import { IStrategy } from '../../core/istrategy';

@Injectable()
export class ValidateCPFStrategy implements IStrategy {
  constructor(private readonly dao: GuestDAO) {}

  async proccess(guest: Guest): Promise<void> {
    const digits = guest.cpf.replace(/\D/g, '');

    if (digits.length !== 11) {
      throw new BadRequestException('Invalid CPF format');
    }

    if (/^(\d)\1{10}$/.test(digits)) {
      throw new BadRequestException('Invalid CPF');
    }

    if (!this.hasValidCheckDigits(digits)) {
      throw new BadRequestException('Invalid CPF');
    }

    await this.assertUnique(digits, guest.id);
  }

  private hasValidCheckDigits(digits: string): boolean {
    return (
      this.calcDigit(digits, 9) === Number(digits[9]) &&
      this.calcDigit(digits, 10) === Number(digits[10])
    );
  }

  private calcDigit(digits: string, length: number): number {
    const sum = digits
      .slice(0, length)
      .split('')
      .reduce((acc, d, i) => acc + Number(d) * (length + 1 - i), 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private async assertUnique(
    cpf: string,
    guestId: number | undefined,
  ): Promise<void> {
    const existing = await this.dao.findByCPF(cpf);
    if (existing && existing.id !== guestId) {
      throw new BadRequestException('CPF already registered');
    }
  }
}
