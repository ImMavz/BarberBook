import { Test, TestingModule } from '@nestjs/testing';
import { BarbershopsService } from './barbershops.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Barbershop } from './barbershop.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BarbershopsService', () => {
  let service: BarbershopsService;
  let repo: Repository<Barbershop>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarbershopsService,
        { provide: getRepositoryToken(Barbershop), useClass: Repository },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<BarbershopsService>(BarbershopsService);
    repo = module.get<Repository<Barbershop>>(getRepositoryToken(Barbershop));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all barbershops with rating', async () => {
      const barberias = [
        {
          id: 1,
          nombre: 'Barbería A',
          reseñas: [{ calificacionBarberia: 5 }, { calificacionBarberia: 3 }],
        },
      ];

      jest.spyOn(repo, 'find').mockResolvedValue(barberias as any);

      const result = await service.findAll();

      expect(result[0].rating).toBe(4);
      expect(result[0].reviews).toBe(2);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['dueño', 'barberos', 'servicios', 'reseñas'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a barbershop with rating', async () => {
      const barberia = {
        id: 1,
        nombre: 'Barbería A',
        reseñas: [{ calificacionBarberia: 4 }, { calificacionBarberia: 5 }],
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(barberia as any);

      const result = await service.findOne(1);
      expect(result.rating).toBe(4.5);
      expect(result.reviews).toBe(2);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['dueño', 'barberos', 'servicios', 'reseñas'],
      });
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new barbershop', async () => {
      const dto = { nombre: 'Barbería', direccion: 'Calle 1', dueñoId: 1 };
      const dueño = { id: 1 };
      const barberia = { id: 1, nombre: dto.nombre, direccion: dto.direccion, dueño, horariosGlobales: null };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(dueño as any);
      jest.spyOn(repo, 'create').mockReturnValue(barberia as any);
      jest.spyOn(repo, 'save').mockResolvedValue(barberia as any);

      const result = await service.create(dto as any);
      expect(result).toEqual(barberia);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.dueñoId } });
      expect(repo.create).toHaveBeenCalledWith({
        nombre: dto.nombre,
        direccion: dto.direccion,
        dueño,
        horariosGlobales: null,
      });
      expect(repo.save).toHaveBeenCalledWith(barberia);
    });

    it('should throw NotFoundException if owner not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ nombre: 'A', direccion: 'Calle', dueñoId: 1 } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByOwner', () => {
    it('should return barbershops by owner id', async () => {
      const barberias = [{ id: 1 }];
      jest.spyOn(repo, 'find').mockResolvedValue(barberias as any);

      const result = await service.findByOwner(1);
      expect(result).toEqual(barberias);
      expect(repo.find).toHaveBeenCalledWith({ where: { dueño: { id: 1 } } });
    });
  });
});
