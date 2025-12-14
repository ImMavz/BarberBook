import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./appointment.entity";
import { User } from "src/users/user.entity";
import { Barber } from "src/barbers/barber.entity";
import { Service } from "src/services/service.entity";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Barber)
    private readonly barbersRepo: Repository<Barber>,

    @InjectRepository(Service)
    private readonly servicesRepo: Repository<Service>,

    private readonly mailService: MailService
  ) {}

  // ==========================================
  // 📌 CREAR CITA
  // ==========================================
  async create(data: any) {
    const cliente = await this.usersRepo.findOne({
      where: { id: data.clienteId },
    });

    const barbero = await this.barbersRepo.findOne({
      where: { id: data.id_barbero },
      relations: ["usuario"],
    });

    const servicio = await this.servicesRepo.findOne({
      where: { id: data.id_servicio },
    });

    if (!cliente) throw new NotFoundException("Cliente no encontrado");
    if (!barbero) throw new NotFoundException("Barbero no encontrado");
    if (!servicio) throw new NotFoundException("Servicio no encontrado");

    const existe = await this.repo.findOne({
      where: {
        barbero: { id: data.id_barbero },
        fecha: data.fecha,
        horaInicio: data.horaInicio,
      },
    });

    if (existe) {
      throw new ConflictException("Ya existe una cita en este horario");
    }

    const cita = this.repo.create({
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      estado: "pendiente",
      cliente,
      barbero,
      servicio,
    });

    const saved = await this.repo.save(cita);

    // 📧 Email cliente
    if (cliente.correo) {
      await this.mailService.sendAppointmentConfirmation(cliente.correo, {
        fecha: saved.fecha,
        horaInicio: saved.horaInicio,
        barbero: barbero.usuario.nombre,
        servicio: servicio.nombre,
      });
    }

    // 📧 Email barbero
    if (barbero.usuario?.correo) {
      await this.mailService.sendNewAppointmentNotification(
        barbero.usuario.correo,
        {
          fecha: saved.fecha,
          horaInicio: saved.horaInicio,
          cliente: cliente.nombre,
          servicio: servicio.nombre,
        }
      );
    }

    return saved;
  }

  // ==========================================
  // 📌 CITAS DE UN CLIENTE
  // ==========================================
  async findByCliente(clienteId: number) {
    const citas = await this.repo.find({
      where: { cliente: { id: clienteId } },
      relations: [
        "barbero",
        "barbero.usuario",
        "barbero.barberia",
        "servicio",
      ],
      order: { fecha: "ASC" },
    });

    return citas.map((c) => this.cleanDates(c));
  }

  // ==========================================
  // 📌 CITAS DE UN BARBERO
  // ==========================================
  async findByBarbero(barberoId: number) {
    const citas = await this.repo.find({
      where: { barbero: { id: barberoId } },
      relations: ["cliente", "servicio"],
      order: { fecha: "ASC" },
    });

    return citas.map((c) => this.cleanDates(c));
  }

  // ==========================================
  // 📌 CITAS POR BARBERÍA
  // ==========================================
  async findByBarbershop(barbershopId: number) {
    return this.repo.find({
      where: { barbero: { barberia: { id: barbershopId } } },
      relations: ["barbero", "cliente", "servicio"],
    });
  }

  // ==========================================
  // 📌 OBTENER UNA CITA
  // ==========================================
  async findOne(id: number) {
    const cita = await this.repo.findOne({
      where: { id },
      relations: ["cliente", "barbero", "servicio"],
    });

    if (!cita) throw new NotFoundException("Cita no encontrada");
    return cita;
  }

  // ==========================================
  // 📌 CAMBIAR ESTADO
  // ==========================================
  async updateEstado(id: number, estado: string) {
    const cita = await this.findOne(id);
    cita.estado = estado;
    return this.repo.save(cita);
  }

  // ==========================================
  // 📌 ELIMINAR CITA
  // ==========================================
  async remove(id: number) {
    const cita = await this.findOne(id);
    return this.repo.remove(cita);
  }

  // ==========================================
  // 🧼 LIMPIAR FECHAS
  // ==========================================
  cleanDates(cita: Appointment) {
    return {
      ...cita,
      fecha: String(cita.fecha),
      horaInicio: (cita.horaInicio ?? "00:00:00").slice(0, 8),
      horaFin: (cita.horaFin ?? "00:00:00").slice(0, 8),
    };
  }
}
