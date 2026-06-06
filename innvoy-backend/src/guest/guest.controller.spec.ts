import { Test, TestingModule } from '@nestjs/testing';
import { GuestController } from './guest.controller';
import { GuestFacade } from './guest.facade';
import { Guest } from './domain/guest';

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

describe('GuestController', () => {
  let controller: GuestController;
  let facade: jest.Mocked<GuestFacade>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestController],
      providers: [
        {
          provide: GuestFacade,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            deactivate: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GuestController>(GuestController);
    facade = module.get(GuestFacade);
  });

  describe('create', () => {
    it('should delegate to facade.create and return the created guest', async () => {
      const guest = makeGuest();
      facade.create.mockResolvedValue(guest);

      const result = await controller.create(guest);

      expect(facade.create).toHaveBeenCalledWith(guest);
      expect(result).toBe(guest);
    });
  });

  describe('update', () => {
    it('should delegate to facade.update and return the updated guest', async () => {
      const guest = makeGuest();
      facade.update.mockResolvedValue(guest);

      const result = await controller.update(guest);

      expect(facade.update).toHaveBeenCalledWith(guest);
      expect(result).toBe(guest);
    });
  });

  describe('deactivate', () => {
    it('should delegate to facade.deactivate with the guest id', async () => {
      facade.deactivate.mockResolvedValue(undefined);

      await controller.deactivate(1);

      expect(facade.deactivate).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should delegate to facade.findAll and return the list of guests', async () => {
      const filters: Partial<Guest> = { fullName: 'João', active: true };
      const guests = [makeGuest()];
      facade.findAll.mockResolvedValue(guests);

      const result = await controller.findAll(filters);

      expect(facade.findAll).toHaveBeenCalledWith(filters);
      expect(result).toBe(guests);
    });

    it('should call facade.findAll with empty filters when no filters provided', async () => {
      facade.findAll.mockResolvedValue([]);

      const result = await controller.findAll({});

      expect(facade.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });
  });
});
