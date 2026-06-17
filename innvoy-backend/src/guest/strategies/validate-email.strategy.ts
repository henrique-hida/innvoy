import { BadRequestException, Injectable } from '@nestjs/common';
import { Guest } from '../domain/guest';
import { GuestDAO } from '../guest.dao';
import { IStrategy } from '../../core/istrategy';

const EMAIL_REGEX = /^[^\s@]+@(?!.*\.\.)[^\s@]+\.[^\s@]+$/;

@Injectable()
export class ValidateEmailStrategy implements IStrategy {
  constructor(private readonly dao: GuestDAO) {}

  async proccess(guest: Guest): Promise<void> {
    if (!EMAIL_REGEX.test(guest.email)) {
      throw new BadRequestException('Invalid email format');
    }

    await this.assertUnique(guest.email, guest.id);
  }

  private async assertUnique(
    email: string,
    guestId: number | undefined,
  ): Promise<void> {
    const existing = await this.dao.findByEmail(email);
    if (existing && existing.id !== guestId) {
      throw new BadRequestException('Email already registered');
    }
  }
}
