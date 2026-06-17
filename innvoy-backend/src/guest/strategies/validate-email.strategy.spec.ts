import { BadRequestException } from '@nestjs/common';
import { ValidateEmailStrategy } from './validate-email.strategy';
import { GuestDAO } from '../guest.dao';
import { Guest } from '../domain/guest';

const makeGuest = (email: string, overrides: Partial<Guest> = {}): Guest => ({
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
  ...overrides,
});

describe('ValidateEmailStrategy', () => {
  let strategy: ValidateEmailStrategy;
  let dao: jest.Mocked<Pick<GuestDAO, 'findByEmail'>>;

  beforeEach(() => {
    dao = { findByEmail: jest.fn().mockResolvedValue(null) };
    strategy = new ValidateEmailStrategy(dao as unknown as GuestDAO);
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

  describe('uniqueness validation', () => {
    it('should throw when email already belongs to a different guest', async () => {
      const existingGuest = makeGuest('joao@example.com', { id: 99 });
      dao.findByEmail.mockResolvedValue(existingGuest);

      const guest = makeGuest('joao@example.com', { id: 1 });
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass when the found email belongs to the same guest (update scenario)', async () => {
      const guest = makeGuest('joao@example.com', { id: 1 });
      dao.findByEmail.mockResolvedValue(guest);

      await expect(strategy.proccess(guest)).resolves.not.toThrow();
    });

    it('should throw when email is already in use and guest has no id (create scenario)', async () => {
      const existingGuest = makeGuest('joao@example.com', { id: 5 });
      dao.findByEmail.mockResolvedValue(existingGuest);

      const newGuest = makeGuest('joao@example.com', { id: undefined });
      await expect(strategy.proccess(newGuest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass when email is not found in the database', async () => {
      dao.findByEmail.mockResolvedValue(null);

      const guest = makeGuest('joao@example.com', { id: undefined });
      await expect(strategy.proccess(guest)).resolves.not.toThrow();
    });
  });
});
