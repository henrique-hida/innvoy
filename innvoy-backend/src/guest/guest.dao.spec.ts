import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GuestDAO } from './guest.dao';
import { Guest } from './domain/guest';

const makeGuest = (): Guest => ({
  id: 1,
  fullName: 'João da Silva',
  cpf: '52998224725',
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

describe('GuestDAO', () => {
  let dao: GuestDAO;
  let repo: jest.Mocked<Repository<Guest>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestDAO,
        {
          provide: getRepositoryToken(Guest),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    dao = module.get(GuestDAO);
    repo = module.get(getRepositoryToken(Guest));
  });

  describe('save', () => {
    it('should call repository.save and return the saved guest', async () => {
      const guest = makeGuest();
      repo.save.mockResolvedValue(guest);

      const result = await dao.save(guest);

      expect(repo.save).toHaveBeenCalledWith(guest);
      expect(result).toEqual(guest);
    });
  });

  describe('update', () => {
    it('should call repository.save with the updated guest', async () => {
      const guest = { ...makeGuest(), fullName: 'João Atualizado' };
      repo.save.mockResolvedValue(guest);

      const result = await dao.update(guest);

      expect(repo.save).toHaveBeenCalledWith(guest);
      expect(result).toEqual(guest);
    });
  });

  describe('deactivate', () => {
    it('should call repository.update with active set to false for the given id', async () => {
      repo.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await dao.deactivate(1);

      expect(repo.update).toHaveBeenCalledWith(1, { active: false });
    });
  });

  describe('findAll', () => {
    it('should call repository.find with the provided filters as where clause', async () => {
      const filters: Partial<Guest> = { active: true };
      const guests = [makeGuest()];
      repo.find.mockResolvedValue(guests);

      const result = await dao.findAll(filters);

      expect(repo.find).toHaveBeenCalledWith({ where: filters });
      expect(result).toEqual(guests);
    });

    it('should return all guests when filters are empty', async () => {
      const guests = [makeGuest()];
      repo.find.mockResolvedValue(guests);

      const result = await dao.findAll({});

      expect(repo.find).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(guests);
    });

    it('should return an empty array when no guests match the filters', async () => {
      repo.find.mockResolvedValue([]);

      const result = await dao.findAll({
        fullName: 'Nonexistent',
      });

      expect(result).toEqual([]);
    });
  });

  describe('findByCPF', () => {
    it('should call repository.findOneBy with the given CPF and return the guest', async () => {
      const guest = makeGuest();
      repo.findOneBy.mockResolvedValue(guest);

      const result = await dao.findByCPF('52998224725');

      expect(repo.findOneBy).toHaveBeenCalledWith({ cpf: '52998224725' });
      expect(result).toEqual(guest);
    });

    it('should return null when no guest has the given CPF', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await dao.findByCPF('99999999999');

      expect(repo.findOneBy).toHaveBeenCalledWith({ cpf: '99999999999' });
      expect(result).toBeNull();
    });
  });
});
