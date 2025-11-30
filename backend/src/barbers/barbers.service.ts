import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Barber } from "./barber.entity";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UpdateBarberDto } from "./dto/update-barber.dto";
import { User } from "src/users/user.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private repo: Repository<Barber>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Barbershop)
    private shopsRepo: Repository<Barbershop>
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["usuario", "barberia"],
    });
  }

  async findOne(id: number) {
    const barber = await this.repo.findOne({
      where: { id },
      relations: ["usuario", "barberia", "horarios", "citas"],
    });

    if (!barber) throw new NotFoundException("Barbero no encontrado");
    return barber;
  }

  async create(dto: CreateBarberDto) {
    const usuario = await this.usersRepo.findOne({ where: { id: dto.id_usuario } });
    const barberia = await this.shopsRepo.findOne({ where: { id: dto.id_barberia } });

    if (!usuario) throw new NotFoundException("Usuario no existe");
    if (!barberia) throw new NotFoundException("Barbería no existe");

    const barber = this.repo.create({
      ...dto,
      usuario,
      barberia,
    });

    return this.repo.save(barber);
  }

  async update(id: number, dto: UpdateBarberDto) {
    const barber = await this.findOne(id);
    Object.assign(barber, dto);
    return this.repo.save(barber);
  }

  async remove(id: number) {
    const barber = await this.findOne(id);
    return this.repo.remove(barber);
  }
}
