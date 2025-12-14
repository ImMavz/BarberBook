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
    private readonly repo: Repository<Barber>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Barbershop)
    private readonly shopsRepo: Repository<Barbershop>
  ) {}

  // ============================
  // 🔹 Obtener todos
  // ============================
  async findAll() {
    return this.repo.find({
      relations: ["usuario", "barberia"],
    });
  }

  // ============================
  // 🔹 Obtener por ID
  // ============================
  async findOne(id: number) {
    const barber = await this.repo.findOne({
      where: { id },
      relations: ["usuario", "barberia", "horarios", "citas"],
    });

    if (!barber) throw new NotFoundException("Barbero no encontrado");
    return barber;
  }

  // ============================
  // 🔹 Obtener perfil por ID de usuario (JWT)
  // ============================
  async findByUserId(idUsuario: number) {
    const barber = await this.repo.findOne({
      where: { usuario: { id: idUsuario } },
      relations: [
        "usuario",
        "barberia",
        "citas",
        "citas.servicio",
        "citas.cliente",
      ],
    });

    if (!barber) {
      throw new NotFoundException("Este usuario no es un barbero");
    }

    return barber;
  }

  // ============================
  // 🔹 Crear barbero
  // ============================
  async create(dto: CreateBarberDto) {
    const usuario = await this.usersRepo.findOne({
      where: { id: dto.id_usuario },
    });

    const barberia = await this.shopsRepo.findOne({
      where: { id: dto.id_barberia },
    });

    if (!usuario) throw new NotFoundException("Usuario no existe");
    if (!barberia) throw new NotFoundException("Barbería no existe");

    const barber = this.repo.create({
      ...dto,
      usuario,
      barberia,
    });

    return this.repo.save(barber);
  }

  // ============================
  // 🔹 Actualizar barbero
  // ============================
  async update(id: number, dto: UpdateBarberDto) {
    const barber = await this.findOne(id);
    Object.assign(barber, dto);
    return this.repo.save(barber);
  }

  // ============================
  // 🔹 Eliminar barbero
  // ============================
  async remove(id: number) {
    const barber = await this.findOne(id);
    return this.repo.remove(barber);
  }
  
  //Barberos de la barberia
  async findByBarbershop(barbershopId: number) {
    return this.repo.find({
      where: { barberia: { id: barbershopId } },
      relations: ["usuario"], // 👈 ESTA ES LA CLAVE
    });
  }


}
