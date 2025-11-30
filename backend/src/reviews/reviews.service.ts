import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Barbershop } from "src/barbershops/barbershop.entity";

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

  async create(dto: CreateReviewDto) {
    const cliente = await this.usersRepo.findOne({ where: { id: dto.clienteId } });
    if (!cliente) throw new NotFoundException("Cliente no encontrado");

    let barbero = null;
    if (dto.barberoId) {
      barbero = await this.barbersRepo.findOne({ where: { id: dto.barberoId } });
      if (!barbero) throw new NotFoundException("Barbero no encontrado");
    }

    let barberia = null;
    if (dto.barberiaId) {
      barberia = await this.barbershopsRepo.findOne({ where: { id: dto.barberiaId } });
      if (!barberia) throw new NotFoundException("Barbería no encontrada");
    }

    const review = this.repo.create({
      calificacion: dto.calificacion,
      comentario: dto.comentario,
      cliente,
      barbero,
      barberia,
    });

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
}
