import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { Barber } from "src/barbers/barber.entity";
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;

  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,

    @InjectRepository(Barber)
    private readonly barbersRepo: Repository<Barber>,
  ) {
    // Inicializar Mercado Pago
    // Asegurarse de tener MERCADOPAGO_ACCESS_TOKEN en el .env
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    if (accessToken) {
      this.client = new MercadoPagoConfig({ accessToken });
    } else {
      console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN no está definido');
    }
  }

  // ➤ Crear un pago (Registro manual o base)
  async create(dto: CreatePaymentDto) {
    const barber = await this.barbersRepo.findOne({
      where: { id: dto.barberoId },
    });

    if (!barber) throw new NotFoundException("Barbero no encontrado");

    const payment = this.repo.create({
      monto: dto.monto,
      estado: dto.estado,
      metodo: dto.metodo ?? "",
      barbero: barber,
    });

    return this.repo.save(payment);
  }

  // ➤ Crear Preferencia de MercadoPago
  async createPreference(title: string, quantity: number, price: number) {
    if (!this.client) {
      throw new Error("MercadoPago no está configurado correctamente");
    }

    const preference = new Preference(this.client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "servicio-barberia",
            title: title,
            quantity: quantity,
            unit_price: Number(price),
            currency_id: "COP",
          },
        ],
        back_urls: {
          success: "https://www.google.com", // Redirigir a algo válido por ahora
          failure: "https://www.google.com",
          pending: "https://www.google.com",
        },
        auto_return: "approved",
      },
    });

    return { id: result.id, init_point: result.init_point };
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
