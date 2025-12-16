import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: Repository<User>;
  let barbersRepo: Repository<Barber>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Barber), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
    barbersRepo = module.get<Repository<Barber>>(getRepositoryToken(Barber));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const dto = { correo: 'test@test.com', contraseña: '123456' };
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(usersRepo, 'create').mockReturnValue(dto as any);
      jest.mock('bcrypt', () => ({
        hash: jest.fn().mockResolvedValue('hashedpassword'),
      }));
      jest.spyOn(usersRepo, 'save').mockResolvedValue({ ...dto, contraseña: 'hashedpassword', id: 1 } as any);

      const result = await service.create(dto as any);

      expect(result).toHaveProperty('id', 1);
      expect(result).not.toHaveProperty('contraseña');
      expect(usersRepo.create).toHaveBeenCalledWith(dto);
      expect(usersRepo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      const dto = { correo: 'test@test.com', contraseña: '123456' };
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue({ id: 1 } as any);

      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, correo: 'test@test.com' };
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findBarberosDisponibles', () => {
    it('should return users with role "barbero" not occupied', async () => {
      const barberos = [{ usuario: { id: 1 } }, { usuario: null }];
      const availableUsers = [{ id: 2, rol: 'barbero' }];
      jest.spyOn(barbersRepo, 'find').mockResolvedValue(barberos as any);
      jest.spyOn(usersRepo, 'find').mockResolvedValue(availableUsers as any);

      const result = await service.findBarberosDisponibles();
      expect(result).toEqual(availableUsers);
      expect(barbersRepo.find).toHaveBeenCalled();
      expect(usersRepo.find).toHaveBeenCalled();
    });
  });
});
