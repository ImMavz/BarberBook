import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Barbershop } from "./barbershop.entity";
import { CreateBarbershopDto } from "./dto/create-barbershop.dto";
import { UpdateBarbershopDto } from "./dto/update-barbershop.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private repo: Repository<Barbershop>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["dueño", "barberos", "servicios", "reseñas"],
    });
  }

  async findOne(id: number) {
    const barberia = await this.repo.findOne({
      where: { id },
      relations: ["dueño", "barberos", "servicios", "reseñas"],
    });

    if (!barberia) throw new NotFoundException("Barbería no encontrada");
    return barberia;
  }

  async create(dto: CreateBarbershopDto) {
    const dueño = await this.userRepo.findOne({
      where: { id: dto.dueñoId },
    });

    if (!dueño) throw new NotFoundException("Dueño (usuario) no encontrado");

    const barberia = this.repo.create({
      nombre: dto.nombre,
      direccion: dto.direccion,
      horariosGlobales: dto.horariosGlobales || null,
      dueño,
    });

    return this.repo.save(barberia);
  }

  async update(id: number, dto: UpdateBarbershopDto) {
    const barberia = await this.findOne(id);

    Object.assign(barberia, {
      nombre: dto.nombre ?? barberia.nombre,
      direccion: dto.direccion ?? barberia.direccion,
      horariosGlobales: dto.horariosGlobales ?? barberia.horariosGlobales,
    });

    return this.repo.save(barberia);
  }

  async remove(id: number) {
    const barberia = await this.findOne(id);
    return this.repo.remove(barberia);
  }
}
