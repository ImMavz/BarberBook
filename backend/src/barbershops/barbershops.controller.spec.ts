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

  describe('findOne', () => {
    it('should return a barbershop with rating', async () => {
      const barberia = { id: 1, reseñas: [{ calificacionBarberia: 5 }] };
      jest.spyOn(repo, 'findOne').mockResolvedValue(barberia as any);

      const result = await service.findOne(1);
      expect(result.rating).toBe(5);
      expect(result.reviews).toBe(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['dueño', 'barberos', 'servicios', 'reseñas'],
      });
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
  });

  describe('filter', () => {
    it('should return filtered barbershops', async () => {
      const queryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      };
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const result = await service.filter({ nombre: 'A', servicio: 'B' } as any);
      expect(result).toEqual([{ id: 1 }]);
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('barberias'); // ajustado a tu alias real
    });
  });
});
