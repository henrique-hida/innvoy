import { BadRequestException } from '@nestjs/common';
import { ValidateCPFStrategy } from './validate-cpf.strategy';
import { GuestDAO } from '../guest.dao';
import { Guest } from '../domain/guest';

const makeGuest = (overrides: Partial<Guest> = {}): Guest => ({
  id: 1,
  fullName: 'João da Silva',
  cpf: '529.982.247-25',
  dateOfBirth: new Date('1990-01-15'),
  phone: '(11) 99999-9999',
  email: 'joao@example.com',
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

describe('ValidateCPFStrategy', () => {
  let strategy: ValidateCPFStrategy;
  let dao: jest.Mocked<Pick<GuestDAO, 'findByCPF'>>;

  beforeEach(() => {
    dao = { findByCPF: jest.fn().mockResolvedValue(null) };
    strategy = new ValidateCPFStrategy(dao as unknown as GuestDAO);
  });

  describe('format validation', () => {
    it('should pass with a valid formatted CPF (529.982.247-25)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '529.982.247-25' })),
      ).resolves.not.toThrow();
    });

    it('should pass with a valid unformatted CPF (52998224725)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '52998224725' })),
      ).resolves.not.toThrow();
    });

    it('should pass with another valid CPF (853.513.468-93)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '853.513.468-93' })),
      ).resolves.not.toThrow();
    });

    it('should pass with a CPF whose check digits are zero (123.456.789-09)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '123.456.789-09' })),
      ).resolves.not.toThrow();
    });

    it('should throw when CPF is too short', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '123.456.789' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when CPF has too many digits', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '123.456.789-001' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when CPF contains non-numeric characters', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: 'abc.def.ghi-jk' })),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('check digit validation', () => {
    it('should throw when the first check digit is wrong', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '529.982.247-35' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when the second check digit is wrong', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '529.982.247-26' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when all digits are the same (111.111.111-11)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '111.111.111-11' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when all digits are the same (000.000.000-00)', async () => {
      await expect(
        strategy.validate(makeGuest({ cpf: '000.000.000-00' })),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uniqueness validation', () => {
    it('should throw when CPF already belongs to a different guest', async () => {
      const existingGuest = makeGuest({ id: 99 });
      dao.findByCPF.mockResolvedValue(existingGuest);

      const guest = makeGuest({ id: 1 });
      await expect(strategy.validate(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass when the found CPF belongs to the same guest (update scenario)', async () => {
      const guest = makeGuest({ id: 1 });
      dao.findByCPF.mockResolvedValue(guest);

      await expect(strategy.validate(guest)).resolves.not.toThrow();
    });

    it('should throw when CPF is already in use and guest has no id (create scenario)', async () => {
      const existingGuest = makeGuest({ id: 5 });
      dao.findByCPF.mockResolvedValue(existingGuest);

      const newGuest = makeGuest({ id: undefined });
      await expect(strategy.validate(newGuest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass when CPF is not found in the database', async () => {
      dao.findByCPF.mockResolvedValue(null);

      const guest = makeGuest({ id: undefined });
      await expect(strategy.validate(guest)).resolves.not.toThrow();
    });
  });
});
