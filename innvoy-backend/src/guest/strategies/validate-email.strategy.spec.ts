import { BadRequestException } from '@nestjs/common';
import { ValidateEmailStrategy } from './validate-email.strategy';
import { Guest } from '../domain/guest';

const makeGuest = (email: string): Guest => ({
  id: 1,
  fullName: 'João da Silva',
  cpf: '529.982.247-25',
  dateOfBirth: new Date('1990-01-15'),
  phone: '(11) 99999-9999',
  email,
  active: true,
  address: {
    street: 'Rua das Flores',
    number: '123',
    zipCode: '01310-100',
    neighborhood: 'Centro',
    complement: 'Apto 4',
    city: {
      name: 'São Paulo',
      state: { name: 'São Paulo', abbreviation: 'SP' },
    },
  },
});

describe('ValidateEmailStrategy', () => {
  let strategy: ValidateEmailStrategy;

  beforeEach(() => {
    strategy = new ValidateEmailStrategy();
  });

  describe('valid emails', () => {
    it('should pass with a simple valid email', async () => {
      await expect(
        strategy.proccess(makeGuest('joao@example.com')),
      ).resolves.not.toThrow();
    });

    it('should pass with a subdomain email', async () => {
      await expect(
        strategy.proccess(makeGuest('joao@mail.example.com.br')),
      ).resolves.not.toThrow();
    });

    it('should pass with plus addressing', async () => {
      await expect(
        strategy.proccess(makeGuest('joao+hotel@example.com')),
      ).resolves.not.toThrow();
    });
  });

  describe('invalid emails', () => {
    it('should throw when email has no @ symbol', async () => {
      await expect(
        strategy.proccess(makeGuest('joaoexample.com')),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email has no domain', async () => {
      await expect(strategy.proccess(makeGuest('joao@'))).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when email has no local part', async () => {
      await expect(
        strategy.proccess(makeGuest('@example.com')),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email has no TLD', async () => {
      await expect(
        strategy.proccess(makeGuest('joao@example')),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email has consecutive dots in domain', async () => {
      await expect(
        strategy.proccess(makeGuest('joao@example..com')),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email is an empty string', async () => {
      await expect(strategy.proccess(makeGuest(''))).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when email contains spaces', async () => {
      await expect(
        strategy.proccess(makeGuest('joao silva@example.com')),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
