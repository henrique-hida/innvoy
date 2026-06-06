import { BadRequestException, Injectable } from '@nestjs/common';
import { Guest } from '../domain/guest';

const EMAIL_REGEX = /^[^\s@]+@(?!.*\.\.)[^\s@]+\.[^\s@]+$/;

@Injectable()
export class ValidateEmailStrategy {
  validate(guest: Guest): Promise<void> {
    try {
      if (!EMAIL_REGEX.test(guest.email)) {
        throw new BadRequestException('Invalid email format');
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }
}
