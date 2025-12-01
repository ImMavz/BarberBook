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
    private readonly repo: Repository<Payment>,

    @InjectRepository(Barber)
    private readonly barbersRepo: Repository<Barber>,
  ) {}

  // ➤ Crear un pago
  async create(dto: CreatePaymentDto) {
    const barber = await this.barbersRepo.findOne({
      where: { id: dto.barberoId },
    });

    if (!barber) throw new NotFoundException("Barbero no encontrado");

    const payment = this.repo.create({
      monto: dto.monto,
      estado: dto.estado,
      metodo: dto.metodo ?? "",   // evita error si viene null
      barbero: barber,
    });

    return this.repo.save(payment);
  }

  // ➤ Listar todos los pagos
  findAll() {
    return this.repo.find({
      relations: ["barbero"],
      order: { fechaPago: "DESC" },
    });
  }

  // ➤ Obtener un pago por ID
  async findOne(id: number) {
    const payment = await this.repo.findOne({
      where: { id },
      relations: ["barbero"],
    });

    if (!payment) throw new NotFoundException("Pago no encontrado");

    return payment;
  }

  // ➤ Actualizar un pago
  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (dto.barberoId) {
      const barber = await this.barbersRepo.findOne({
        where: { id: dto.barberoId },
      });

      if (!barber) throw new NotFoundException("Barbero no encontrado");
      payment.barbero = barber;
    }

    if (dto.monto !== undefined) payment.monto = dto.monto;
    if (dto.estado !== undefined) payment.estado = dto.estado;
    if (dto.metodo !== undefined) payment.metodo = dto.metodo ?? "";

    return this.repo.save(payment);
  }

  // ➤ Eliminar un pago
  async remove(id: number) {
    const payment = await this.findOne(id);
    return this.repo.remove(payment);
  }
}
