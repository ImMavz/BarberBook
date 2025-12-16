import { Test, TestingModule } from '@nestjs/testing';
import { BarbersService } from './barbers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Barber } from './barber.entity';
import { User } from 'src/users/user.entity';
import { Barbershop } from 'src/barbershops/barbershop.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BarbersService', () => {
  let service: BarbersService;
  let repo: Repository<Barber>;
  let usersRepo: Repository<User>;
  let shopsRepo: Repository<Barbershop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarbersService,
        { provide: getRepositoryToken(Barber), useClass: Repository },
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Barbershop), useClass: Repository },
      ],
    }).compile();

    service = module.get<BarbersService>(BarbersService);
    repo = module.get<Repository<Barber>>(getRepositoryToken(Barber));
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
    shopsRepo = module.get<Repository<Barbershop>>(getRepositoryToken(Barbershop));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all barbers', async () => {
      const barbers = [{ id: 1 }, { id: 2 }];
      jest.spyOn(repo, 'find').mockResolvedValue(barbers as any);

      const result = await service.findAll();
      expect(result).toEqual(barbers);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['usuario', 'barberia'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a barber by id', async () => {
      const barber = { id: 1 };
      jest.spyOn(repo, 'findOne').mockResolvedValue(barber as any);

      const result = await service.findOne(1);
      expect(result).toEqual(barber);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['usuario', 'barberia', 'horarios', 'citas'],
      });
    });

    it('should throw NotFoundException if barber not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return a barber by user id', async () => {
      const barber = { id: 1 };
      jest.spyOn(repo, 'findOne').mockResolvedValue(barber as any);

      const result = await service.findByUserId(1);
      expect(result).toEqual(barber);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: 1 } },
        relations: ['usuario', 'barberia', 'citas', 'citas.servicio', 'citas.cliente'],
      });
    });

    it('should throw NotFoundException if no barber for user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findByUserId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
  it('should create a new barber', async () => {
    const dto = { id_usuario: 1, id_barberia: 1, experiencia: 5, descripcion: 'Barber experto' };
    const usuario = { id: 1 } as any;
    const barberia = { id: 1 } as any;
    const barber = { ...dto, usuario, barberia, id: 1 } as any;

    // Mockear repos
    jest.spyOn(usersRepo, 'findOne').mockResolvedValue(usuario);
    jest.spyOn(shopsRepo, 'findOne').mockResolvedValue(barberia);
    jest.spyOn(repo, 'create').mockReturnValue(barber);
    jest.spyOn(repo, 'save').mockResolvedValue(barber);

    const result = await service.create(dto as any);

    expect(result).toEqual(barber);
    expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.id_usuario } });
    expect(shopsRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.id_barberia } });
    expect(repo.create).toHaveBeenCalledWith({ ...dto, usuario, barberia });
    expect(repo.save).toHaveBeenCalledWith(barber);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const dto = { id_usuario: 1, id_barberia: 1 } as any;

    jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(shopsRepo, 'findOne').mockResolvedValue({ id: 1 } as any); // Mock válido para barbería

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if barbershop does not exist', async () => {
    const dto = { id_usuario: 1, id_barberia: 1 } as any;

    jest.spyOn(usersRepo, 'findOne').mockResolvedValue({ id: 1 } as any); // Mock válido para usuario
    jest.spyOn(shopsRepo, 'findOne').mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });
});


  describe('update', () => {
    it('should update a barber', async () => {
      const barber = { id: 1, nombre: 'Old' };
      const dto = { nombre: 'New' };

      jest.spyOn(service, 'findOne').mockResolvedValue(barber as any);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...barber, ...dto });

      const result = await service.update(1, dto as any);
      expect(result).toEqual({ ...barber, ...dto });
      expect(repo.save).toHaveBeenCalledWith({ ...barber, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a barber', async () => {
      const barber = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(barber as any);
      jest.spyOn(repo, 'remove').mockResolvedValue(barber as any);

      const result = await service.remove(1);
      expect(result).toEqual(barber);
      expect(repo.remove).toHaveBeenCalledWith(barber);
    });
  });

  describe('findByBarbershop', () => {
    it('should return barbers by barbershop id', async () => {
      const barbers = [{ id: 1 }];
      jest.spyOn(repo, 'find').mockResolvedValue(barbers as any);

      const result = await service.findByBarbershop(1);
      expect(result).toEqual(barbers);
      expect(repo.find).toHaveBeenCalledWith({
        where: { barberia: { id: 1 } },
        relations: ['usuario'],
      });
    });
  });
});
