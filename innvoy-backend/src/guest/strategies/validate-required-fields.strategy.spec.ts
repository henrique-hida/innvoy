import { BadRequestException } from '@nestjs/common';
import { ValidateRequiredFieldsStrategy } from './validate-required-fields.strategy';
import { Guest } from '../domain/guest';

const makeGuest = (): Guest => ({
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
});

describe('ValidateRequiredFieldsStrategy', () => {
  let strategy: ValidateRequiredFieldsStrategy;

  beforeEach(() => {
    strategy = new ValidateRequiredFieldsStrategy();
  });

  it('should pass when all required fields are present', async () => {
    await expect(strategy.proccess(makeGuest())).resolves.not.toThrow();
  });

  describe('personal data', () => {
    it('should throw when fullName is empty', async () => {
      const guest = { ...makeGuest(), fullName: '' };
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when cpf is empty', async () => {
      const guest = { ...makeGuest(), cpf: '' };
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when dateOfBirth is missing', async () => {
      const guest = { ...makeGuest(), dateOfBirth: null as unknown as Date };
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when phone is empty', async () => {
      const guest = { ...makeGuest(), phone: '' };
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when email is empty', async () => {
      const guest = { ...makeGuest(), email: '' };
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('address fields', () => {
    const withAddress = (overrides: object): Guest => ({
      ...makeGuest(),
      address: { ...makeGuest().address, ...overrides },
    });

    it('should throw when street is empty', async () => {
      await expect(
        strategy.proccess(withAddress({ street: '' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when address number is empty', async () => {
      await expect(
        strategy.proccess(withAddress({ number: '' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when zipCode is empty', async () => {
      await expect(
        strategy.proccess(withAddress({ zipCode: '' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when neighborhood is empty', async () => {
      await expect(
        strategy.proccess(withAddress({ neighborhood: '' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when complement is empty', async () => {
      await expect(
        strategy.proccess(withAddress({ complement: '' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when city name is empty', async () => {
      const guest = withAddress({
        city: { name: '', state: makeGuest().address.city.state },
      });
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when state name is empty', async () => {
      const guest = withAddress({
        city: { name: 'São Paulo', state: { name: '', abbreviation: 'SP' } },
      });
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when state abbreviation is empty', async () => {
      const guest = withAddress({
        city: {
          name: 'São Paulo',
          state: { name: 'São Paulo', abbreviation: '' },
        },
      });
      await expect(strategy.proccess(guest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
