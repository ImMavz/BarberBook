import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findBarberosDisponibles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto = { correo: 'test@test.com', contraseña: '123456' };
      const user = { id: 1, correo: 'test@test.com' };
      jest.spyOn(service, 'create').mockResolvedValue(user as any);

      const result = await controller.create(dto as any);
      expect(result).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { sub: 1 } };
      const user = { id: 1, correo: 'test@test.com' };
      jest.spyOn(service, 'findOne').mockResolvedValue(user as any);

      const result = await controller.getProfile(req as any);
      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getBarberosDisponibles', () => {
    it('should return available barbers', async () => {
      const barbers = [{ id: 1, correo: 'b1@test.com' }];
      jest.spyOn(service, 'findBarberosDisponibles').mockResolvedValue(barbers as any);

      const result = await controller.getBarberosDisponibles();
      expect(result).toEqual(barbers);
      expect(service.findBarberosDisponibles).toHaveBeenCalled();
    });
  });
});
