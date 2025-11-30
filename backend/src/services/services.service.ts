import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Service } from "./service.entity";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Barbershop } from "src/barbershops/barbershop.entity";

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private repo: Repository<Service>,

    @InjectRepository(Barbershop)
    private shopsRepo: Repository<Barbershop>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ["barberia"],
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const service = await this.repo.findOne({
      where: { id },
      relations: ["barberia"],
    });

    if (!service) throw new NotFoundException("Servicio no encontrado");
    return service;
  }

  async create(dto: CreateServiceDto) {
    const barberia = await this.shopsRepo.findOne({ where: { id: dto.barbershopId } });

    if (!barberia) throw new NotFoundException("Barbería no encontrada");

    const service = this.repo.create({
      nombre: dto.nombre,
      precio: dto.precio,
      duracion: dto.duracion,
      barberia,
    });

    return this.repo.save(service);
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.findOne(id);

    Object.assign(service, dto);

    return this.repo.save(service);
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    return this.repo.remove(service);
  }

  findByBarbershop(shopId: number) {
    return this.repo.find({
      where: { barberia: { id: shopId } },
      relations: ["barberia"],
    });
  }
}
