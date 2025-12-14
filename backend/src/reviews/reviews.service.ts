import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";
import { Review } from "./review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";
import { Appointment } from "src/appointments/appointment.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private repo: Repository<Review>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Barber)
    private barbersRepo: Repository<Barber>,

    @InjectRepository(Barbershop)
    private barbershopsRepo: Repository<Barbershop>,

    @InjectRepository(Appointment)
    private appointmentsRepo: Repository<Appointment>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["cliente", "barbero", "barberia"],
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const review = await this.repo.findOne({
      where: { id },
      relations: ["cliente", "barbero", "barberia"],
    });

    if (!review) throw new NotFoundException("Reseña no encontrada");
    return review;
  }

  async create(dto: CreateReviewDto, clienteId: number) {
    const cita = await this.appointmentsRepo.findOne({
      where: { id: dto.citaId },
      relations: ["cliente"],
    });

    if (!cita) {
      throw new NotFoundException("Cita no encontrada");
    }

    if (cita.estado !== "pendiente") {
      throw new ForbiddenException("La cita aún no ha finalizado");
    }

    // 🚫 Evitar doble reseña
    const existe = await this.repo.findOne({
      where: { cita: { id: dto.citaId } },
    });

    if (existe) {
      throw new ForbiddenException("Esta cita ya fue reseñada");
    }

    // 🔐 Cliente desde JWT
    const cliente = await this.usersRepo.findOneBy({
      id: clienteId,
    });

    if (!cliente) {
      throw new NotFoundException("Cliente no encontrado");
    }

    const barbero = await this.barbersRepo.findOneBy({
      id: dto.barberoId,
    });

    const barberia = await this.barbershopsRepo.findOneBy({
      id: dto.barberiaId,
    });

    const review = this.repo.create({
      calificacionBarbero: dto.calificacionBarbero,
      comentarioBarbero: dto.comentarioBarbero ?? null,
      calificacionBarberia: dto.calificacionBarberia,
      comentarioBarberia: dto.comentarioBarberia ?? null,
      cliente,
      barbero,
      barberia,
      cita,
    } as DeepPartial<Review>);

    return this.repo.save(review);
  }



  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.findOne(id);

    Object.assign(review, dto);

    return this.repo.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.repo.remove(review);
  }

  async promedioBarbero(barberoId: number) {
  const { avg } = await this.repo
    .createQueryBuilder("r")
    .select("AVG(r.calificacionBarbero)", "avg")
    .where("r.barbero = :id", { id: barberoId })
    .getRawOne();

    return Number(avg) || 0;
  }

async promedioBarberia(barberiaId: number) {
  const { avg } = await this.repo
    .createQueryBuilder("r")
    .select("AVG(r.calificacionBarberia)", "avg")
    .where("r.barberia = :id", { id: barberiaId })
    .getRawOne();

    return Number(avg) || 0;
  }

  async findByBarberia(barberiaId: number) {
    return this.repo.find({
      where: { barberia: { id: barberiaId } },
      relations: ["cliente"],
      order: { fecha: "DESC" },
    });
  }

  async findByBarbero(barberoId: number) {
    return this.repo.find({
      where: { barbero: { id: barberoId } },
      relations: ["cliente"],
      order: { fecha: "DESC" },
    });
  }

}