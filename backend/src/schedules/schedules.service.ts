import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Schedule } from "./schedule.entity";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { Barber } from "src/barbers/barber.entity";

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private repo: Repository<Schedule>,

    @InjectRepository(Barber)
    private barbersRepo: Repository<Barber>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ["barbero"],
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const schedule = await this.repo.findOne({
      where: { id },
      relations: ["barbero"],
    });

    if (!schedule) throw new NotFoundException("Horario no encontrado");
    return schedule;
  }

  async create(dto: CreateScheduleDto) {
    const barbero = await this.barbersRepo.findOne({ where: { id: dto.barberoId } });

    if (!barbero) throw new NotFoundException("Barbero no encontrado");

    const schedule = this.repo.create({
      diaSemana: dto.diaSemana,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      disponible: dto.disponible ?? true,
      barbero,
    });

    return this.repo.save(schedule);
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);

    Object.assign(schedule, dto);

    return this.repo.save(schedule);
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    return this.repo.remove(schedule);
  }

  async findByBarber(barberId: number) {
    return this.repo.find({
      where: { barbero: { id: barberId } },
      relations: ["barbero"],
    });
  }
}
