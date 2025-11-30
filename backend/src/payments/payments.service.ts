import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { Barber } from "src/barbers/barber.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private repo: Repository<Payment>,

    @InjectRepository(Barber)
    private barbersRepo: Repository<Barber>
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["barbero"],
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const payment = await this.repo.findOne({
      where: { id },
      relations: ["barbero"],
    });

    if (!payment) throw new NotFoundException("Pago no encontrado");
    return payment;
  }

  async create(dto: CreatePaymentDto) {
    const barbero = await this.barbersRepo.findOne({
      where: { id: dto.barberoId },
    });

    if (!barbero) throw new NotFoundException("Barbero no encontrado");

    const payment = this.repo.create({
      monto: dto.monto,
      estado: dto.estado,
      metodo: dto.metodo ?? null,
      barbero,
    });

    return this.repo.save(payment);
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment, dto);
    return this.repo.save(payment);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    return this.repo.remove(payment);
  }
}
