import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Facade } from './facade';
import { GuestDAO } from '../guest/guest.dao';
import { Guest } from '../guest/domain/guest';
import { ValidateCPFStrategy } from '../guest/strategies/validate-cpf.strategy';
import { ValidateEmailStrategy } from '../guest/strategies/validate-email.strategy';
import { ValidateRequiredFieldsStrategy } from '../guest/strategies/validate-required-fields.strategy';

const makeGuest = (): Guest =>
  Object.assign(new Guest(), {
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

describe('Facade', () => {
  let facade: Facade;
  let dao: jest.Mocked<GuestDAO>;
  let validateRequired: jest.Mocked<ValidateRequiredFieldsStrategy>;
  let validateCPF: jest.Mocked<ValidateCPFStrategy>;
  let validateEmail: jest.Mocked<ValidateEmailStrategy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Facade,
        {
          provide: GuestDAO,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            deactivate: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: ValidateRequiredFieldsStrategy,
          useValue: { proccess: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: ValidateCPFStrategy,
          useValue: { proccess: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: ValidateEmailStrategy,
          useValue: { proccess: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    facade = module.get(Facade);
    dao = module.get(GuestDAO);
    validateRequired = module.get(ValidateRequiredFieldsStrategy);
    validateCPF = module.get(ValidateCPFStrategy);
    validateEmail = module.get(ValidateEmailStrategy);
  });

  describe('create', () => {
    it('should run all registered strategies then save via DAO', async () => {
      const guest = makeGuest();
      dao.save.mockResolvedValue(guest);

      const result = await facade.create(guest);

      expect(validateRequired.proccess).toHaveBeenCalledWith(guest);
      expect(validateCPF.proccess).toHaveBeenCalledWith(guest);
      expect(validateEmail.proccess).toHaveBeenCalledWith(guest);
      expect(dao.save).toHaveBeenCalledWith(guest);
      expect(result).toBe(guest);
    });

    it('should normalize CPF to digits before validating and saving', async () => {
      const guest = makeGuest();
      dao.save.mockResolvedValue(guest);

      await facade.create(guest);

      expect(validateCPF.proccess).toHaveBeenCalledWith(
        expect.objectContaining({ cpf: '52998224725' }),
      );
      expect(dao.save).toHaveBeenCalledWith(
        expect.objectContaining({ cpf: '52998224725' }),
      );
    });

    it('should not save when required fields validation fails', async () => {
      const guest = makeGuest();
      validateRequired.proccess.mockRejectedValue(
        new BadRequestException('Required field missing'),
      );

      await expect(facade.create(guest)).rejects.toThrow(BadRequestException);
      expect(dao.save).not.toHaveBeenCalled();
    });

    it('should not save when CPF validation fails', async () => {
      const guest = makeGuest();
      validateCPF.proccess.mockRejectedValue(
        new BadRequestException('Invalid CPF'),
      );

      await expect(facade.create(guest)).rejects.toThrow(BadRequestException);
      expect(dao.save).not.toHaveBeenCalled();
    });

    it('should not save when email validation fails', async () => {
      const guest = makeGuest();
      validateEmail.proccess.mockRejectedValue(
        new BadRequestException('Invalid email'),
      );

      await expect(facade.create(guest)).rejects.toThrow(BadRequestException);
      expect(dao.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should run required fields and email strategies then update via DAO', async () => {
      const guest = makeGuest();
      dao.update.mockResolvedValue(guest);

      const result = await facade.update(guest);

      expect(validateRequired.proccess).toHaveBeenCalledWith(guest);
      expect(validateEmail.proccess).toHaveBeenCalledWith(guest);
      expect(dao.update).toHaveBeenCalledWith(guest);
      expect(result).toBe(guest);
    });

    it('should normalize CPF to digits before validating and updating', async () => {
      const guest = makeGuest();
      dao.update.mockResolvedValue(guest);

      await facade.update(guest);

      expect(dao.update).toHaveBeenCalledWith(
        expect.objectContaining({ cpf: '52998224725' }),
      );
    });

    it('should not run CPF validation on update', async () => {
      const guest = makeGuest();
      dao.update.mockResolvedValue(guest);

      await facade.update(guest);

      expect(validateCPF.proccess).not.toHaveBeenCalled();
    });

    it('should not update when required fields validation fails', async () => {
      const guest = makeGuest();
      validateRequired.proccess.mockRejectedValue(
        new BadRequestException('Required field missing'),
      );

      await expect(facade.update(guest)).rejects.toThrow(BadRequestException);
      expect(dao.update).not.toHaveBeenCalled();
    });

    it('should not update when email validation fails', async () => {
      const guest = makeGuest();
      validateEmail.proccess.mockRejectedValue(
        new BadRequestException('Invalid email'),
      );

      await expect(facade.update(guest)).rejects.toThrow(BadRequestException);
      expect(dao.update).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should delegate to DAO with the entity id', async () => {
      const guest = makeGuest();
      dao.deactivate.mockResolvedValue(undefined);

      await facade.deactivate(guest);

      expect(dao.deactivate).toHaveBeenCalledWith(1);
    });

    it('should not run any validation strategy on deactivate', async () => {
      const guest = makeGuest();
      dao.deactivate.mockResolvedValue(undefined);

      await facade.deactivate(guest);

      expect(validateRequired.proccess).not.toHaveBeenCalled();
      expect(validateCPF.proccess).not.toHaveBeenCalled();
      expect(validateEmail.proccess).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should delegate to DAO and return the results', async () => {
      const guest = makeGuest();
      const guests = [makeGuest()];
      dao.findAll.mockResolvedValue(guests);

      const result = await facade.findAll(guest);

      expect(dao.findAll).toHaveBeenCalledWith(guest);
      expect(result).toBe(guests);
    });

    it('should not run any validation strategy on findAll', async () => {
      const guest = makeGuest();
      dao.findAll.mockResolvedValue([]);

      await facade.findAll(guest);

      expect(validateRequired.proccess).not.toHaveBeenCalled();
      expect(validateCPF.proccess).not.toHaveBeenCalled();
      expect(validateEmail.proccess).not.toHaveBeenCalled();
    });
  });

  describe('entity type resolution', () => {
    it('should throw when entity type has no registered DAO', async () => {
      const unknownEntity = { id: 1, active: true };

      await expect(facade.create(unknownEntity as Guest)).rejects.toThrow(
        'No DAO registered for entity type: Object',
      );
    });
  });
});
