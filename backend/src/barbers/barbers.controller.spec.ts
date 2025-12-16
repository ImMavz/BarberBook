import { Test, TestingModule } from '@nestjs/testing';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';

describe('BarbersController', () => {
  let controller: BarbersController;
  let service: BarbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarbersController],
      providers: [
        {
          provide: BarbersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByBarbershop: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BarbersController>(BarbersController);
    service = module.get<BarbersService>(BarbersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all barbers', async () => {
      const barbers = [{ id: 1 }];
      (service.findAll as jest.Mock).mockResolvedValue(barbers);

      expect(await controller.findAll()).toEqual(barbers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return barber by id', async () => {
      const barber = { id: 1 };
      (service.findOne as jest.Mock).mockResolvedValue(barber);

      expect(await controller.findOne('1')).toEqual(barber);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getProfile', () => {
    it('should return barber profile', async () => {
      const barber = { id: 1 };
      const req = { user: { sub: 1 } };
      (service.findByUserId as jest.Mock).mockResolvedValue(barber);

      expect(await controller.getProfile(req as any)).toEqual(barber);
      expect(service.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create barber', async () => {
      const dto = { nombre: 'Barber1' };
      const barber = { id: 1, nombre: 'Barber1' };
      (service.create as jest.Mock).mockResolvedValue(barber);

      expect(await controller.create(dto as any)).toEqual(barber);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update barber', async () => {
      const dto = { nombre: 'Updated' };
      const barber = { id: 1, nombre: 'Updated' };
      (service.update as jest.Mock).mockResolvedValue(barber);

      expect(await controller.update('1', dto as any)).toEqual(barber);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should remove barber', async () => {
      const barber = { id: 1 };
      (service.remove as jest.Mock).mockResolvedValue(barber);

      expect(await controller.delete('1')).toEqual(barber);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByBarbershop', () => {
    it('should return barbers of a barbershop', async () => {
      const barbers = [{ id: 1 }];
      (service.findByBarbershop as jest.Mock).mockResolvedValue(barbers);

      expect(await controller.findByBarbershop('1')).toEqual(barbers);
      expect(service.findByBarbershop).toHaveBeenCalledWith(1);
    });
  });
});
