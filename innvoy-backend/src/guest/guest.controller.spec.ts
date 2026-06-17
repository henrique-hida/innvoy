import { Test, TestingModule } from '@nestjs/testing';
import { GuestController } from './guest.controller';
import { Facade } from '../core/facade';
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
  let facade: jest.Mocked<Facade>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestController],
      providers: [
        {
          provide: Facade,
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
    facade = module.get(Facade);
  });

  describe('create', () => {
    it('should convert body to Guest instance and delegate to facade', async () => {
      const body = makeGuest();
      facade.create.mockResolvedValue(Object.assign(new Guest(), body));

      const result = await controller.create(body);

      expect(facade.create).toHaveBeenCalledWith(expect.any(Guest));
      expect(facade.create).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: body.fullName, cpf: body.cpf }),
      );
      expect(result.fullName).toBe(body.fullName);
    });
  });

  describe('update', () => {
    it('should convert body to Guest instance and delegate to facade', async () => {
      const body = makeGuest();
      facade.update.mockResolvedValue(Object.assign(new Guest(), body));

      const result = await controller.update(body);

      expect(facade.update).toHaveBeenCalledWith(expect.any(Guest));
      expect(facade.update).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: body.fullName }),
      );
      expect(result.fullName).toBe(body.fullName);
    });
  });

  describe('deactivate', () => {
    it('should create a Guest with the id and delegate to facade', async () => {
      facade.deactivate.mockResolvedValue(undefined);

      await controller.deactivate(1);

      expect(facade.deactivate).toHaveBeenCalledWith(expect.any(Guest));
      expect(facade.deactivate).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
      );
    });
  });

  describe('findAll', () => {
    it('should convert filters to Guest instance and delegate to facade', async () => {
      const filters: Partial<Guest> = { fullName: 'João', active: true };
      const guests = [Object.assign(new Guest(), makeGuest())];
      facade.findAll.mockResolvedValue(guests);

      const result = await controller.findAll(filters);

      expect(facade.findAll).toHaveBeenCalledWith(expect.any(Guest));
      expect(facade.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'João', active: true }),
      );
      expect(result).toBe(guests);
    });

    it('should call facade.findAll with empty Guest when no filters provided', async () => {
      facade.findAll.mockResolvedValue([]);

      const result = await controller.findAll({});

      expect(facade.findAll).toHaveBeenCalledWith(expect.any(Guest));
      expect(result).toEqual([]);
    });
  });
});
